import User from "../../src/models/user";
import { createToken } from "../../src/utils/tokenCreator";

export const signUp = {
  valid: {
    fullName: "John Doe",
    email: "john@email.com",
    password: "passWord14%",
    confirmPassword: "passWord14%",
  },
  empty: {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  invalidName: {
    fullName: "Joh",
    email: "john@email.com",
    password: "passWord14%",
    confirmPassword: "passWord14%",
  },
  invalidEmail: {
    fullName: "John Doe",
    email: "john",
    password: "passWord14%",
    confirmPassword: "passWord14%",
  },
  invalidPassword: {
    fullName: "John Doe",
    email: "john@email.com",
    password: "password",
    confirmPassword: "password",
  },
  passwordMisMatch: {
    fullName: "John Doe",
    email: "john@email.com",
    password: "passWord14%",
    confirmPassword: "passWord14%34",
  },
};

export const signIn = {
  valid: {
    email: "john@email.com",
    password: "passWord14%",
  },
  empty: {
    email: "",
    password: "",
  },
  invalidCredentials: {
    email: "john@email.com",
    password: "passWord%1434",
  },
};

/**
 * Testing utility function to create a user
 * @returns Object with new user and token
 */
export const createUser = async function () {
  const newUser = await User.create(signUp.valid);
  if (newUser) {
    return { newUser, token: createToken(newUser._id, newUser.fullName, newUser.email) };
  }
};
