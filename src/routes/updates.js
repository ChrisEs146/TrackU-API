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

/**
 * @swagger
 * /updates/{projectId}:
 *   post:
 *     tags: [Update]
 *     summary: Add update to a project
 *     parameters:
 *      - in: path
 *        name: projectId
 *        schema:
 *          type: string
 *        required: true
 *        description: The project ID
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
 *               title: Navigation is completed
 *               description: Navigation completed and fully responsive
 *     responses:
 *       201:
 *         description: Successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 project:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *               example:
 *                 project: 507f1f77bcf86cd799439011
 *                 _id: 507f1f77bcf86cd799439089
 *                 title: Navigation is completed
 *                 description: Navigation completed and fully responsive
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
 *                 message: Parent project not found
 */
router.post("/:projectId", auth, addUpdate);

/**
 * @swagger
 * /updates/{projectId}:
 *   get:
 *     tags: [Update]
 *     summary: Get updates from a project
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
 *                 updates:
 *                   type: array
 *                   nullable: true
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       project:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                     example:
 *                       project: 507f1f77bcf86cd799439011
 *                       _id: 507f1f77bcf86cd799439089
 *                       title: Navigation is completed
 *                       description: Navigation completed and fully responsive
 *                       createdAt: 2022-02-26T17:08:13.930Z
 *                       updatedAt: 2022-02-26T17:08:13.008Z
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
 *                 message: Parent project not found
 */
router.get("/:projectId", auth, getUpdates);

/**
 * @swagger
 * /updates/project/{projectId}/update/{updateId}:
 *   get:
 *     tags: [Update]
 *     summary: Get an update from a project
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: The project ID
 *       - in: path
 *         name: updateId
 *         schema:
 *           type: string
 *         required: true
 *         description: The update ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 added:
 *                   type: string
 *                   format: date-time
 *               example:
 *                 id: 507f1f77bcf86cd799439089
 *                 title: Navigation component is ready
 *                 description: Navigation completed and fully functional
 *                 added: 2022-02-26T17:08:13.930Z
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
 *                 message: Update not found
 */
router.get("/project/:projectId/update/:updateId", auth, getUpdate);

/**
 * @swagger
 * /updates/project/{projectId}/update/{updateId}:
 *   put:
 *     tags: [Update]
 *     summary: Edit an update of a project
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: The project ID
 *       - in: path
 *         name: updateId
 *         schema:
 *           type: string
 *         required: true
 *         description: The update ID
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
 *               title: Navigation is done
 *               description: Navigation completed and fully responsive
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
 *                 project:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *               example:
 *                 _id: 507f1f77bcf86cd799439089
 *                 project: 507f1f77bcf86cd799439090
 *                 title: Navigation is done
 *                 description: Navigation completed and fully functional
 *                 createdAt: 2022-02-25T17:08:13.930Z
 *                 updatedAt: 2022-02-26T17:08:13.930Z
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
 *                 message: Update not found
 */
router.put("/project/:projectId/update/:updateId", auth, editUpdate);

/**
 * @swagger
 * /updates/project/{projectId}/update/{updateId}:
 *   delete:
 *     tags: [Update]
 *     summary: Delete an update of a project
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: The project ID
 *       - in: path
 *         name: updateId
 *         schema:
 *           type: string
 *         required: true
 *         description: The update ID
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
 *                 message: Update was deleted successfully
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
 *                 message: Update ID is not valid
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
 *                 message: Update not found
 */
router.delete("/project/:projectId/update/:updateId", auth, deleteUpdate);

export default router;
