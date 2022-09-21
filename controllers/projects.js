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
