import express from "express";
import { 
  placeBid, 
  getBidsForAuction, 
  getUserBiddingHistory, 
  cancelBid 
} from "../controllers/Bid.controller.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Place a bid on an auction
router.post("/:auctionId", verifyJWT, placeBid);

// ✅ Get all bids for a specific auction
router.get("/:auctionId", getBidsForAuction);

// ✅ Get bidding history of a logged-in user
router.get("/", verifyJWT, getUserBiddingHistory);

// ✅ Cancel a bid (Only if auction is still active)
router.delete("/:bidId", verifyJWT, cancelBid);

export default router;
