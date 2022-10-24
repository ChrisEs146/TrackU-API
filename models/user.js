import mongoose from "mongoose";
import Project from "./project.js";
import Update from "./update.js";

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Fullname is required"],
    trim: true,
    minlength: [4, " Fullname should have at least 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    validate: {
      validator: function (value) {
        return /^(?=\S)(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#%^&*])[a-zA-Z0-9!@#%^&*]{8,20}$/.test(
          value
        );
      },
      message: "Invalid Password",
    },
  },
});

// Delete on cascade-like trigger
userSchema.pre("remove", async function () {
  const projects = await Project.find({ user: this._id }).exec();
  const projectsId = projects.map((project) => project._id);
  await Update.deleteMany({ project: { $in: projectsId } }).exec();
  await Project.deleteMany({ user: this._id }).exec();
});

export default mongoose.model("User", userSchema);
