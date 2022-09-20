import express from "express";
import {
  signIn,
  signUp,
  getUser,
  updateUsername,
  updateUserPassword,
  deleteUser,
} from "../controllers/users.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.get("/info", auth, getUser);
router.patch("/user-update", auth, updateUsername);

export default router;
