import express from "express";
import { placeBid, getBidsForAuction } from "../controllers/Bid.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Place a bid (requires authentication)
router.post("/:auctionId", authMiddleware, placeBid);

// Get all bids for a specific auction
router.get("/:auctionId", getBidsForAuction);

export default router;
