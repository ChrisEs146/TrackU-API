import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const auth = (req, res, next) => {
  const authHeaders = req.headers.authorization || req.headers.Authorization;
  try {
    if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeaders.split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "Token not found" });
    }

    jwt.verify(token, process.env.ACCESS_SECRET, async (error, decoded) => {
      if (error) {
        return res.status(401).json({ message: "Invalid Token" });
      }

      req.user = await User.findById(decoded._id).exec();
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      next();
    });
  } catch (error) {
    next(error);
  }
};
