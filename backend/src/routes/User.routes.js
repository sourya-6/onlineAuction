import express from "express";
import { register,registerAdmin, login,logout,getAllUsers,deleteUser } from "../controllers/User.controller.js"
import { verifyJWT,verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/register-admin", registerAdmin);
router.post("/login", login);
router.post("/logout",verifyJWT, logout);



// // ✅ User can view their own profile
// router.get("/profile", verifyJWT, getUserProfile);

// // ✅ User can update their own profile
// router.put("/profile", verifyJWT, updateUserProfile);

// ✅ Admin can view all users
router.get("/all-users", verifyJWT, verifyAdmin, getAllUsers);

// ✅ Admin can delete any user
router.delete("/:id", verifyJWT, verifyAdmin, deleteUser);



export default router;
