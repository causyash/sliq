const Workspace = require('../models/Workspace');
const User = require('../models/User');
const Project = require('../models/Project');

// @desc    Create a workspace
// @route   POST /api/workspaces
// @access  Private
const createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;

    const workspace = await Workspace.create({
      name,
      owner: req.user._id,
      members: [req.user._id]
    });

    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all workspaces for the logged-in user
// @route   GET /api/workspaces
// @access  Private
const getWorkspaces = async (req, res) => {
  try {
    let query = { members: req.user._id };
    
    // Admin gets to see everything
    if (req.user.role === 'admin') {
      query = {};
    }

    const workspaces = await Workspace.find(query)
      .populate('owner', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single workspace with its members and projects
// @route   GET /api/workspaces/:id
// @access  Private
const getWorkspaceById = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Check if user is member
    if (!workspace.members.some(member => member._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to access this workspace' });
    }

    const projects = await Project.find({ workspaceId: req.params.id });

    res.json({
      ...workspace._doc,
      projects
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Invite a user to the workspace
// @route   POST /api/workspaces/:id/invite
// @access  Private
const inviteToWorkspace = async (req, res) => {
  try {
    const { email } = req.body;
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Check if user is owner or admin (or project manager if needed)
    if (workspace.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only owner or admin can invite members' });
    }

    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (workspace.members.some(m => m.toString() === userToInvite._id.toString())) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    workspace.members.push(userToInvite._id);
    await workspace.save();

    // Log Activity
    const logActivity = require('../utils/activityLogger');
    await logActivity({
      workspaceId: workspace._id,
      userId: req.user._id,
      action: 'member_added',
      details: `invited ${userToInvite.name} to the workspace`
    });

    res.json({ message: 'User invited successfully', workspace });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  inviteToWorkspace
};
