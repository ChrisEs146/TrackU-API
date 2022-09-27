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

  try {
    // Checking if project ID is valid
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400);
      throw new Error("Project ID is not valid");
    }

    // Finding parent project
    const parentProject = await Project.findById(projectId);
    if (!parentProject) {
      res.status(404);
      throw new Error("Parent project not found");
    }

    // Getting updates from project
    const updates = await Update.find({ project: projectId });
    res.status(200).json(updates);
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

  try {
    // Checking if project ID is valid
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400);
      throw new Error("Project ID is not valid");
    }

    // Finding parent project
    const parentProject = await Project.findById(projectId);
    if (!parentProject) {
      res.status(404);
      throw new Error("Parent project not found");
    }

    // Checking for empty fields
    if (!title || !description) {
      res.status(400);
      throw new Error("Fields cannot be empty");
    }

    // Creating new update
    const update = await Update.create({
      project: projectId,
      title: title,
      description: description,
    });
    res.status(200).json(update);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to get an update from a project
 * based on its ID.
 * @route GET /updates/project/:projectId/update/:updateId
 * @access Private
 */
export const getUpdate = async (req, res, next) => {
  const { projectId } = req.params;
  const { updateId } = req.params;

  try {
    // Checking if project ID is valid
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400);
      throw new Error("Project ID is not valid");
    }

    // Checking if update ID is valid
    if (!mongoose.Types.ObjectId.isValid(updateId)) {
      res.status(400);
      throw new Error("Update ID is not valid");
    }

    // Finding parent project
    const parentProject = await Project.findById(projectId);
    if (!parentProject) {
      res.status(404);
      throw new Error("Parent project not found");
    }

    // Finding update
    const update = await Update.findById(updateId);
    if (!update) {
      res.status(404);
      throw new Error("Update not found");
    }

    // Checking if project ID matches
    if (projectId !== update.project.toString()) {
      res.status(400);
      throw new Error("Unauthorized Update");
    }

    // Sending update
    res.status(200).json({
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
export const modifyUpdate = async (req, res, next) => {
  const { title, description } = req.body;
  const { projectId } = req.params;
  const { updateId } = req.params;

  try {
    // Finding update
    const update = await Update.findById(updateId);
    if (!update) {
      res.status(404);
      throw new Error("Update not found");
    }

    // Checking if project ID matches
    if (update.project.toString() !== projectId) {
      res.status(400);
      throw new Error("Unauthorized Update");
    }

    // Checking for empty fields
    if (!title || !description) {
      res.status(400);
      throw new Error("Field cannot be empty");
    }

    // Updating the project's update
    const modifiedUpdate = await Update.findByIdAndUpdate(
      updateId,
      { title: title, description: description },
      { new: true }
    );

    res.status(200).json(modifiedUpdate);
  } catch (error) {
    next(error);
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
    // Finding update
    const update = await Update.findById(updateId);
    if (!update) {
      res.status(404);
      throw new Error("Update not found");
    }

    // Checking if project ID matches
    if (update.project.toString() !== projectId) {
      res.status(400);
      throw new Error("Unauthorized Update");
    }

    // Deleting update
    await update.remove();
    res.status(200).json({ message: "Updated was deleted successfully" });
  } catch (error) {
    next(error);
  }
};
