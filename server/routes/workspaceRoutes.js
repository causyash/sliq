const express = require('express');
const router = express.Router();
const {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  inviteToWorkspace
} = require('../controllers/workspaceController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', createWorkspace);
router.get('/', getWorkspaces);
router.get('/:id', getWorkspaceById);
router.post('/:id/invite', inviteToWorkspace);

module.exports = router;
