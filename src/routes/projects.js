import express from "express";
import { auth } from "../middleware/auth.js";
import {
  getAllProjects,
  addProject,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/projects.js";

const router = express.Router();

router.get("/", auth, getAllProjects);
router.post("/", auth, addProject);
router.get("/:projectId", auth, getProject);
router.put("/:projectId", auth, updateProject);
router.delete("/:projectId", auth, deleteProject);

export default router;
