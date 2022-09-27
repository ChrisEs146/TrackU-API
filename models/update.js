import mongoose from "mongoose";

const updateSchema = mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Project" },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Update", updateSchema);
