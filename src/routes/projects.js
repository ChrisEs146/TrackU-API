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

/**
 * @swagger
 * /projects:
 *   post:
 *     tags: [Project]
 *     summary: Add project to authenticated user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *             example:
 *               title: React Web Application
 *               description: A simple web application in react
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
 *                 user:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 status:
 *                   type: string
 *                 progress:
 *                   type: number
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *               example:
 *                 user: 507f1f77bcf86cd799439011
 *                 _id: 507f1f77bcf86cd799439089
 *                 title: React Web Application
 *                 description: A simple web application in react
 *                 status: Not Started
 *                 progress: 0
 *                 createdAt: 2022-02-26T17:08:13.930Z
 *                 updatedAt: 2022-02-26T17:08:13.008Z
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
 *                 message: Invalid Token
 *       403:
 *         description: forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Token not found
 */
router.post("/", auth, addProject);

/**
 * @swagger
 * /projects:
 *   get:
 *     tags: [Project]
 *     summary: Get all projects from an authenticated user
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projects:
 *                   type: array
 *                   nullable: true
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       user:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       status:
 *                         type: string
 *                       progress:
 *                         type: number
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                     example:
 *                       user: 507f1f77bcf86cd799439011
 *                       _id: 507f1f77bcf86cd799439089
 *                       title: React Web Application
 *                       description: A simple web application in react
 *                       status: Not Started
 *                       progress: 0
 *                       createdAt: 2022-02-26T17:08:13.930Z
 *                       updatedAt: 2022-02-26T17:08:13.008Z
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
 *                 message: Invalid Token
 *       403:
 *         description: forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Token not found
 */
router.get("/", auth, getAllProjects);

/**
 * @swagger
 * /projects/{projectId}:
 *   get:
 *     tags: [Project]
 *     summary: Get a project from an authenticated user
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: The project ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 user:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 status:
 *                   type: string
 *                 progress:
 *                   type: number
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *               example:
 *                 user: 507f1f77bcf86cd799439011
 *                 _id: 507f1f77bcf86cd799439089
 *                 title: React Web Application
 *                 description: A simple web application in react
 *                 status: Not Started
 *                 progress: 0
 *                 createdAt: 2022-02-26T17:08:13.930Z
 *                 updatedAt: 2022-02-26T17:08:13.008Z
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
 *                 message: Project ID is not valid
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
 *                 message: Project not found
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
 *                 message: Invalid Token
 *       403:
 *         description: forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Token not found
 */
router.get("/:projectId", auth, getProject);

/**
 * @swagger
 * /projects/{projectId}:
 *   put:
 *     tags: [Project]
 *     summary: Update a project from an authenticated user
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: The project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - status
 *               - progress
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               progress:
 *                 type: number
 *             example:
 *               title: React Web Application
 *               description: A simple web application in react
 *               status: In Progress
 *               progress: 60
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 user:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 status:
 *                   type: string
 *                 progress:
 *                   type: number
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *               example:
 *                 user: 507f1f77bcf86cd799439011
 *                 _id: 507f1f77bcf86cd799439089
 *                 title: React Web Application
 *                 description: A simple web application in react
 *                 status: In Progress
 *                 progress: 60
 *                 createdAt: 2022-02-26T17:08:13.930Z
 *                 updatedAt: 2022-02-27T17:08:13.008Z
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
 *                 message: Project ID is not valid
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
 *                 message: Project not found
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
 *                 message: Invalid Token
 *       403:
 *         description: forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Token not found
 */
router.put("/:projectId", auth, updateProject);

/**
 * @swagger
 * /projects/{projectId}:
 *   delete:
 *     tags: [Project]
 *     summary: Delete a project from an authenticated user
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: The project ID
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
 *                 message: Project was deleted successfully
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
 *                 message: Project ID is not valid
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
 *                 message: Invalid Token
 *       403:
 *         description: forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Token not found
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
 *                 message: Project not found
 */
router.delete("/:projectId", auth, deleteProject);

export default router;
