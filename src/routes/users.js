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
 *     summary: Sign in a user and set token in httpOnly cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: frank07@email.com
 *               password: passWord14%
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Fields cannot be empty
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Invalid credentials
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: User does not exists
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
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *             example:
 *               fullName: Frank Smith
 *               email: frank07@email.com
 *               password: passWord14%
 *               confirmPassword: passWord14%
 *     responses:
 *       201:
 *         description: Successfully Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 fullName:
 *                   type: string
 *                 email:
 *                   type: string
 *               example:
 *                 _id: 507f1f77bcf86cd799439011
 *                 fullName: Frank Smith
 *                 email: frank07@email.com
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Fields cannot be empty
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: User already exists
 */
router.post("/signup", signUp);

/**
 * @swagger
 * /users/logOut:
 *   post:
 *     tags: [User]
 *     summary: Clear user's cookie
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Cookies Deleted
 */
router.post("/logout", logOut);
router.get("/refresh", refresh);
router.get("/info", auth, getUser);
router.patch("/update-user", auth, updateUsername);
router.patch("/update-password", auth, updateUserPassword);
router.delete("/delete-user", auth, deleteUser);

export default router;
