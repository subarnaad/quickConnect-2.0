const express = require("express");
const {
  getAllUsers,
} = require("../../controllers/admin-controller/user-controller.js");
const authenticateMiddleware = require("../../middleware/auth-middleware");
const {
  getAllCourses,
  editCourse,
} = require("../../controllers/admin-controller/course-controller.js");

const router = express.Router();
router.get("/getAllUsers", authenticateMiddleware, getAllUsers);
router.get("/getAllCourses", authenticateMiddleware, getAllCourses);
router.get(
  "/editCourse/:courseId/curriculum/:curriculumId",
  authenticateMiddleware,
  editCourse
);

module.exports = router;
