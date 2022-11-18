import mongoose from "mongoose";
import Project from "../models/project.js";

/**
 * Checks if a mongoose id is valid.
 * @param {mongoose.Types.ObjectId} id
 * @returns boolean
 */
export const isValidMongooseId = function (id) {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Finds and returns a projects' array from a user.
 * @param {mongoose.Types.ObjectId} userId
 * @returns Projects
 */
export const findProjects = async function (userId) {
  try {
    const projects = await Project.find({ user: userId }).lean().exec();
    return projects;
  } catch (error) {
    throw error;
  }
};

/**
 * Finds and returns a project.
 * @param {mongoose.Types.ObjectId} projectId
 * @returns Project
 */
export const findProject = async function (projectId) {
  try {
    const project = await Project.findById(projectId).lean().exec();
    return project;
  } catch (error) {
    throw error;
  }
};

/**
 * Creates and returns a project.
 * @param {mongoose.Types.ObjectId} userId
 * @param {string} title
 * @param {string} description
 * @returns Created Project
 */
export const createProject = async function (userId, title, description) {
  try {
    const project = await Project.create({ user: userId, title, description });
    return project;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates and returns the updated project.
 * @param {mongoose.Types.ObjectId} projectId
 * @param {string} title
 * @param {string} status
 * @param {number} progress
 * @param {string} description
 * @returns Updated Project
 */
export const editProject = async function (projectId, title, status, progress, description) {
  try {
    const newProject = await Project.findOneAndUpdate(
      { _id: projectId },
      { title, status, progress, description },
      { new: true, runValidators: true }
    ).exec();
    return newProject;
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes a given project.
 * @param {mongoose.Document} project
 */
export const removeProject = async function (project) {
  try {
    await project.remove();
  } catch (error) {
    throw error;
  }
};
