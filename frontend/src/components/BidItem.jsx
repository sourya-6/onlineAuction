import { useState } from "react";

const BidItem = ({ item, placeBid }) => {
  const [bidAmount, setBidAmount] = useState("");

  const handleBid = () => {
    const bid = parseInt(bidAmount);
    if (!isNaN(bid) && bid > item.highestBid) {
      placeBid(item.id, bid);
      setBidAmount("");
    } else {
      alert("Bid must be higher than the current bid!");
    }
  };

  return (
    <div className="col-md-4">
      <div className="card p-3 text-center shadow">
        <img src={item.image} className="card-img-top" alt={item.name} />
        <h5 className="mt-3">{item.name}</h5>
        <p>Highest Bid: <strong>${item.highestBid}</strong></p>

        {/* Bid Input */}
        <input
          type="number"
          className="form-control"
          placeholder="Enter your bid"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleBid}>
          Place Bid
        </button>

        {/* Bidding History */}
        <div className="mt-3">
          <h6>Bid History:</h6>
          <ul className="list-group">
            {item.bids.length > 0 ? (
              item.bids.map((bid, index) => (
                <li key={index} className="list-group-item">
                  Bid: ${bid}
                </li>
              ))
            ) : (
              <li className="list-group-item">No bids yet</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BidItem;
