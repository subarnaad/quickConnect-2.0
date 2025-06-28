const Course = require("../../models/course.js");

const getAllCourses = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  try {
    const coursesList = await Course.find()
      .populate("instructorId", "name email profileImage")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const totalCourses = await Course.countDocuments({});
    const totalPages = Math.ceil(totalCourses / limit);

    res.status(200).json({
      success: true,
      data: {
        courses: coursesList,
        totalCourses: totalCourses,
        totalPages: totalPages,
        currentPage: page,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

// Controller to edit a course (remove or hide)
const editCourse = async (req, res) => {
  const { courseId, curriculumId } = req.params; // Course ID and Curriculum ID from the request parameters

  try {
    // Find the course by ID
    const course = await Course.findOne({ _id: courseId });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    // Find the curriculum item by ID and update its isActive status
    const curriculumItem = course.curriculum.find(
      (item) => item._id.toString() === curriculumId
    );
    if (!curriculumItem) {
      return res.status(404).json({
        success: false,
        message: "Curriculum item not found!",
      });
    }

    curriculumItem.isActive = !curriculumItem.isActive; // Update the isActive status

    // Save the updated course
    await course.save();

    res.status(200).json({
      success: true,
      message: "Curriculum item updated successfully!",
    });
  } catch (error) {
    console.error("Error editing course:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while editing the course.",
    });
  }
};
module.exports = {
  getAllCourses,
  editCourse,
};
