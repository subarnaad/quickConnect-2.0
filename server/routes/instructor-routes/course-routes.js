const express = require("express");
const {
  addNewCourse,
  getAllCourses,
  getCourseDetailsByID,
  updateCourseByID,
  getCoursesByInstructor,
  sendMail,
} = require("../../controllers/instructor-controller/course-controller");
const authenticate = require("../../middleware/auth-middleware");
const router = express.Router();

router.post("/add", addNewCourse);
router.get("/get", authenticate, getAllCourses);
router.get("/get/details/:id", getCourseDetailsByID);
router.put("/update/:id", updateCourseByID);
router.post("/send-mail", sendMail);
module.exports = router;
