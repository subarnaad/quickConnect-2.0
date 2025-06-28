const Feedback = require("../../models/feedback");
const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({})
      .populate("studentId", "userName userEmail")
      .populate("courseId", "title curriculum");
    res.status(200).json({
      success: true,
      data: feedbacks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  getAllFeedbacks,
};
