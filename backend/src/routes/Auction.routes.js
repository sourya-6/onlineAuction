import express from "express";
import { createAuction, getAuctions } from "../controllers/auctionController.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createAuction);
router.get("/", getAuctions);

export default router;
