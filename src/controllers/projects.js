import {
  createProject,
  findProject,
  findProjects,
  isValidMongooseId,
  removeProject,
  editProject,
} from "../services/projectService.js";
import { getError } from "../utils/getError.js";

/**
 * Controller to get all projects from a user.
 * @route GET /projects
 * @access Private
 */
export const getAllProjects = async (req, res, next) => {
  try {
    // Finding all projects
    const projects = await findProjects(req.user._id);

    // Sending a response with all projects
    return res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to add a project.
 * @route POST /projects
 * @access Private
 */
export const addProject = async (req, res) => {
  const { title, description } = req.body;
  const { _id } = req.user;

  // // Checking for empty fields
  if (!title || !description) {
    return res.status(400).json({ message: "Fields cannot be empty" });
  }

  //  Creating and validating project
  try {
    const project = await createProject(_id, title, description);
    return res.status(201).json(project);
  } catch (error) {
    return res.status(400).json({ message: getError(error) });
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

  // Checking if project ID is valid
  if (!isValidMongooseId(projectId)) {
    return res.status(400).json({ message: "Project ID is not valid" });
  }

  try {
    // Finding project
    const project = await findProject(projectId, true);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Validating project's owner
    if (!project.user.equals(req.user._id)) {
      return res.status(401).json({ message: "User not authorized" });
    }

    // Sending response with the project
    return res.status(200).json(project);
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

  // Checking for empty fields
  if (!title || !status || !progress || !description) {
    return res.status(400).json({ message: "Fields cannot be empty" });
  }

  // Checking if project ID is valid
  if (!isValidMongooseId(projectId)) {
    return res.status(400).json({ message: "Project ID is not valid" });
  }

  try {
    // Finding project
    const project = await findProject(projectId, true);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Validating project's owner
    if (!project.user.equals(req.user._id)) {
      return res.status(401).json({ message: "User not authorized" });
    }
  } catch (error) {
    next(error);
  }

  try {
    // Updating the project
    const updatedProject = await editProject(projectId, title, status, progress, description);
    return res.status(200).json(updatedProject);
  } catch (error) {
    return res.status(400).json({ message: getError(error) });
  }
};

/**
 * Controller to delete a project based on its ID.
 * @route DELETE /projects/:projectId
 * @access Private
 */
export const deleteProject = async (req, res, next) => {
  const { projectId } = req.params;

  // Checking i f project ID is alid
  if (!isValidMongooseId(projectId)) {
    return res.status(400).json({ message: "Project ID is not valid" });
  }

  try {
    // Finding project
    const project = await findProject(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Validating project's owner
    if (!project.user.equals(req.user._id)) {
      return res.status(401).json({ message: "User not authorized" });
    }

    // Deleting the project
    await removeProject(project);
    // Sending a response with a confirmation
    return res.status(200).json({ message: "Project was deleted successfully" });
  } catch (error) {
    next(error);
  }
};
