const express = require('express');
const router = express.Router();
const {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', authorize('admin', 'project_manager'), createTask);
router.get('/project/:projectId', getProjectTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', authorize('admin', 'project_manager'), deleteTask);

module.exports = router;
