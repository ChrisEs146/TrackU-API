import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const auth = async (req, res, next) => {
  let userToken;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      userToken = authHeader.split(" ")[1];

      const decoded = jwt.verify(userToken, process.env.JWT_SECRET);

      req.user = await user.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Invalid Token.");
    }
  }

  if (!userToken) {
    res.status(401);
    throw new Error("Token not found");
  }
};
