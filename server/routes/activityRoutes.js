const express = require('express');
const router = express.Router();
const { getProjectActivity } = require('../controllers/activityController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/project/:projectId', protect, getProjectActivity);

module.exports = router;
