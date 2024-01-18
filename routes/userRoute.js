import express from "express";
const router = express.Router();

import {
  authUser,
  registerUser,
  getUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

router.post("/auth/login", authUser);
router.route("/auth").post(registerUser);
router.route("/profile").get(protect, getUserProfile);

export default router;
