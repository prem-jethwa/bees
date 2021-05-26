const dropAllDB = async (req, res) => {
  await Task.drop();
  await User.drop();
  await req.session.destroy();

  res.redirect('/login');
};

// expire my db every 1 hour
setInterval(dropAllDB, 1000 * 60 * 60);

module.exports = dropAllDB;
