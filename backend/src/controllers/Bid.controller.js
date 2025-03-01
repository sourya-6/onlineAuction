import Bid from "../models/Bid.models.js";
import Auction from "../models/Auction.models.js";


export const placeBid = async (req, res) => {
  const { auctionId } = req.params;
  const { amount } = req.body;
  const userId = req.user._id;

  try {
    const auction = await Auction.findById(auctionId);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    if (auction.status === "completed") {
      return res.status(400).json({ message: "Auction has already ended" });
    }

    if (amount <= auction.highestBid) {
      return res.status(400).json({ message: "Bid must be higher than the current highest bid" });
    }

    // Create new bid
    const bid = new Bid({ auction: auctionId, user: userId, amount });
    await bid.save();

    // Update auction with new highest bid
    auction.highestBid = amount;
    auction.highestBidder = userId;
    await auction.save();

    res.status(201).json({ message: "Bid placed successfully", bid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all bids for an auction
 */
export const getBidsForAuction = async (req, res) => {
  const { auctionId } = req.params;

  try {
    const bids = await Bid.find({ auction: auctionId }).populate("user", "name");
    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
