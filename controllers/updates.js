import Update from "../models/update.js";

/**
 * Controller to get all updates from a project.
 * @route GET /updates
 * @access Private
 */
export const getUpdates = async (req, res, next) => {
  const { projectId } = req.params;

  try {
    // Extracting updates from project
    const updates = await Update.find({ project: projectId });
    res.status(200).json(updates);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to add an update to a project.
 * @route POST /upddates
 * @access Private
 */
export const addUpdate = async (req, res, next) => {
  const { title, description } = req.body;
  const { projectId } = req.body;

  try {
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
 * @route GET /updates/:updateId
 * @access Private
 */
export const getUpdate = async (req, res, next) => {
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
