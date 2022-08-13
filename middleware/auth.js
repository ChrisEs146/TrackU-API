import jwt from "jsonwebtoken";
import user from "../models/user";

export const auth = async (req, res, next) => {
  let userToken;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await user.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Invalid Token.");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Token not found");
  }
};
