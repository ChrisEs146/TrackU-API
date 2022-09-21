import mongoose from "mongoose";

const projectSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    title: { type: String, required: true },
    status: { type: String, required: true, default: "Not Started" },
    progress: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
