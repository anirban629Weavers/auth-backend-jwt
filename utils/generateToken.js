import jwt from "jsonwebtoken";

const generateToken = (obj, expiry = "30d") => {
  return jwt.sign(obj, process.env.JWT_SECRET, {
    expiresIn: expiry,
  });
};

export default generateToken;
