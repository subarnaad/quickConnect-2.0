const User = require("../../models/user.js");

const getAllUsers = async (req, res) => {
  const role = req.query.role || "";

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const user = await User.find({
      ...(role ? { role } : {}),
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    const totalUsers = await User.countDocuments({
      ...(role ? { role } : {}),
    });
    const totalPages = Math.ceil(totalUsers / limit);
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: {
        users: user,
        totalUsers: totalUsers,
        totalPages: totalPages,
        currentPage: page,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = {
  getAllUsers,
};
