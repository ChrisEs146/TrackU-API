/**
 * Gets the first error message
 * from a mongoose validationError Object
 * @param {Object} error Object with error objects
 * @returns A String with the first error message
 */
export const getError = function (error) {
  return error.errors[Object.keys(error.errors)[0]].message;
};
