const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Project = require('../models/Project');
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

    // Extract @mentions
    const mentionRegex = /@(\w+)/g;
    const mentions = message.match(mentionRegex) || [];
    const mentionedNames = mentions.map(m => m.substring(1));
    
    const User = require('../models/User');
    const Workspace = require('../models/Workspace');
    const project = await Project.findById(task.projectId);
    const workspace = await Workspace.findById(project.workspaceId).populate('members', 'name _id');

    const mentionedUsers = workspace.members.filter(m => 
      mentionedNames.includes(m.name.replace(/\s+/g, '')) || 
      mentionedNames.includes(m.name.split(' ')[0])
    );
    // Emit to project room
    socket.getIO().to(task.projectId.toString()).emit('comment_added', {
      taskId: task._id,
      comment: populatedComment
    });

    // Notify task creator and assignee
    const notifyUsers = new Set();
    if (task.createdBy.toString() !== req.user._id.toString()) notifyUsers.add(task.createdBy.toString());
    if (task.assignee && task.assignee.toString() !== req.user._id.toString()) notifyUsers.add(task.assignee.toString());

    // Notify mentioned users
    for (const mUser of mentionedUsers) {
      if (mUser._id.toString() !== req.user._id.toString()) {
        notifyUsers.add(mUser._id.toString());
      }
    }

    for (const userId of notifyUsers) {
      const isMention = mentionedUsers.some(mu => mu._id.toString() === userId && !([task.createdBy.toString(), task.assignee?.toString()].includes(userId)));
      
      const notification = await Notification.create({
        userId,
        type: 'comment_added',
        message: isMention 
          ? `${req.user.name} mentioned you in a comment on: ${task.title}`
          : `${req.user.name} commented on task: ${task.title}`,
        relatedTask: task._id
      });
      socket.getIO().to(userId).emit('notification_received', notification);
    }

    // Log Activity
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
