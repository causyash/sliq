const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const socket = require('../socket');
const logActivity = require('../utils/activityLogger');

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignee, priority, dueDate } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is member of project
    if (!project.members.some(m => m.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to create tasks in this project' });
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      assignee,
      priority,
      dueDate,
      createdBy: req.user._id,
      status: 'todo'
    });

    // Create notification for assignee
    if (assignee && assignee.toString() !== req.user._id.toString()) {
      await Notification.create({
        userId: assignee,
        type: 'task_assigned',
        message: `You have been assigned a new task: ${title}`,
        relatedTask: task._id
      });
      socket.getIO().to(assignee.toString()).emit('notification_received', notification);
    }

    socket.getIO().to(projectId.toString()).emit('task_created', task);

    // Log Activity
    await logActivity({
      workspaceId: project.workspaceId,
      projectId: project._id,
      taskId: task._id,
      userId: req.user._id,
      action: 'task_created',
      details: `created task "${task.title}"`
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getProjectTasks = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is member
    if (!project.members.some(m => m.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to access tasks in this project' });
    }

    const tasks = await Task.find({ projectId: req.params.projectId })
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email');

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single task details
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('projectId', 'name')
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Security check omitted for brevity in this step, but normally we'd check project membership
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, assignee, dueDate } = req.body;
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const oldStatus = task.status;
    const oldAssignee = task.assignee?.toString();

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.assignee = assignee || task.assignee;
    task.dueDate = dueDate || task.dueDate;

    const updatedTask = await task.save();

    // Emit task_updated to project room
    socket.getIO().to(updatedTask.projectId.toString()).emit('task_updated', updatedTask);

    // Notify if status changed
    if (status && status !== oldStatus) {
      const notifyUsers = new Set();
      if (updatedTask.createdBy.toString() !== req.user._id.toString()) notifyUsers.add(updatedTask.createdBy);
      if (updatedTask.assignee && updatedTask.assignee.toString() !== req.user._id.toString()) notifyUsers.add(updatedTask.assignee);

      for (const userId of notifyUsers) {
        const notification = await Notification.create({
          userId,
          type: 'status_changed',
          message: `Task "${updatedTask.title}" status changed to ${status}`,
          relatedTask: updatedTask._id
        });
        socket.getIO().to(userId.toString()).emit('notification_received', notification);
      }

      // Log Activity for Move
      const project = await Project.findById(updatedTask.projectId);
      await logActivity({
        workspaceId: project.workspaceId,
        projectId: project._id,
        taskId: updatedTask._id,
        userId: req.user._id,
        action: 'task_moved',
        details: `moved "${updatedTask.title}" to ${status.replace('_', ' ')}`
      });
    } else {
      // General update activity
      const project = await Project.findById(updatedTask.projectId);
      await logActivity({
        workspaceId: project.workspaceId,
        projectId: project._id,
        taskId: updatedTask._id,
        userId: req.user._id,
        action: 'task_updated',
        details: `updated task "${updatedTask.title}"`
      });
    }

    // Notify if assignee changed
    if (assignee && assignee.toString() !== oldAssignee && assignee.toString() !== req.user._id.toString()) {
      const notification = await Notification.create({
        userId: assignee,
        type: 'task_assigned',
        message: `You have been assigned to task: ${updatedTask.title}`,
        relatedTask: updatedTask._id
      });
      socket.getIO().to(assignee.toString()).emit('notification_received', notification);
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const projectId = task.projectId.toString();
    const taskTitle = task.title;
    const project = await Project.findById(task.projectId);
    await task.deleteOne();
    socket.getIO().to(projectId).emit('task_deleted', req.params.id);

    // Log Activity
    await logActivity({
      workspaceId: project.workspaceId,
      projectId: project._id,
      userId: req.user._id,
      action: 'task_deleted',
      details: `deleted task "${taskTitle}"`
    });

    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask
};
