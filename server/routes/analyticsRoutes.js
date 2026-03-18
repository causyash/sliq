const express = require('express');
const router = express.Router();
const { getWorkspaceAnalytics, getGlobalAnalytics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/workspace/:workspaceId', protect, getWorkspaceAnalytics);
router.get('/global', protect, authorize('admin'), getGlobalAnalytics);

module.exports = router;
