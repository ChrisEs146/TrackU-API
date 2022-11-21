import Jwt from "jsonwebtoken";
import mongoose from "mongoose";

/**
 * Utility function to create JWT tokens
 * @param {mongoose.Types.ObjectId} id User's ID
 * @param {String} fullName User's fullname
 * @param {String} email User's email
 * @param {boolean} refresh set by default to false. If creating refresh token should be set to true
 * @returns JWT Token
 */
export const createToken = function (id, fullName, email, refresh = false) {
  let token;
  if (!refresh) {
    token = Jwt.sign(
      {
        _id: id,
        fullName: fullName,
        email: email,
      },
      process.env.ACCESS_SECRET,
      {
        expiresIn: process.env.ACCESS_EXPIRES_IN,
      }
    );
  } else {
    token = Jwt.sign(
      {
        _id: id,
        fullName: fullName,
        email: email,
      },
      process.env.REFRESH_SECRET,
      {
        expiresIn: process.env.REFRESH_EXPIRES_IN,
      }
    );
  }

  return token;
};
