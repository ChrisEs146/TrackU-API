import express from "express";
import { auth } from "../middleware/auth.js";
import {
  getUpdates,
  addUpdate,
  getUpdate,
  editUpdate,
  deleteUpdate,
} from "../controllers/updates.js";

const router = express.Router();

router.get("/:projectId", auth, getUpdates);
router.post("/:projectId", auth, addUpdate);
router.get("/project/:projectId/update/:updateId", auth, getUpdate);
router.put("/project/:projectId/update/:updateId", auth, editUpdate);
router.delete("/project/:projectId/update/:updateId", auth, deleteUpdate);

export default router;
