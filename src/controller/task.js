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

module.exports = {
  homeRouter,
};
