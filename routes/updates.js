import express from "express";
import { auth } from "../middleware/auth";
import {
  getUpdates,
  addUpdate,
  getUpdate,
  modifyUpdate,
  deleteUpdate,
} from "../controllers/updates.js";

const router = express.Router();

router.get("/", auth, getUpdates);
router.post("/", auth, addUpdate);
router.get("/:updateId", auth, getUpdate);
router.put("/:updateId", auth, modifyUpdate);
router.delete("/:updateId", auth, deleteUpdate);
