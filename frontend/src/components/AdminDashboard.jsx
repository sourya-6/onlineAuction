import { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Auctions
        const auctionResponse = await axios.get("/api/v1/auction");
        const { data } = auctionResponse;
        const { data: auctionData } = data;

        const activeAuctions = auctionData.filter(
          (auction) => new Date(auction.endTime) > new Date()
        );
        setAuctions(activeAuctions);
        console.log(activeAuctions);

        // Fetch Users
        const userResponse = await axios.get("/api/v1/user/all-users");
        setUsers(Array.isArray(userResponse.data.data) ? userResponse.data.data : []);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Pagination Handlers
  const nextPage = () => {
    if (indexOfLastUser < users.length) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (loading) return <h3>Loading...</h3>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5">
      {/* ✅ Active Auctions Section */}
      <h2>Admin Dashboard - Active Auctions</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Current Bid</th>
            <th>Highest Bidder</th>
            <th>End Time</th>
            <th>Images</th>
          </tr>
        </thead>
        <tbody>
          {auctions.map((auction, index) => (
            <tr key={auction._id}>
              <td>{index + 1}</td>
              <td>{auction.title}</td>
              <td>${auction.currentBid || auction.startingBid}</td>
              <td>
                {auction.currentBid && auction.highestBidder
                  ? (typeof auction.highestBidder === "object" && auction.highestBidder !== null
                      ? auction.highestBidder.name || auction.highestBidder.email || "Unknown User"
                      : "Unknown User")
                  : "No Bids Yet"}
              </td>
              <td>{new Date(auction.endTime).toLocaleString()}</td>
              <td>
                {auction.images && auction.images.length > 0 ? (
                  <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                    {auction.images.map((img, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={img}
                        alt={`${auction.title} - ${imgIndex + 1}`}
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "5px",
                          objectFit: "cover",
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  "No Image"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* ✅ Available Users Section - Improved Layout */}
      <h2 className="mt-5">Available Users</h2>
      <div className="table-responsive">
        <Table striped bordered hover className="text-center">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>{indexOfFirstUser + index + 1}</td>
                  <td><strong>{user.name || "N/A"}</strong></td>
                  <td>{user.email || "N/A"}</td>
                  <td>
                    <span className={`badge ${user.role === "admin" ? "bg-danger" : "bg-primary"}`}>
                      {user.role || "User"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">No Users Found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* ✅ Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button className="btn btn-secondary" onClick={prevPage} disabled={currentPage === 1}>
          ⬅️ Previous
        </button>
        <span>Page {currentPage} of {Math.ceil(users.length / usersPerPage)}</span>
        <button className="btn btn-secondary" onClick={nextPage} disabled={indexOfLastUser >= users.length}>
          Next ➡️
        </button>
      </div>

      {/* ✅ Create Auction Button */}
      <div className="mt-5">
        <button className="btn btn-primary" onClick={() => navigate("/admin/create-auction")}>
          Create Auction
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
