import express from "express";
import { auth } from "../middleware/auth";
const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);

export default router;
