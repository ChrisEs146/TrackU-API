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
    // Finding project
    const project = await Project.findById(projectId);

    // Checking if project is valid
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
