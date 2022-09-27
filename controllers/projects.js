import mongoose from "mongoose";
import Project from "../models/project.js";

/**
 * Controller to get all projects from a user.
 * @route GET /projects
 * @access Private
 */
export const getAllProjects = async (req, res, next) => {
  try {
    // Finding all projects
    const projects = await Project.find({ user: req.user.id });

    // Sending a response with all projects
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to add a project.
 * @route POST /projects
 * @access Private
 */
export const addProject = async (req, res, next) => {
  const { title, description } = req.body;
  const { id } = req.user;

  try {
    // Checking for empty fields
    if (!title || !description) {
      res.status(400);
      throw new Error("Fields cannot be empty");
    }

    //  Creating project and sending response
    const project = await Project.create({ user: id, title: title, description: description });
    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to get a sigle project based on
 * its ID.
 * @route GET /projects/:projectId
 * @access Private
 */
export const getProject = async (req, res, next) => {
  const { projectId } = req.params;

  try {
    // Checking if project ID is valid
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400);
      throw new Error("Project ID is not valid");
    }

    // Finding project
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    // Validating project's owner
    if (!req.user || project.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("User not authorized");
    }

    // Sending response with the project
    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to update a project based on its ID.
 * @route PUT /projects/:projectId
 * @access Private
 */
export const updateProject = async (req, res, next) => {
  const { title, status, progress, description } = req.body;
  const { projectId } = req.params;

  try {
    // Checking if project ID is valid
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400);
      throw new Error("Project ID is not valid");
    }

    // Finding project
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    // Validating project's owner
    if (!req.user || project.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("User not authorized");
    }

    // Checking for empty fields
    if (!title || !status || !progress || !description) {
      res.status(400);
      throw new Error("Fields cannot be empty");
    }

    // Updating the project
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        title: title,
        status: status,
        progress: progress,
        description: description,
      },
      { new: true }
    );

    // Sending a response with the updated project
    res.status(200).json(updatedProject);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete a project based on its ID.
 * @route DELETE /projects/:projectId
 * @access Private
 */
export const deleteProject = async (req, res, next) => {
  const { projectId } = req.params;

  try {
    // Checking i f project ID is alid
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400);
      throw new Error("Project ID is not valid");
    }

    // Finding project
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    // Validating project's owner
    if (!req.user || project.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("User not authorized");
    }

    // Deleting the project
    await project.remove();
    // Sending a response with a confirmation
    res.status(200).json({ message: "Project was deleted successfully" });
  } catch (error) {
    next(error);
  }
};
