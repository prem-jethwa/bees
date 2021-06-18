require("mysql2");
const express = require("express");
const hbs = require("hbs");
const path = require("path");
const app = express();

// SESSION
const session = require("express-session");
const MySqlStore = require("express-mysql-session")(session);
const cookieParser = require("cookie-parser");

// env var
const { DB_PASS, SESS_KEY, DB_NAME, DB_USER, DB_HOST, DB_PORT } = process.env;

// Database
const sequelize = require("./database/db");
const User = require("./model/user");
const Task = require("./model/task");

// Routers
const taskRouter = require("./routers/task");
const userRouter = require("./routers/user");

//Formetiong form Data of incoming req
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Expire database after 1h
setInterval(async () => {
  sequelize.sync({ force: true });
}, 1000 * 60 * 5);

const publicDirPath = path.join(__dirname, "../public");
const viewDirPath = path.join(__dirname, "../template");
const partialsDirPath = path.join(__dirname, "../partials");

hbs.registerPartials(partialsDirPath);

app.set("view engine", "hbs");
app.set("views", viewDirPath);

// SESSION config
app.use(cookieParser());
const store = new MySqlStore({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
});

const sess = session({
  secret: SESS_KEY,
  resave: false,
  saveUninitialized: false,
  store,
});

app.use(sess);

app.use(express.static(publicDirPath));

app.use("/edit/:id", express.static(publicDirPath));

// ROUTERS
app.use(taskRouter);
app.use(userRouter);

// DB relations
Task.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE",
});
User.hasMany(Task);

sequelize
  .sync({ force: true })
  // .sync()
  .then((result) => console.log("Connected to DATABASE"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT || 3000);
