import mongoose from "mongoose";

const updateSchema = mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Project" },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [4, "Title should have at least 4 characters."],
      maxlength: [50, "Title cannot have more than 50 characters"],
    },
    description: {
      type: String,
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
