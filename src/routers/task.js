const express = require('express');
const router = new express.Router();

const {redirectToLogin} = require('../middleware/auth');
const {validTask} = require('../middleware/task');

const {
  homeRouter,
  createTask,
  createTaskTemplate,
  deleteTask,
  editTemplate,
  editTask,
  resetId,
} = require('../controller/task');
// const {isUserExist} = require('../middleware/isUserExist');

router.get('/', redirectToLogin, homeRouter);

router.get('/create', redirectToLogin, createTaskTemplate);

router.post('/create', redirectToLogin, createTask);

// DELETING TASKS
router.delete('/remove/:id', redirectToLogin, validTask, deleteTask);

router.get('/edit/:id', redirectToLogin, validTask, editTemplate);

// update Task
router.post('/edit/:id', redirectToLogin, validTask, editTask);

router.get('/resetId', redirectToLogin, resetId);

module.exports = router;
