import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Auction from "./Auction";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user"); // ✅ Get user data
   const {user}=user;
   console.log(user.name);
    if (storedUser) {
      setUser(user.name);
    } else {
      navigate("/login"); // ✅ Redirect if no user found
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/user/logout", { withCredentials: true });
      localStorage.removeItem("token"); 
      localStorage.removeItem("user");  // ✅ Remove user data
     
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="container text-center mt-5">
      <h1>Welcome, {user} 👋</h1>  {/* ✅ Display user name */}
      <button className="btn btn-danger mb-3" onClick={handleLogout}>Logout</button>
      <Auction />
    </div>
  );
};

export default Dashboard;
