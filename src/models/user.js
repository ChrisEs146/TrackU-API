import mongoose from "mongoose";
import Project from "./project.js";
import Update from "./update.js";
import bcrypt from "bcryptjs";
import validator from "validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - password
 *       properties:
 *         fullName:
 *           type: string
 *           description: User's fullname
 *         email:
 *           type: string
 *           description: User's email
 *         password:
 *           type: string
 *           description: User's password
 *       example:
 *         fullName: Frank Smith
 *         email: frank07@email.com
 *         password: passWord14%
 */
const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Fullname is required"],
    trim: true,
    minlength: [4, "Fullname should have at least 4 characters"],
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

// Hashing password on save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("User", userSchema);
