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

router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/logout", logOut);
router.get("/refresh", refresh);
router.get("/info", auth, getUser);
router.patch("/update-user", auth, updateUsername);
router.patch("/update-password", auth, updateUserPassword);
router.delete("/delete-user", auth, deleteUser);

export default router;
