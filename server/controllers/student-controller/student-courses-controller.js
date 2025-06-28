const Course = require("../../models/Course");
const CourseProgress = require("../../models/CourseProgress");
const Order = require("../../models/Order");
const StudentCourses = require("../../models/StudentCourses");

const getCoursesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentBoughtCourses = await Order.find({
      userId: studentId,
      paymentStatus: "paid",
      orderStatus: "confirmed",
    }).select("courseId");

    // Extract courseIds from the array of orders
    const courseIds = studentBoughtCourses.map((order) => order.courseId);

    const studentCourses = await Course.find({
      _id: { $in: courseIds },
    });
    const CourseProgressDetails = await CourseProgress.find({
      userId: studentId,
      courseId: { $in: courseIds },
    });

    // Create a map for quick lookup
    const progressMap = {};
    CourseProgressDetails.forEach((progress) => {
      progressMap[progress.courseId.toString()] = progress;
    });

    // Attach progress to each course
    const coursesWithProgress = studentCourses.map((course) => {
      const progress = progressMap[course._id.toString()];
      return {
        ...course.toObject(),
        progress: progress ? progress : null,
      };
    });

    res.status(200).json({
      success: true,
      data: coursesWithProgress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = { getCoursesByStudentId };
