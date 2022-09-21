import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const auth = async (req, res, next) => {
  let userToken;
  const authHeader = req.headers.authorization;

  try {
    if (authHeader && authHeader.startsWith("Bearer")) {
      userToken = authHeader.split(" ")[1];

      const decoded = jwt.verify(userToken, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("Unauthorized");
      }
      next();
    }

    if (!userToken) {
      res.status(401);
      throw new Error("Token not found");
    }
  } catch (error) {
    next(error);
  }
};
