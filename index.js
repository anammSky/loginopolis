const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const { User } = require("./db");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res, next) => {
  try {
    res.send(
      "<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>"
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password
app.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username && !password) {
    res.sendStatus(400);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await User.create({ username, password: hashedPassword });
    res.status(200).send(`successfully created user ${username}`);
  } catch (error) {
    next(error);
  }
});

// POST /login
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB
app.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username && !password) {
    res.sendStatus(400);
  }

  try {
    const [user] = await User.findAll({ where: { username } });
    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      res.status(401).send("incorrect username or password");
    } else {
      res.status(200).send(`successfully logged in user ${username}`);
    }
  } catch (error) {
    next(error);
  }
});

// we export the app, not listening in here, so that we can run tests
module.exports = app;
