const express = require('express');
const router = express.Router();
const { addComment, getTaskComments } = require('../controllers/commentController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', addComment);
router.get('/:taskId', getTaskComments);

module.exports = router;
