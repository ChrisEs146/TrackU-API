import Jwt from "jsonwebtoken";
import { createToken } from "../utils/tokenCreator.js";
import { getError } from "../utils/getError.js";
import {
  createUser,
  findUser,
  isValidPassword,
  saveNewPassword,
  updateUserName,
  removeUser,
} from "../services/userService.js";

/**
 * Controller to sign in a user.
 * @route POST /users/signin
 * @access Public
 */
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  // Checking for possible blank fields
  if (!email || !password) {
    return res.status(400).json({ message: "Fields cannot be empty" });
  }

  try {
    // Finding user
    const existingUser = await findUser(email);
    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // Checking for valid password
    const validPassword = await isValidPassword(password, existingUser.password);
    if (!validPassword) {
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

    return res
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

  // Checking for possible blank fields
  if (!fullName || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "Fields cannot be empty" });
  }

  // Checking if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // Checking for existing user
  try {
    const existingUser = await findUser(email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
  } catch (error) {
    next(error);
  }

  // Creating and validating user data
  try {
    const user = await createUser(fullName, email, password);
    return res.status(201).json({ _id: user._id, fullName: user.fullName, email: user.email });
  } catch (error) {
    return res.status(400).json({ message: getError(error) });
  }
};

/**
 * Controller to update a user's name.
 * @route PATCH /users/update-user
 * @access Private
 */
export const updateUsername = async (req, res) => {
  const { newFullName } = req.body;
  const userId = req.user._id;

  // Checking for possible blank field
  if (!newFullName) {
    return res.status(400).json({ message: "Fields cannot be empty" });
  }

  // Updating user's name
  try {
    const updatedUser = await updateUserName(userId, newFullName);
    return res
      .status(200)
      .json({ _id: updatedUser._id, fullName: updatedUser.fullName, email: updatedUser.email });
  } catch (error) {
    return res.status(400).json({ message: getError(error) });
  }
};

/**
 * Controller to update a user's password.
 * @route PATCH /users/update-password
 * @access Private
 */
export const updateUserPassword = async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user._id;

  // Checking for possible blank fields
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "Fields cannot be empty" });
  }

  // Checking if passwords match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Finding user
    const existingUser = await findUser(undefined, userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Checking if current password is valid
    const validPassword = await isValidPassword(currentPassword, existingUser.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    // Updating user's password
    try {
      await saveNewPassword(existingUser, newPassword);
      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      return res.status(400).json({ message: getError(error) });
    }
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

  // Checking for possible empty fields
  if (!email || !password) {
    return res.status(400).json({ message: "Fields cannot be empty" });
  }

  try {
    // Finding user
    const existingUser = await findUser(email);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!existingUser._id.equals(userId)) {
      return res.status(401).json({ message: "User not authorized" });
    }

    // Checking if password is valid
    const validPassword = await isValidPassword(password, existingUser.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Deleting user
    await removeUser(existingUser);
    return res
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

  if (!cookieToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const refreshToken = cookieToken;
    Jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (error, decoded) => {
      if (error) {
        return res.status(401).json({ message: "Token Expired" });
      }
      const authUser = await findUser(decoded.email);

      if (!authUser) {
        return res.status(401).json({ message: "User not authorized" });
      }
      const accessToken = createToken(authUser._id, authUser.fullName, authUser.email);
      return res.status(200).json({ accessToken });
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
  return res.status(200).json({ message: "Cookies Deleted" });
};

/**
 * Controller to get user's data
 * @route GET /users/info
 * @access Private
 */
export const getUser = (req, res, next) => {
  try {
    const user = req.user;
    return res.status(200).json({ fullName: user.fullName, email: user.email });
  } catch (error) {
    next(error);
  }
};
