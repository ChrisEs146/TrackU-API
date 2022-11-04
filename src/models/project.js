import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - user
 *         - title
 *         - description
 *         - status
 *         - progress
 *       properties:
 *         user:
 *           type: string
 *           description: Auto-generated user ID
 *         title:
 *           type: string
 *           description: Project's title
 *         description:
 *           type: string
 *           description: Project's description
 *         status:
 *           type: string
 *           description: Could be "Not started", "In Progress" or "Completed"
 *         progress:
 *           type: number
 *           description: Project's progress
 *         createdAt:
 *           type: date
 *           description: Auto-generated date
 *         updatedAt:
 *           type: date
 *           description: Auto-generated date
 *       example:
 *         user: 507f1f77bcf86cd799439011
 *         title: React Web Application
 *         description: A simple web application in react
 *         status: Not Started
 *         progress: 0
 *         createdAt: 2022-02-26T17:08:13.930Z
 *         updatedAt: 2022-02-26T17:08:13.008Z
 */
const projectSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [4, "Title should have at least 4 characters"],
      maxlength: [50, "Title cannot have more than 50 characters"],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      default: "Not Started",
      enum: {
        values: ["Not Started", "In Progress", "Completed"],
        message: "{VALUE} is not supported",
      },
    },
    progress: {
      type: Number,
      required: [true, "Progress is required"],
      default: 0,
      min: [0, "Progress cannot be less than 0"],
      max: [100, "Progress cannot be more than 100"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [4, "Description cannot have less than 4 characters"],
      maxlength: [800, "Description cannot have more than 800 characters"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
