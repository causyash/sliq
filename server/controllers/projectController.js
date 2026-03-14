const Project = require('../models/Project');
const Workspace = require('../models/Workspace');

// @desc    Create project inside a workspace
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const { name, description, workspaceId } = req.body;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Check if user is member of workspace
    if (!workspace.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to create project in this workspace' });
    }

    // Only Admin or Project Manager can create projects
    if (req.user.role !== 'admin' && req.user.role !== 'project_manager') {
      return res.status(403).json({ message: 'Only Admin or Project Manager can create projects' });
    }

    const project = await Project.create({
      name,
      description,
      workspaceId,
      members: [req.user._id],
      createdBy: req.user._id
    });

    // Log Activity
    const logActivity = require('../utils/activityLogger');
    await logActivity({
      workspaceId,
      projectId: project._id,
      userId: req.user._id,
      action: 'project_created',
      details: `created project "${project.name}"`
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all projects for a workspace
// @route   GET /api/projects/workspace/:workspaceId
// @access  Private
const getProjectsByWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Check if user is member
    if (!workspace.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to access this workspace' });
    }

    const projects = await Project.find({ workspaceId: req.params.workspaceId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single project details
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('workspaceId', 'name')
      .populate('members', 'name email avatar')
      .populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is member of the parent workspace
    const workspace = await Workspace.findById(project.workspaceId);
    if (!workspace.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check permission (Creator, Admin, or PM)
    if (
      project.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin' &&
      req.user.role !== 'project_manager'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    project.name = name || project.name;
    project.description = description || project.description;
    project.members = members || project.members;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only Admin or Project Manager can delete projects
    if (req.user.role !== 'admin' && req.user.role !== 'project_manager') {
      return res.status(403).json({ message: 'Only Admin or Project Manager can delete projects' });
    }

    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjectsByWorkspace,
  getProjectById,
  updateProject,
  deleteProject
};
