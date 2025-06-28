const express = require("express");
const multer = require("multer");
const {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
  uploadDocumentToCloudinary,
  deleteDocumentFromCloudinary,
} = require("../../helpers/cloudinary");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// Media upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMediaToCloudinary(req.file.path);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    console.log(e);

    res.status(500).json({ success: false, message: "Error uploading file" });
  }
});

// Media delete
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Assest Id is required",
      });
    }

    await deleteMediaFromCloudinary(id);
    res.status(200).json({
      success: true,
      message: "Assest deleted successfully from cloudinary",
    });
  } catch (e) {
    console.log(e);

    res.status(500).json({ success: false, message: "Error deleting file" });
  }
});

// Bulk media upload
router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    const uploadPromises = req.files.map((fileItem) =>
      uploadMediaToCloudinary(fileItem.path)
    );

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (event) {
    console.log(event);

    res
      .status(500)
      .json({ success: false, message: "Error in bulk uploading files" });
  }
});

// Document upload
router.post("/document/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await uploadDocumentToCloudinary(req.file.path);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ success: false, message: "Error uploading document" });
  }
});

// Document delete
router.delete("/document/delete/:publicId", async (req, res) => {
  try {
    const { publicId } = req.params;
    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Document publicId is required",
      });
    }
    await deleteDocumentFromCloudinary(publicId);
    res.status(200).json({
      success: true,
      message: "Document deleted successfully from cloudinary",
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ success: false, message: "Error deleting document" });
  }
});

module.exports = router;
