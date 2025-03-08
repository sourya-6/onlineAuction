import { User } from "../models/User.models.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponse.js";

// 📝 Register User
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "Email is already registered");
  }

  const user = new User({ name, email, password });
  await user.save();

  res.status(201).json(new ApiResponse(201, {}, "User registered successfully"));
});


//Registering Admin
export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) throw new ApiError(400, "Admin already exists");

  const admin = await User.create({ name, email, password, role: "admin" }); // 🔥 Force admin role

  const token = generateToken(res, admin);
  res.status(201)
  .json(
    new ApiResponse(201, { admin, token }, "Admin registered successfully"));
});

// 📝 Login User
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, "Invalid credentials");
  }

  // 🔑 Generate Tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Store refreshToken in DB
  user.refreshToken = refreshToken;
  await user.save();

  // Set tokens in HTTP-only cookies
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,

  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure:true

  });

  res.json(new ApiResponse(200, { user: { id: user._id, name: user.name, email: user.email , role: user.role} }, "Login successful"));
});

// 📝 Logout User
export const logout = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized, no user found");
  }

  // Remove refreshToken from DB
  await User.findByIdAndUpdate(req.user._id, {
    $unset: { refreshToken: 1 },
  });

  // Clear cookies
  const options = { httpOnly: true, secure: true };
  res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Logout successful"));
});


export const getAllUsers = async (req, res, next) => {
  try {
      const users = await User.find().select("-password");
      return res.status(200).json(new ApiResponse(200, "All users fetched", users));
  } catch (error) {
      next(error);
  }
};

// 🟢 Admin - Delete User
export const deleteUser = async (req, res, next) => {
  try {
      const user = await User.findByIdAndDelete(req.params.userId);
      if (!user) throw new ApiError(404, "User not found");

      return res.status(200).json(new ApiResponse(200, "User deleted successfully"));
  } catch (error) {
      next(error);
  }
};

// 🟢 Admin - Update User Role
export const updateUserRole = async (req, res, next) => {
  try {
      const { role } = req.body;

      const user = await User.findByIdAndUpdate(req.params.userId, { role }, { new: true });
      if (!user) throw new ApiError(404, "User not found");

      return res.status(200).json(new ApiResponse(200, "User role updated", user));
  } catch (error) {
      next(error);
  }
};