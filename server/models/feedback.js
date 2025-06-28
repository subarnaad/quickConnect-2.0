const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the Student model
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course", // Reference to the Course model
    required: true,
  },
  curriculumId: {
    type: String,
  },
});

module.exports = mongoose.model("feedbacks", feedbackSchema);
