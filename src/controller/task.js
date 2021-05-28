// const User = require('../model/user');
const Task = require('../model/task');

const {
  updateTotalTasks,
  getDetails,
  resetRenderId,
  updateCompleteTasks,
} = require('../helpers/task');

const homeRouter = async (req, res) => {
  try {
    const userId = req.session.userId;
    const tasks = await Task.findAll({where: {userId}});
    const details = await getDetails(userId);

    const tasksForSend = [];

    for (let task of tasks) {
      if (task.dataValues) {
        let newObj = task.dataValues;
        let desc = task.dataValues.desc.trim();
        let date = task.dataValues.date + '';
        if (!desc) newObj.desc = false;

        if (desc && desc.replace(/ /, '').length > 50) {
          newObj.descLength = true;
        } else {
          newObj.descLength = false;
        }

        if (date) {
          newObj.date = date.replace(/-/g, ' / ').split('/').reverse().join(' / ');
        }

        tasksForSend.push(newObj);
      }
    }

    res.render('index', {
      title: tasksForSend[0] ? 'All Your Tasks' : 'No Tasks Found',
      isAuth: req.session.isUserAuth,
      tasks: tasksForSend,
      details,
    });
  } catch (err) {
    // await dropAllDB(req, res);

    console.log(err);
  }
};

const createTaskTemplate = async (req, res) => {
  const details = await getDetails(req.session.userId);

  res.render('create-task', {
    title: 'Create Tasks',
    isAuth: req.session.isUserAuth,
    details,
  });
};

const createTask = async (req, res) => {
  try {
    const {title, desc, completeDate} = req.body;

    if (!title.trim()) throw new Error('Title cannot be empty!');

    const {userId} = req.session;

    const {renderId} = await getDetails(userId);

    await Task.create({
      title,
      desc,
      date: completeDate,
      userId,
      renderId: renderId + 1,
    });
    await updateTotalTasks(req.session.userId);
    res.redirect('/');
  } catch (err) {
    const details = await getDetails(req.session.userId);
    return res.status(400).render('create-task', {
      title: 'Create Tasks',
      isAuth: req.session.isUserAuth,
      details,
      errorMsg:
        err.toString() === "SequelizeDatabaseError: Data too long for column 'title' at row 1"
          ? 'Title must be Under 255 character!'
          : err.toString(),
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const {title, id} = req.task.dataValues;

    await Task.destroy({where: {id, title}});
    await updateCompleteTasks(req.session.userId);

    res.redirect('/');
  } catch (error) {
    res.status(400);
  }
};

const editTemplate = async (req, res) => {
  const {id, title, desc} = req.task.dataValues;
  const details = await getDetails(req.session.userId);

  res.render('edit-task', {
    title: 'Edit Tasks',
    task: {id, title, desc},
    isAuth: req.session.isUserAuth,
    details,
  });
};

const editTask = async (req, res) => {
  try {
    const {title, desc, completeDate} = req.body;

    if (!title.trim()) throw new Error('Title cannot be empty!');

    await req.task.update({
      title,
      desc,
      date: !completeDate.trim() ? req.task.dataValues.date : completeDate,
    });

    res.redirect('/');
  } catch (err) {
    const {id, title, desc} = req.task.dataValues;
    const details = await getDetails(req.session.userId);

    return res.status(400).render('edit-task', {
      title: 'Edit Tasks',
      task: {id, title, desc},
      isAuth: req.session.isUserAuth,
      details,
      errorMsg:
        err.toString() === "SequelizeDatabaseError: Data too long for column 'title' at row 1"
          ? 'Title must be Under 255 character!'
          : err.toString(),
    });
  }
};

const resetId = async (req, res) => {
  await resetRenderId(req.session.userId);
  await updateCompleteTasks(req.session.userId);

  res.redirect('/');
  res.send();
};

module.exports = {
  homeRouter,
  createTask,
  createTaskTemplate,
  deleteTask,
  editTemplate,
  editTask,
  resetId,
};
