const Task = require('../model/task');

const validTask = async (req, res, next) => {
  try {
    const {id} = req.params;
    if (!id) throw new Error();

    const task = await Task.findOne({where: {id: +id}});
    if (!task) throw new Error();

    req.task = task;
    next();
  } catch (err) {
    res.status(400);
    console.log(err);
  }
};

module.exports = {
  validTask,
};
