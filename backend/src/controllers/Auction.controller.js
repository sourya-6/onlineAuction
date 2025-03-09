import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Cloudinary Config
import Auction from "../models/Auction.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

// ✅ Create Auction
export const createAuction = asyncHandler(async (req, res) => {
    const { title, description, startingBid, endTime } = req.body;

    if (!title || !startingBid || !endTime) {
        throw new ApiError(400, "All fields are required.");
    }

    let imageUrls = [];

    if (req.files) {
        for (const file of req.files) {
            const localpath = file.path;
            const result = await uploadOnCloudinary(localpath);
            imageUrls.push(result.secure_url);
        }
    }

    const auction = await Auction.create({
        title,
        description,
        images: imageUrls,
        startingBid,
        currentBid: startingBid,
        highestBidder: null,
        endTime,
        createdBy: req.user.id,
    });

    res.status(201).json(new ApiResponse(201, auction, "Auction created successfully"));
});

// ✅ Get All Auctions

export const getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find()
      .populate("highestBidder", "name email") // ✅ Fetch name & email
      .sort({ endTime: -1 });

    return res.status(200).json({
      success: true,
      message: "All auctions fetched successfully",
      data: auctions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};




// ✅ Get Single Auction
export const getAuctionById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const auction = await Auction.findById(id);

    if (!auction) {
        throw new ApiError(404, "Auction not found");
    }

    res.status(200).json(new ApiResponse(200, auction, "Auction retrieved successfully"));
});

// ✅ Place a Bid
export const placeBid = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { bidAmount } = req.body;

    const auction = await Auction.findById(id);
    if (!auction) {
        throw new ApiError(404, "Auction not found");
    }

    if (new Date(auction.endTime) < new Date()) {
        throw new ApiError(400, "Auction has already ended.");
    }

    if (bidAmount <= auction.currentBid) {
        throw new ApiError(400, "Bid must be higher than the current bid.");
    }

    auction.currentBid = bidAmount;
    auction.highestBidder = req.user.id;
    await auction.save();

    res.status(200).json(new ApiResponse(200, auction, "Bid placed successfully"));
});
