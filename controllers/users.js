import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

/**
 * Controller to sign in a user.
 * @route POST /users/signin
 * @access Public
 *
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
 * Controller to sign up a user.
 * @route POST /users/signup
 * @access Public
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

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token,
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
  const userId = req.user.id;
  try {
    // Checking for possible blank field
    if (!newFullName) {
      res.status(400);
      throw new Error("Fields cannot be empty");
    }

    // Updating user's name
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName: newFullName },
      { new: true }
    );
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
  const userId = req.user.id;
  try {
    // Checking for possible blank fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      res.status(400);
      throw new Error("Fields cannot be empty");
    }

    // Finding user
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      res.status(404);
      throw new Error("User not found.");
    }

    // Checking if passwords match
    if (newPassword !== confirmPassword) {
      res.status(400);
      throw new Error("Passwords do not match.");
    }

    // Checking if current password is valid
    const isValidPassword = await bcrypt.compare(currentPassword, existingUser.password);
    if (!isValidPassword) {
      res.status(400);
      throw new Error("Invalid Password");
    }

    // Hashing new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    // Updating user's password
    await User.findByIdAndUpdate(userId, { password: newHashedPassword });
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
  const userId = req.user.id;

  try {
    // Checking for possible empty fields
    if (!email || !password) {
      res.status(400);
      throw new Error("Fields cannot be empty");
    }

    // Finding user
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      res.status(404);
      throw new Error("User not found.");
    }

    if (existingUser.id !== userId) {
      res.status(401);
      throw new Error("User not authorized");
    }

    // Checking if password is valid
    const isValidPassword = await bcrypt.compare(password, existingUser.password);
    if (!isValidPassword) {
      res.status(400);
      throw new Error("Invalid Credentials");
    }

    // Deleting user
    const deletedUser = await User.findOneAndDelete({ email });
    res
      .status(200)
      .json({ _id: deletedUser._id, fullName: deletedUser.fullName, email: deletedUser.email });
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
      res.status(401);
      throw new Error("Unauthorized");
    }

    const refreshToken = cookieToken;
    const decoded = Jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const authUser = await User.findOne({ email: decoded.email }).lean().exec();

    if (!authUser) {
      res.status(401);
      throw new Error("User not authorized");
    }

    const accessToken = createToken(authUser.fullName, authUser.email);
    res.status(200).json({ accessToken });
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
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
