import mongoose from "mongoose";
import Project from "./project.js";
import Update from "./update.js";

const userSchema = mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
// Delete on cascade-like trigger
userSchema.pre("remove", async function () {
  const projects = await Project.find({ user: this._id }).exec();
  const projectsId = projects.map((project) => project._id);
  await Update.deleteMany({ project: { $in: projectsId } }).exec();
  await Project.deleteMany({ user: this._id }).exec();
});

export default mongoose.model("User", userSchema);
