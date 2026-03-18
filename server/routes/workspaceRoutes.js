const express = require('express');
const router = express.Router();
const {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  inviteToWorkspace
} = require('../controllers/workspaceController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', authorize('admin', 'project_manager'), createWorkspace);
router.get('/', getWorkspaces);
router.get('/:id', getWorkspaceById);
router.post('/:id/invite', authorize('admin', 'project_manager'), inviteToWorkspace);

module.exports = router;
