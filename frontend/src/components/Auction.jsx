import { useState } from "react";
import BidItem from "./BidItem";

const Auction = () => {
  const [items, setItems] = useState([
    { id: 1, name: "iPhone 15 Pro", image: "https://i.ytimg.com/vi/CREM-mFuyyo/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB6WA-0L8c5lu2OMH5V2bxFi7WXQQ", highestBid: 500, bids: [] },
    { id: 2, name: "MacBook Pro", image: "https://cdsassets.apple.com/live/SZLF0YNV/images/sp/111883_macbookair.png", highestBid: 1000, bids: [] },
  ]);

  const placeBid = (id, bidAmount) => {
    setItems(items.map(item =>
      item.id === id && bidAmount > item.highestBid
        ? { ...item, highestBid: bidAmount, bids: [...item.bids, bidAmount] }
        : item
    ));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Live Auction</h2>
      <div className="row">
        {items.map(item => (
          <BidItem key={item.id} item={item} placeBid={placeBid} />
        ))}
      </div>
    </div>
  );
};

export default Auction;
