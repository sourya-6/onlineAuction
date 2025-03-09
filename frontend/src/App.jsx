import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import AuctionForm from "./components/AuctionForm";
import UserDashboard from "./components/UserDashboard";
import Product from "./components/Product";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        {/* <Route path="/signup" element={<AdminLogin />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create-auction" element={<AuctionForm />} />
        <Route path="/product/:id" element={<Product />} />

      </Routes>
    </Router>
  );
}

export default App;
