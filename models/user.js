import mongoose from "mongoose";
import Project from "./project.js";
import Update from "./update.js";

const userSchema = mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model("User", userSchema);
