const express = require('express');
const router = express.Router();
const { signup, login, getMe, getUsers } = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('admin'), getUsers);

module.exports = router;
