import { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { useNavigate, Link } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeAuctions, setActiveAuctions] = useState([]);
  const [biddingHistory, setBiddingHistory] = useState([]);
  const [wonAuctions, setWonAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for placing bids
  const [showModal, setShowModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get("/api/v1/user/profile", { withCredentials: true });
        setUser(userRes.data.data);

        const auctionRes = await axios.get("/api/v1/auction");
        console.log(auctionRes.data.data);
        setActiveAuctions(auctionRes.data.data);

        const bidRes = await axios.get("/api/v1/user/bids", { withCredentials: true });
        setBiddingHistory(bidRes.data.data);

        const wonRes = await axios.get("/api/v1/user/won-auctions", { withCredentials: true });
        setWonAuctions(wonRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Place a bid
  const handlePlaceBid = async () => {
    if (!bidAmount || isNaN(bidAmount) || bidAmount <= (selectedAuction?.highestBid || 0)) {
      alert("Please enter a valid bid higher than the current highest bid.");
      return;
    }
    try {
      const  bidresponse = await axios.post(
        `/api/v1/bid/${selectedAuction?._id}`,
        { amount: bidAmount },
        { withCredentials: true }
      );
      
      alert("Bid placed successfully!");
      setShowModal(false);
      setBidAmount("");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Bid placement failed");
    }
  };

  if (loading) return <h3>Loading...</h3>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <h2>User Dashboard</h2>
      {user && (
        <div className="mb-4">
          <h4>Welcome, {user.name}</h4>
          <p>Email: {user.email}</p>
          <button className="btn btn-danger" onClick={() => navigate("/logout")}>Logout</button>
        </div>
      )}

      {/* Active Auctions */}
      <h3>Active Auctions</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Current Bid</th>
            <th>Highest Bidder</th>
            <th>End Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {activeAuctions.map((auction, index) => {
            const title = auction?.title || "N/A";
            const highestBid = auction?.highestBid || 0;
            const highestBidder = auction?.highestBidder?.name || "No Bids Yet";
            const endTime = auction?.endTime ? new Date(auction.endTime).toLocaleString() : "N/A";

            return (
              <tr key={auction._id}>
                <td>{index + 1}</td>
                <td>
                  <Link to={`/product/${auction._id}`} className="text-decoration-none">
                    {title}
                  </Link>
                </td>
                <td>${highestBid}</td>
                <td>{highestBidder}</td>
                <td>{endTime}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => {
                    setSelectedAuction(auction);
                    setShowModal(true);
                  }}>
                    Bid Now
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      
      {/* Bid Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Place a Bid</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Bid Amount</Form.Label>
              <Form.Control
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                min={selectedAuction ? selectedAuction.highestBid + 1 : 1}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handlePlaceBid}>Place Bid</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserDashboard;
