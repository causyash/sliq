const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Notification = require('../models/Notification');

// @desc    Add a comment
// @route   POST /api/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { taskId, message } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const comment = await Comment.create({
      taskId,
      userId: req.user._id,
      message
    });

    const populatedComment = await Comment.findById(comment._id).populate('userId', 'name avatar');

    const socket = require('../socket');
    // Emit to project room
    socket.getIO().to(task.projectId.toString()).emit('comment_added', {
      taskId: task._id,
      comment: populatedComment
    });

    // Notify task creator and assignee
    const notifyUsers = new Set();
    if (task.createdBy.toString() !== req.user._id.toString()) notifyUsers.add(task.createdBy);
    if (task.assignee && task.assignee.toString() !== req.user._id.toString()) notifyUsers.add(task.assignee);

    for (const userId of notifyUsers) {
      const notification = await Notification.create({
        userId,
        type: 'comment_added',
        message: `${req.user.name} commented on task: ${task.title}`,
        relatedTask: task._id
      });
      socket.getIO().to(userId.toString()).emit('notification_received', notification);
    }

    // Log Activity
    const project = await Project.findById(task.projectId);
    const logActivity = require('../utils/activityLogger');
    await logActivity({
      workspaceId: project.workspaceId,
      projectId: project._id,
      taskId: task._id,
      userId: req.user._id,
      action: 'comment_added',
      details: `commented on "${task.title}"`
    });

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get comments for a task
// @route   GET /api/comments/:taskId
// @access  Private
const getTaskComments = async (req, res) => {
  try {
    const comments = await Comment.find({ taskId: req.params.taskId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addComment,
  getTaskComments
};
