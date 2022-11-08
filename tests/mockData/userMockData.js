import User from "../../src/models/user";
import { createToken } from "../../src/utils/tokenCreator";

export const signUp = {
  valid: {
    fullName: "John Doe",
    email: "john@email.com",
    password: "passWord14%",
    confirmPassword: "passWord14%",
  },
  valid2: {
    fullName: "Frank Doe",
    email: "frank@email.com",
    password: "passWord14%143",
    confirmPassword: "passWord14%143",
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
 * Testing utility function to create users.
 * If no argument is given it will create user 1,
 * otherwise if **extraUser** equals to true it will create user 2
 * @returns Object with new user and token
 */
export const createUser = async function (extraUser = false) {
  let newUser;
  // User 1
  if (!extraUser) {
    newUser = await User.create(signUp.valid);
    return { newUser, token: createToken(newUser._id, newUser.fullName, newUser.email) };
  }

  // User 2
  newUser = await User.create(signUp.valid2);
  return { newUser, token: createToken(newUser._id, newUser.fullName, newUser.email) };
};
