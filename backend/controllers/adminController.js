const User = require('../models/User');
const Blog = require('../models/Blog');

// GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalPosts = await Blog.countDocuments({ isDeleted: false });
    
    // To count comments, we use MongoDB Aggregation because comments are embedded in blogs
    const commentStats = await Blog.aggregate([
      { $match: { isDeleted: false } },
      { $project: { numberOfComments: { $size: { $ifNull: ["$comments", []] } } } },
      { $group: { _id: null, totalComments: { $sum: "$numberOfComments" } } }
    ]);

    const totalComments = commentStats.length > 0 ? commentStats[0].totalComments : 0;

    res.status(200).json({
      totalUsers,
      totalPosts,
      totalComments
    });
  } catch (error) {
    console.error('Dashboard stats error:', error.message);
    res.status(500).json({ message: 'Server error. Could not load dashboard stats.' });
  }
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    // Fetch all users, excluding passwords
    const users = await User.find({ role: 'user'  }).select('-password').sort({ createdAt: -1 });
    
    // For each user, count how many posts they have
    const usersWithPostCounts = await Promise.all(users.map(async (user) => {
      const postCount = await Blog.countDocuments({ author: user._id, isDeleted: false });
      return {
        ...user._doc,
        postCount
      };
    }));

    res.status(200).json(usersWithPostCounts);
  } catch (error) {
    console.error('Get all users error:', error.message);
    res.status(500).json({ message: 'Server error. Could not load users.' });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    // Prevent deleting other admins (optional, but recommended)
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete an admin user.' });
    }

    await User.findByIdAndDelete(req.params.id);
    // Optionally: also soft-delete all blogs by this user
    
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Delete user error:', error.message);
    res.status(500).json({ message: 'Server error. Could not delete user.' });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  deleteUser
};