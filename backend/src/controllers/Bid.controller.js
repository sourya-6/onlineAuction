import {Bid} from "../models/Bid.models.js";
import Auction from "../models/Auction.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

// 📝 Place a Bid
export const placeBid = asyncHandler(async (req, res) => {
  const { auctionId } = req.params;
  const { amount } = req.body;
  const userId = req.user._id;

  const auction = await Auction.findById(auctionId);
  if (!auction) throw new ApiError(404, "Auction not found");

  if (auction.status === "completed") {
    throw new ApiError(400, "Auction has already ended");
  }

  if (amount <= auction.highestBid) {
    throw new ApiError(400, "Bid must be higher than the current highest bid");
  }

  // Create new bid
  const bid = new Bid({ auction: auctionId, user: userId, amount });
  await bid.save();

  // Update auction with new highest bid
  auction.highestBid = amount;
  auction.highestBidder = userId;
  await auction.save();

  res.status(201).json(new ApiResponse(201, bid, "Bid placed successfully"));
});

// 📝 Get All Bids for an Auction
export const getBidsForAuction = asyncHandler(async (req, res) => {
  const { auctionId } = req.params;

  const bids = await Bid.find({ auction: auctionId }).populate("user", "name");
  res.status(200).json(new ApiResponse(200, bids, "Bids fetched successfully"));
});

// 📝 Get User Bidding History
export const getUserBiddingHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const bids = await Bid.find({ user: userId }).populate("auction", "title");
  res.status(200).json(new ApiResponse(200, bids, "User's bid history fetched successfully"));
});

// 📝 Cancel a Bid (Only if auction is still active)
export const cancelBid = asyncHandler(async (req, res) => {
  const { bidId } = req.params;
  const userId = req.user._id;

  const bid = await Bid.findById(bidId);
  if (!bid) throw new ApiError(404, "Bid not found");

  const auction = await Auction.findById(bid.auction);
  if (!auction || auction.status === "completed") {
    throw new ApiError(400, "Cannot cancel bid, auction has ended");
  }

  if (String(bid.user) !== String(userId)) {
    throw new ApiError(403, "You are not authorized to cancel this bid");
  }

  await bid.deleteOne();
  res.status(200).json(new ApiResponse(200, {}, "Bid cancelled successfully"));
});
