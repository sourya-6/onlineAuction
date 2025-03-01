import Auction from "../models/Auction.models.js";

export const createAuction = async (req, res) => {
  try {
    const auction = new Auction({ ...req.body, createdBy: req.user._id });
    await auction.save();
    res.status(201).json(auction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find().populate("createdBy", "name");
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
