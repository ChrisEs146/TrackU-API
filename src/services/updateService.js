import Update from "../models/update.js";
import Project from "../models/project.js";
import mongoose from "mongoose";

/**
 * Finds and returns an updates' array.
 * @param {mongoose.Types.ObjectId} projectId
 * @returns Updates
 */
export const findUpdates = async function (projectId) {
  try {
    const updates = await Update.find({ project: projectId }).lean().exec();
    return updates;
  } catch (error) {
    throw error;
  }
};

/**
 * Finds and returns an update.
 * @param {mongoose.Types.ObjectId} updateId
 * @param {boolean} withLean Flag to find an update with the lean method.
 * Set by default to **false**
 * @returns Update
 */
export const findUpdate = async function (updateId, withLean = false) {
  try {
    let update;
    if (withLean) {
      update = await Update.findById(updateId).lean().exec();
    } else {
      update = await Update.findById(updateId).exec();
    }
    return update;
  } catch (error) {
    throw error;
  }
};

/**
 * Creates and returns an update.
 * @param {mongoose.Types.ObjectId} projectId
 * @param {string} title
 * @param {string} description
 * @returns Created Update
 */
export const createUpdate = async function (projectId, title, description) {
  try {
    const update = await Update.create({
      project: projectId,
      title: title,
      description: description,
    });
    return update;
  } catch (error) {
    throw error;
  }
};

/**
 * Edits and returns an update.
 * @param {mongoose.Types.ObjectId} updateId
 * @param {string} title
 * @param {string} description
 * @returns Modified Update
 */
export const modifyUpdate = async function (updateId, title, description) {
  try {
    const modifiedUpdate = await Update.findOneAndUpdate(
      { _id: updateId },
      { title, description },
      { new: true, runValidators: true }
    ).exec();
    return modifiedUpdate;
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes an update.
 * @param {mongoose.Document} update
 */
export const removeUpdate = async function (update) {
  try {
    await update.remove();
  } catch (error) {
    throw error;
  }
};
