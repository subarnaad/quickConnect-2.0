const express = require("express");
const router = express.Router();
const Feedback = require("../../models/feedback"); // Import the Feedback model
const {
  getAllFeedbacks,
} = require("../../controllers/student-controller/feedbackController");

const authenticateMiddleware = require("../../middleware/auth-middleware");
// POST API to save feedback
router.post("/submit-feedback", async (req, res) => {
  const { description, studentId, courseId, curriculumId } = req.body;

  // Validate required fields
  if (!description || !studentId || !courseId || !curriculumId) {
    return res.status(400).json({
      success: false,
      message:
        "All fields are required (description, studentId, courseId, curriculumId).",
    });
  }

  try {
    // Create a new feedback document
    const feedback = new Feedback({
      description,
      studentId,
      courseId,
      curriculumId,
    });

    // Save the feedback to the database
    await feedback.save();

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully!",
    });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while submitting feedback.",
    });
  }
});

router.get("/getAllFeedback", authenticateMiddleware, getAllFeedbacks);
module.exports = router;
