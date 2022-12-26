import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/user.js";

/**
 * Finds and returns a user based on a given email or userId.
 * @param {string} email
 * @param {mongoose.Types.ObjectId} userId
 * @returns User
 */
export const findUser = async function (email, userId = null) {
  try {
    if (!userId) {
      return await User.findOne({ email: email.toLowerCase() }).exec();
    }
    return await User.findById(userId).exec();
  } catch (error) {
    throw error;
  }
};

/**
 * Compares a given password with a user's password.
 * @param {string} password
 * @param {string} userPassword
 * @returns boolean
 */
export const isValidPassword = async function (password, userPassword) {
  try {
    return await bcrypt.compare(password, userPassword);
  } catch (error) {
    throw error;
  }
};

/**
 * Creates and returns the created user.
 * @param {string} fullName
 * @param {string} email
 * @param {string} password
 * @returns Created User
 */
export const createUser = async function (fullName, email, password) {
  try {
    return await User.create({ fullName, email, password });
  } catch (error) {
    throw error;
  }
};

/**
 * Updates and returns the updated user.
 * @param {mongoose.Types.ObjectId} userId
 * @param {string} newFullName
 * @returns Updated User
 */
export const updateUserName = async function (userId, newFullName) {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      { fullName: newFullName },
      { new: true, runValidators: true }
    );
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

/**
 * Saves a new password to a given user.
 * @param {mongoose.Document} user
 * @param {string} newPassword
 */
export const saveNewPassword = async function (user, newPassword) {
  try {
    user.password = newPassword;
    await user.save();
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes a given user.
 * @param {mongoose.Document} user
 */
export const removeUser = async function (user) {
  try {
    await user.remove();
  } catch (error) {
    throw error;
  }
};
