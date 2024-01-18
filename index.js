import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoute.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import connectDB from "./config/db.js";
import { products } from "./data/index.js";
import cors from "cors";
import { protect } from "./middlewares/authMiddleware.js";
import generateToken from "./utils/generateToken.js";
import jwt from "jsonwebtoken";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1/", userRoutes);

// @desc    Refresh Access Token
// @route   GET /api/v1/auth/refresh-token
// @access  Public
app.post("/api/v1/auth/refresh-token", (req, res) => {
  const refreshToken = req.body.refresh;
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const accessExpiry = req.query.acc || "60000";
    const refreshExpiry = req.query.ref || "300000";

    const accessToken = generateToken({ id: payload.id }, accessExpiry);
    const refreshToken_ = generateToken(
      { id: payload.id, name: payload.name, email: payload.email },
      refreshExpiry
    );
    res.json({ accessToken, refreshToken: refreshToken_ });
  } catch (error) {
    console.log(error);
    return res.status(403).json({ error: "Refresh token expired" });
  }
});

// @desc    Refresh Access Token
// @route   GET /api/v1/protected/products
// @access  Public
app.get("/api/v1/protected/products", protect, (req, res) => {
  res.json(products);
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
