import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    auction: { type: mongoose.Schema.Types.ObjectId, ref: "Auction", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Bid", bidSchema);
