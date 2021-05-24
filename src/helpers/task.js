const Task = require('../model/task');
const User = require('../model/user');

const _formatName = name => {
  const splitedName = name.split('');

  const firstWord = splitedName[0].toUpperCase();

  const formatName = firstWord + splitedName.slice(1).join('').toLowerCase();
  return formatName;
};

const _generatInfo = async userId => {
  const user = await User.findOne({where: {id: userId}});
  let {totalTask} = user.dataValues;

  const tasks = await Task.findAll({where: {userId}});

  const values = [];

  for (let task of tasks) {
    values.push(+task.dataValues.renderId);
  }

  let renderId = Math.max(...values);
  let activeTask = values.length;

  if (renderId === -Infinity) renderId = 0;
  if (!values.length) activeTask = 0;

  return {
    renderId,
    totalTask,
    activeTask,
    user,
  };
};

// call ones in create task
const updateTotalTasks = async userId => {
  const {totalTask, user} = await _generatInfo(userId);

  await user.update({
    totalTask: totalTask + 1,
  });
};

const updateCompleteTasks = async userId => {
  const {totalTask, activeTask, user} = await _generatInfo(userId);
  const complitedTask = totalTask - activeTask < 0 ? 0 : totalTask - activeTask;

  await user.update({
    complitedTask,
  });
};

const getDetails = async userId => {
  const {activeTask, user, renderId} = await _generatInfo(userId);
  const {totalTask, complitedTask, name} = user.dataValues;
  const formatedName = _formatName(name);

  return {
    totalTask,
    complitedTask,
    name: formatedName,
    activeTask,
    renderId,
  };
};

const resetRenderId = async userId => {
  const tasks = await Task.findAll({where: {userId}});

  let num = 1;

  for (let task of tasks) {
    task.update({
      renderId: num,
    });

    num++;
  }
};

module.exports = {_generatInfo, updateTotalTasks, updateCompleteTasks, getDetails, resetRenderId};
