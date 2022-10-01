import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const authHeaders = req.headers.authorization || req.headers.Authorization;
  try {
    if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    const token = authHeaders.split(" ")[1];
    if (!token) {
      res.status(403);
      throw new Error("Token not found");
    }

    jwt.verify(token, process.env.ACCESS_SECRET, (error, decoded) => {
      if (error) {
        res.status(401);
        throw new Error("Unauthorized, token not valid");
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    next(error);
  }
};
