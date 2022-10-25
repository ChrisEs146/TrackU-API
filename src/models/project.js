import mongoose from "mongoose";

const projectSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [4, "Title should have at least 4 characters."],
      maxlength: [50, "Title cannot have more than 50 characters"],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      default: "Not Started",
      enum: {
        values: ["Not Started", "In Progress", "Completed"],
        message: `{VALUE} is not supported`,
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
