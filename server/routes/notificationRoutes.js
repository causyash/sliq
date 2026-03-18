const express = require('express');
const router = express.Router();
const { 
  getNotifications, 
  getUnreadNotifications, 
  markAsRead 
} = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/', getNotifications);
router.get('/unread', getUnreadNotifications);
router.put('/:id/read', markAsRead);

module.exports = router;
