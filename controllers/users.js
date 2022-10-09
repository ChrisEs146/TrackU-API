import bcrypt from "bcryptjs";
import User from "../models/user.js";
import Jwt from "jsonwebtoken";
import { createToken } from "../utils/tokenCreator.js";

/**
 * Controller to sign in a user.
 * @route POST /users/signin
 * @access Public
 */
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Checking for possible blank fields
    if (!email || !password) {
      return res.status(400).json({ message: "Fields cannot be empty." });
    }

    // Finding user
    const existingUser = await User.findOne({ email }).lean().exec();
    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // Checking for valid password
    const isValidPassword = await bcrypt.compare(password, existingUser.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // Creating tokens
    const accessToken = createToken(existingUser._id, existingUser.fullName, existingUser.email);
    const refreshToken = createToken(
      existingUser._id,
      existingUser.fullName,
      existingUser.email,
      true
    );

    res
      .status(200)
      .cookie("token", refreshToken, { httpOnly: true, sameSite: "None", secure: true })
      .json({ accessToken });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to sign up a user.
 * @route POST /users/signup
 * @access Public
 */
export const signUp = async (req, res, next) => {
  const { fullName, email, password, confirmPassword } = req.body;
  try {
    // Checking for possible blank fields
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Fields cannot be empty." });
    }

    // Checking for existing user
    const existingUser = await User.findOne({ email }).lean().exec();
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Checking if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ fullName, email, password: hashedPassword });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to update a user's name.
 * @route PATCH /users/update-user
 * @access Private
 */
export const updateUsername = async (req, res, next) => {
  const { newFullName } = req.body;
  const userId = req.user._id;
  try {
    // Checking for possible blank field
    if (!newFullName) {
      return res.status(400).json({ message: "Fields cannot be empty." });
    }

    // Finding user
    const existingUser = await User.findById(userId).exec();
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Updating user's name
    existingUser.fullName = newFullName;
    const updatedUser = await existingUser.save();

    res
      .status(200)
      .json({ _id: updatedUser._id, fullName: updatedUser.fullName, email: updatedUser.email });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to update a user's password.
 * @route PATCH /uses/update-password
 * @access Private
 */
export const updateUserPassword = async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user._id;
  try {
    // Checking for possible blank fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Fields cannot be empty." });
    }

    // Finding user
    const existingUser = await User.findById(userId).exec();
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Checking if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Checking if current password is valid
    const isValidPassword = await bcrypt.compare(currentPassword, existingUser.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    // Hashing new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    // Updating user's password
    existingUser.password = newHashedPassword;
    await existingUser.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete a user.
 * @route DELETE /users/delete-user
 * @access Private
 */
export const deleteUser = async (req, res, next) => {
  const { email, password } = req.body;
  const userId = req.user._id;

  try {
    // Checking for possible empty fields
    if (!email || !password) {
      return res.status(400).json({ message: "Fields cannot be empty." });
    }

    // Finding user
    const existingUser = await User.findOne({ email }).exec();
    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (existingUser.id !== userId) {
      return res.status(401).json({ Message: "User not authorized" });
    }

    // Checking if password is valid
    const isValidPassword = await bcrypt.compare(password, existingUser.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Deleting user
    await existingUser.remove();
    res
      .status(200)
      .json({ _id: existingUser._id, fullName: existingUser.fullName, email: existingUser.email });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to refresh tokens.
 * @route GET /users/refresh
 * @access Public
 */
export const refresh = async (req, res, next) => {
  const cookieToken = req.cookies.token;

  try {
    if (!cookieToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const refreshToken = cookieToken;
    Jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (error, decoded) => {
      if (error) {
        return res.status(401).json({ message: "Token Expired" });
      }
      const authUser = await User.findOne({ email: decoded.email }).lean().exec();

      if (!authUser) {
        return res.status(401).json({ message: "User not authorized" });
      }
      const accessToken = createToken(authUser._id, authUser.fullName, authUser.email);
      res.status(200).json({ accessToken });
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete user cookies on logOut.
 * @route POST /users/logout
 * @access Public
 */
export const logOut = (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "None", secure: true });
  res.status(200).json({ message: "Cookies Deleted" });
};

/**
 * Controller to get user's data
 * @route GET /users/info
 * @access Private
 */
export const getUser = async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json({ fullName: user.fullName, email: user.email });
  } catch (error) {
    next(error);
  }
};
