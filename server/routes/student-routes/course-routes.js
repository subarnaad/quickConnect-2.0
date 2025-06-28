
const express = require("express");
const {
  getStudentViewCourseDetails,
  getAllStudentViewCourses,
  checkCoursePurchaseInfo,
} = require("../../controllers/student-controller/course-controller");

const router = express.Router();
// Route to get all available courses for students

router.get("/get", getAllStudentViewCourses);
// Route to get detailed information about a specific course by its ID
router.get("/get/details/:id", getStudentViewCourseDetails);
router.get("/purchase-info/:id/:studentId", checkCoursePurchaseInfo);

module.exports = router;