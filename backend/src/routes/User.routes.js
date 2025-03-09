import express from "express";
import { 
  register, 
  registerAdmin, 
  login, 
  logout, 
  getAllUsers, 
  deleteUser, 
  getUserProfile, 
  updateUserRole, 
  getUserBids, 
  getUserWonAuctions 
} from "../controllers/User.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ User Registration & Authentication
router.post("/register", register);
router.post("/register-admin", verifyJWT, verifyAdmin, registerAdmin); // Only Admin can register another Admin
router.post("/login", login);
router.post("/logout", verifyJWT, logout);

// ✅ User Profile Management
router.get("/profile", verifyJWT, getUserProfile);

// ✅ User Bidding & Won Auctions History
router.get("/bids", verifyJWT, getUserBids); // User's bidding history
router.get("/won-auctions", verifyJWT, getUserWonAuctions); // User's won auctions history

// ✅ Admin Controls
router.get("/all-users", verifyJWT, verifyAdmin, getAllUsers);
router.delete("/:id", verifyJWT, verifyAdmin, deleteUser);
router.put("/:id/role", verifyJWT, verifyAdmin, updateUserRole); // Admin can update user roles

export default router;
