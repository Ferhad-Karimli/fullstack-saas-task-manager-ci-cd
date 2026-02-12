const express = require('express');
const router = express.Router();
const tasksController = require('../../controllers/tasks/task');    
const { requireAuth } = require('../../middlewares/requireAuth');

router.use(requireAuth)


router.get('/', tasksController.listTasks);

router.post('/', tasksController.createTask);

router.get('/:id', tasksController.getTaskById);

router.patch('/:id', tasksController.updateTask);

router.delete('/:id', tasksController.deleteTask);

module.exports = router