import express from "express";
import {
  signIn,
  signUp,
  getUser,
  updateUsername,
  updateUserPassword,
  deleteUser,
  logOut,
  refresh,
} from "../controllers/users.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

/**
 * @swagger
 * /users/signin:
 *   post:
 *     tags: [User]
 *     summary: Sign in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserSignIn"
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserResponse"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */
router.post("/signin", signIn);

/**
 * @swagger
 * /users/signup:
 *   post:
 *     tags: [User]
 *     summary: Register a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserSignUp"
 *     responses:
 *       201:
 *         description: Successfully Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserSignUpResponse"
 *       400:
 *         description: Bad request
 *       409:
 *         description: Conflict
 */
router.post("/signup", signUp);
router.post("/logout", logOut);
router.get("/refresh", refresh);
router.get("/info", auth, getUser);
router.patch("/update-user", auth, updateUsername);
router.patch("/update-password", auth, updateUserPassword);
router.delete("/delete-user", auth, deleteUser);

export default router;
