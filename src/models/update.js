import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Update:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID
 *         project:
 *           type: string
 *           description: Parent project ID | Auto-generated in project model
 *         title:
 *           type: string
 *           minLength: 4
 *           maxLength: 50
 *           description: Project's title
 *         description:
 *           type: string
 *           minLength: 4
 *           maxLength: 800
 *           description: Project's description
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated date
 *       example:
 *         project: 507f1f77bcf86cd799439011
 *         _id: 507f1f77bcf86cd799439089
 *         title: Navigation component is ready
 *         description: The navigation component completed and fully responsive
 *         createdAt: 2022-02-26T17:08:13.930Z
 *         updatedAt: 2022-02-26T17:08:13.008Z
 */
const updateSchema = mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Project" },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [4, "Title should have at least 4 characters"],
      maxlength: [50, "Title cannot have more than 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Description is required"],
      minlength: [4, "Description cannot have less than 4 characters"],
      maxlength: [800, "Description cannot have more than 800 characters"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Update", updateSchema);
