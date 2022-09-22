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

