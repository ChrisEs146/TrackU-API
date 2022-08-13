import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

/**
 *  Handles the user's sign in logic, and creates a connection
 * between the user model and the Sign in route.
 * @returns json response with the existing user and token
 */
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      res.status(404);
      throw new Error("User does not exist.");
    }

    const isValidPassword = await bcrypt.compare(password, existingUser.password);
    if (!isValidPassword) return res.status(400).json({ message: "Invalid Credentials." });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({ existingUser, token });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/**
 * Handles the user's sign up logic, and creates a connection
 * between the user model and the sign up route.
 * @returns json response with a new user and its token
 */
export const signUp = async (req, res, next) => {
  const { fullName, email, password, confirmPassword } = req.body;
  try {
    // Checking for possible blank fields
    if (!fullName || !email || !password || !confirmPassword) {
      res.status(400).json({ message: "Fields cannot be empty" });
    }

    // Checking for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) res.status(400).json({ message: "User already exists" });

    // Checking if passwords match
    if (password !== confirmPassword) res.status(400).json({ message: "Passwords do not match" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ fullName, email, password: hashedPassword });

    // Creating token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    if (user) {
    next(error);
export const getUser = (req, res, next) => {
    } else {
      res.status(400).json({ message: "An error occurred creating the user" });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};
