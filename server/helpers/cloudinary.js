const cloudinary = require("cloudinary").v2;

// Cloudinary configuration with .env

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadMediaToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error uploading to cloudinary");
  }
};

const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
    throw new Error("failed to delete assest from cloudinary");
  }
};

// Document upload (PDF, DOCX, PPT, etc.)
const uploadDocumentToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",
      type: "upload", // ensure public upload
    });
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error uploading document to cloudinary");
  }
};

// Document delete
const deleteDocumentFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete document from cloudinary");
  }
};

module.exports = {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
  uploadDocumentToCloudinary,
  deleteDocumentFromCloudinary,
};
