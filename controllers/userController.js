import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

// @desc    Auth user & get token
// @route   POST /api/v1/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const accessExpiry = req.query.acc || "60000";
  const refreshExpiry = req.query.ref || "300000";
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      accessToken: generateToken({ id: user._id }, accessExpiry),
      refreshToken: generateToken(
        { id: user._id, name: user.name, email: user.email },
        refreshExpiry
      ),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user
// @route   POST /api/v1/auth
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, secret } = req.body;

  if (secret !== "ANIRBAN MISHRA") {
    res.status(400);
    throw new Error("Invalid Secret Code");
  }

  const accessExpiry = req.query.acc || "60000";
  const refreshExpiry = req.query.ref || "300000";

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      accessToken: generateToken({ id: user._id }, accessExpiry),
      refreshToken: generateToken(
        { id: user._id, name: user.name, email: user.email },
        refreshExpiry
      ),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Get user profile
// @route   GET /api/v1/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export { authUser, registerUser, getUserProfile };
