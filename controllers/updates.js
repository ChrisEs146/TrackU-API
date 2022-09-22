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

