import Update from "../models/update.js";
import Project from "../models/project.js";
import mongoose from "mongoose";

/**
 * Controller to get all updates from a project.
 * @route GET /updates/:projectId
 * @access Private
 */
export const getUpdates = async (req, res, next) => {
  const { projectId } = req.params;

  // Checking if project ID is valid
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ message: "Project ID is not valid" });
  }

  try {
    // Finding parent project
    const parentProject = await Project.findById(projectId).lean().exec();
    if (!parentProject) {
      return res.status(404).json({ message: "Parent project not found" });
    }

    // Getting updates from project
    const updates = await Update.find({ project: projectId }).lean().exec();
    return res.status(200).json(updates);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to add an update to a project.
 * @route POST /updates/:projectId
 * @access Private
 */
export const addUpdate = async (req, res, next) => {
  const { title, description } = req.body;
  const { projectId } = req.params;

  // Checking for empty fields
  if (!title || !description) {
    return res.status(400).json({ message: "Fields cannot be empty" });
  }

  // Checking if project ID is valid
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ message: "Project ID is not valid" });
  }

  // Finding parent project
  try {
    const parentProject = await Project.findById(projectId).lean().exec();
    if (!parentProject) {
      return res.status(404).json({ message: "Parent project not found" });
    }
  } catch (error) {
    next(error);
  }

  // Creating new update
  try {
    const update = await Update.create({
      project: projectId,
      title: title,
      description: description,
    });
    return res.status(201).json(update);
  } catch (error) {
    return res.status(400).json({ message: getError(error) });
  }
};

/**
 * Controller to get an update from a project
 * based on its ID.
 * @route GET /updates/project/:projectId/update/:updateId
 * @access Private
 */
export const getUpdate = async (req, res, next) => {
  const { projectId, updateId } = req.params;

  // Checking if project ID is valid
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ message: "Project ID is not valid" });
  }

  // Checking if update ID is valid
  if (!mongoose.Types.ObjectId.isValid(updateId)) {
    return res.status(400).json({ message: "Update ID is not valid" });
  }

  try {
    // Finding parent project
    const parentProject = await Project.findById(projectId).lean().exec();
    if (!parentProject) {
      return res.status(404).json({ message: "Parent project not found" });
    }

    // Finding update
    const update = await Update.findById(updateId).lean().exec();
    if (!update) {
      return res.status(404).json({ message: "Update not found" });
    }

    // Checking if project ID matches
    if (projectId !== update.project.toString()) {
      return res.status(400).json({ message: "Unauthorized Update" });
    }

    // Sending update
    return res.status(200).json({
      id: update._id,
      title: update.title,
      description: update.description,
      added: update.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to modify or update a project's update.
 * @route POST /updates/project/:projectId/update/:updateId
 * @access Private
 */
export const editUpdate = async (req, res, next) => {
  const { title, description } = req.body;
  const { projectId, updateId } = req.params;

  // Checking for empty fields
  if (!title || !description) {
    return res.status(400).json({ message: "Field cannot be empty" });
  }

  // Checking if project ID is valid
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ message: "Project ID is not valid" });
  }

  // Checking if update ID is valid
  if (!mongoose.Types.ObjectId.isValid(updateId)) {
    return res.status(400).json({ message: "Update ID is not valid" });
  }

  try {
    // Finding parent project
    const parentProject = await Project.findById(projectId).lean().exec();
    if (!parentProject) {
      return res.status(404).json({ message: "Parent project not found" });
    }

    // Finding update
    const update = await Update.findById(updateId).lean().exec();
    if (!update) {
      return res.status(404).json({ message: "Update not found" });
    }

    // Checking if project ID matches
    if (update.project.toString() !== projectId) {
      return res.status(400).json({ message: "Unauthorized Update" });
    }
  } catch (error) {
    next(error);
  }

  try {
    // Updating the project's update
    const modifiedUpdate = await Update.findOneAndUpdate(
      { _id: updateId },
      { title, description },
      { new: true, runValidators: true }
    ).exec();
    return res.status(200).json(modifiedUpdate);
  } catch (error) {
    return res.status(400).json({ message: getError(error) });
  }
};

/**
 * Controller to delete a project's update based
 * on its ID.
 * @route DELETE /updates/project/:projectId/update/:updateId
 * @access Private
 */
export const deleteUpdate = async (req, res, next) => {
  const { projectId } = req.params;
  const { updateId } = req.params;

  try {
    // Checking if project ID is valid
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Project ID is not valid" });
    }

    // Checking if update ID is valid
    if (!mongoose.Types.ObjectId.isValid(updateId)) {
      return res.status(400).json({ message: "Update ID is not valid" });
    }

    // Finding parent project
    const parentProject = await Project.findById(projectId).lean().exec();
    if (!parentProject) {
      return res.status(404).json({ message: "Parent project not found" });
    }

    // Finding update
    const update = await Update.findById(updateId).exec();
    if (!update) {
      return res.status(404).json({ message: "Update not found" });
    }

    // Checking if project ID matches
    if (update.project.toString() !== projectId) {
      return res.status(400).json({ message: "Unauthorized Update" });
    }

    // Deleting update
    await update.remove();
    res.status(200).json({ message: "Updated was deleted successfully" });
  } catch (error) {
    next(error);
  }
};
