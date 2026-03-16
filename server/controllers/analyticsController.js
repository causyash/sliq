const Project = require('../models/Project');
const Task = require('../models/Task');
const Workspace = require('../models/Workspace');

// @desc    Get analytics for a workspace
// @route   GET /api/analytics/workspace/:workspaceId
// @access  Private
const getWorkspaceAnalytics = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // Verify workspace exists and user is member
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    if (!workspace.members.some(m => m.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const projects = await Project.find({ workspaceId });
    const tasks = await Task.find({ projectId: { $in: projects.map(p => p._id) } });

    const totalProjects = projects.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const pendingTasks = tasks.filter(t => t.status !== 'done').length;
    
    // Overdue tasks (due date < now and status !== done)
    const now = new Date();
    const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'done').length;

    // Distribution by Status
    const statusDistribution = {
      todo: tasks.filter(t => t.status === 'todo').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      review: tasks.filter(t => t.status === 'review').length,
      done: tasks.filter(t => t.status === 'done').length,
    };

    // Distribution by Priority
    const priorityBreakdown = {
      low: tasks.filter(t => t.priority === 'low').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      high: tasks.filter(t => t.priority === 'high').length,
      urgent: tasks.filter(t => t.priority === 'urgent').length,
    };

    res.json({
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      statusDistribution,
      priorityBreakdown
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get global analytics for Admins
// @route   GET /api/analytics/global
// @access  Private/Admin
const getGlobalAnalytics = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only' });
    }

    const projects = await Project.find({});
    const tasks = await Task.find({});
    const workspaces = await Workspace.find({});
    const User = require('../models/User');
    const users = await User.find({});

    const totalProjects = projects.length;
    const totalTasks = tasks.length;
    const totalUsers = users.length;
    const totalWorkspaces = workspaces.length;
    
    // Status distribution
    const statusDistribution = {
      todo: tasks.filter(t => t.status === 'todo').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      review: tasks.filter(t => t.status === 'review').length,
      done: tasks.filter(t => t.status === 'done').length,
    };

    // Priority breakdown
    const priorityBreakdown = {
      low: tasks.filter(t => t.priority === 'low').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      high: tasks.filter(t => t.priority === 'high').length,
      urgent: tasks.filter(t => t.priority === 'urgent').length,
    };

    // calculate completion percentage per project for some average progress
    const projectProgress = projects.map(p => {
        const projectTasks = tasks.filter(t => t.projectId.toString() === p._id.toString());
        if (projectTasks.length === 0) return 0;
        const done = projectTasks.filter(t => t.status === 'done').length;
        return (done / projectTasks.length) * 100;
    });

    const averageProgress = projectProgress.length > 0 
        ? (projectProgress.reduce((a, b) => a + b, 0) / projectProgress.length).toFixed(1)
        : 0;

    res.json({
      totalProjects,
      totalWorkspaces,
      totalTasks,
      totalUsers,
      statusDistribution,
      priorityBreakdown,
      averageProgress,
      activeProjectsCount: projects.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWorkspaceAnalytics,
  getGlobalAnalytics
};
