import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  message: "Too many requests. Please try again in 1 minute",
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({ message: options.message });
  },
  standardHeaders: true,
  legacyHeaders: false,
});
