const Activity = require('../models/Activity');

const logActivity = async ({ workspaceId, projectId, taskId, userId, action, details }) => {
  try {
    await Activity.create({
      workspaceId,
      projectId,
      taskId,
      userId,
      action,
      details
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

module.exports = logActivity;
