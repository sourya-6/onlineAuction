import { User } from "../models/User.models.js";
import { Bid } from "../models/Bid.models.js";
import { Auction } from "../models/Auction.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

// 📝 Register User
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if(!name || !email || !password) throw new ApiError(400, "All fields are required");

  if (await User.findOne({ email })) {
    throw new ApiError(400, "Email is already registered");
  }

  const user = await User.create({ name, email, password });

  res.status(201).json(new ApiResponse(201, {}, "User registered successfully"));
});

// 📝 Register Admin
// export const registerAdmin = asyncHandler(async (req, res) => {
//   const { name, email, password } = req.body;

//   if (await User.findOne({ email })) {
//     throw new ApiError(400, "Admin already exists");
//   }

//   const admin = await User.create({ name, email, password, role: "admin" });

//   res.status(201).json(new ApiResponse(201, {}, "Admin registered successfully"));
// });//

// 📝 Login User
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if(!email.trim()||!password.trim()){
    throw new ApiError(401,"Please Enter the Details")
  }
  const user = await User.findOne({ email });

  if (!user ){
    throw new ApiError(401, "User not available with specified details");
  }
  const passwordCheck=await user.isPasswordCorrect(password)
  if(!passwordCheck){
    throw new ApiError(401,"Invalid credentials")
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("accessToken", accessToken, { httpOnly: true, secure: true });
  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
  

  res.json(new ApiResponse(200, { id: user._id, name: user.name, email: user.email, role: user.role }, "Login successful"));
});

// 📝 Logout User
export const logout = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Unauthorized, no user found");

  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

  res
    .clearCookie("accessToken", { httpOnly: true, secure: true })
    .clearCookie("refreshToken", { httpOnly: true, secure: true })
    .json(new ApiResponse(200, {}, "Logout successful"));
});

// 📝 Get User Profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) throw new ApiError(404, "User not found");

  res.status(200).json(new ApiResponse(200, user, "User profile fetched successfully"));
});

// 📝 Get User Bidding History
export const getUserBids = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const bids = await Bid.find({ user: userId }).populate("auction", "title highestBid highestBidder");
  
  res.status(200).json(new ApiResponse(200, bids, "User's bid history fetched successfully"));
});

// 📝 Get User's Won Auctions
export const getUserWonAuctions = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const wonAuctions = await Auction.find({ highestBidder: userId, status: "completed" })
    .populate("seller", "name email")
    .select("title highestBid seller status");

  res.status(200).json(new ApiResponse(200, wonAuctions, "User's won auctions fetched successfully"));
});

// 📝 Get All Users (Admin)
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  res.status(200).json(new ApiResponse(200, users, "All users fetched"));
});

// 📝 Admin - Delete User
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  res.status(200).json(new ApiResponse(200, {}, "User deleted successfully"));
});

// 📝 Admin - Update User Role
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });

  if (!user) throw new ApiError(404, "User not found");

  res.status(200).json(new ApiResponse(200, user, "User role updated successfully"));
});
