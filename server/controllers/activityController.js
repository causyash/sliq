const Activity = require('../models/Activity');

// @desc    Get activity for a project
// @route   GET /api/activity/project/:projectId
// @access  Private
const getProjectActivity = async (req, res) => {
  try {
    const activities = await Activity.find({ projectId: req.params.projectId })
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjectActivity
};
