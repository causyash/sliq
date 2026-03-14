const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjectsByWorkspace,
  getProjectById,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', authorize('admin', 'project_manager'), createProject);
router.get('/workspace/:workspaceId', getProjectsByWorkspace);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', authorize('admin', 'project_manager'), deleteProject);

module.exports = router;
