import mongoose from "mongoose";

const AuctionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startingPrice: { type: Number, required: true },
  highestBid: { type: Number, default: 0 },
  highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ["active", "completed"], default: "active" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Auction = mongoose.model("Auction", AuctionSchema);
export default Auction;
