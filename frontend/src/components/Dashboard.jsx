import { useNavigate } from "react-router-dom";
import Auction from "./Auction";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="container text-center mt-5">
      <h1>Welcome to the Auction Platform</h1>
      <button className="btn btn-danger mb-3" onClick={handleLogout}>Logout</button>
      <Auction />
    </div>
  );
};

export default Dashboard;
