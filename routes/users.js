import express from "express";
import { signIn, signUp, getUser } from "../controllers/users.js";
import { auth } from "../middleware/auth";
const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.get("/info", auth, getUser);

export default router;
