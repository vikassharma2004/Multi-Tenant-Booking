export const uploadSingleImage = async (filePath, folder = "default") => {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, { folder });
    return { url: result.secure_url, public_id: result.public_id };
  } catch (err) {
    console.error("Cloudinary single upload error:", err);
    throw err;
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param {Array<string>} files - array of local paths or base64 strings
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Array<{url: string, public_id: string}>>}
 */
export const uploadMultipleImages = async (files, folder = "default") => {
  try {
    const uploads = files.map(file => cloudinary.v2.uploader.upload(file, { folder }));
    const results = await Promise.all(uploads);
    return results.map(r => ({ url: r.secure_url, public_id: r.public_id }));
  } catch (err) {
    console.error("Cloudinary multiple upload error:", err);
    throw err;
  }
};

/**
 * Delete a single image from Cloudinary
 * @param {string} publicId - Cloudinary public_id
 * @returns {Promise<{result: string}>}
 */
export const destroySingleImage = async (publicId) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    return result;
  } catch (err) {
    console.error("Cloudinary destroy single image error:", err);
    throw err;
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param {Array<string>} publicIds - array of public_ids
 * @returns {Promise<{deleted: object}>}
 */
export const destroyMultipleImages = async (publicIds) => {
  try {
    const result = await cloudinary.v2.api.delete_resources(publicIds);
    return result; // result.deleted contains info about each deletion
  } catch (err) {
    console.error("Cloudinary destroy multiple images error:", err);
    throw err;
  }
};
