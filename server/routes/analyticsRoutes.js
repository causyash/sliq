const express = require('express');
const router = express.Router();
const { getWorkspaceAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/workspace/:workspaceId', protect, getWorkspaceAnalytics);

module.exports = router;
