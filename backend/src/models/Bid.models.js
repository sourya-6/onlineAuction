import mongoose from "mongoose";

const BidSchema = new mongoose.Schema({
  auction: { type: mongoose.Schema.Types.ObjectId, ref: "Auction", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Bid = mongoose.model("Bid", BidSchema);
export default Bid;
