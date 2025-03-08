import express from "express";
import multer from "multer";
import { createAuction, getAllAuctions, getAuctionById, placeBid } from "../controllers/Auction.controller.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temp Storage

router.post("/", verifyJWT, upload.array("images", 5), createAuction);
router.get("/", getAllAuctions);
router.get("/:id", getAuctionById);
router.post("/:id/bid", verifyJWT, placeBid);

export default router;
