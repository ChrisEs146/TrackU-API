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
    if (!isValidPassword) {
      res.status(400);
      throw new Error("Invalid Credentials");
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      _id: existingUser._id,
      fullName: existingUser.fullName,
      email: existingUser.email,
      token,
    });
  } catch (error) {
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
      res.status(400);
      throw new Error("Fields cannot be empty.");
    }

    // Checking for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error("User already exists.");
    }

    // Checking if passwords match
    if (password !== confirmPassword) {
      res.status(400);
      throw new Error("Passwords do not match.");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ fullName, email, password: hashedPassword });

    // Creating token
    const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        token,
      });
    } else {
      res.status(400);
      throw new Error("An error ocurred creating the user.");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Finds user and updates user's name
 */
export const updateUsername = async (req, res, next) => {
  const { _id, newfullName } = req.body;
  try {
    // Checking for possible blank field
    if (!newfullName) {
      res.status(400);
      throw new Error("Fields cannot be empty");
    }

    // Finding user
    const existingUser = await User.findById({ _id });
    if (!existingUser) {
      res.status(404);
      throw new Error("User not found.");
    }

    // Updating user's name
    await User.findByIdAndUpdate(_id, { ...existingUser, fullName: newfullName });
    res.status(200).json({ message: "User's name updated successfully" });
  } catch (error) {
    next(error);
  }
};
/**
 * Controller to get user's data
 */
export const getUser = async (req, res, next) => {
  try {
    const user = req.user;

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404);
      throw new Error("User was not found.");
    }
  } catch (error) {
    next(error);
  }
};
