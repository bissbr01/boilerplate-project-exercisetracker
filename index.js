const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const User = require("./models/user");
const { default: mongoose } = require("mongoose");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/users", async (req, res, next) => {
  try {
    const users = await User.find().exec();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

app.get("/api/users/:_id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params._id).exec();
    res.json(user);
  } catch (error) {
    next(error);
  }
});

app.get("/api/users/:_id/logs", async (req, res, next) => {
  try {
    const user = await User.findById(req.params._id);
    let log;
    if (req.query.to && req.query.from) {
      const start = new Date(req.query.from);
      const end = new Date(req.query.to);
      log = [...user.exercises].filter((exercise) => {
        return (
          exercise.date.getTime() >= start.getTime() &&
          exercise.date.getTime() <= end.getTime()
        );
      });
      if (req.query.limit) {
        log = log.slice(0, req.query.limit);
      }
    }
    console.log("log: ", log);
    log ? res.json(log) : res.json(user);
  } catch (error) {
    next(error);
  }
});

app.post("/api/users", async (req, res, next) => {
  try {
    const user = await User.create({ username: req.body.username });
    const result = await user.save();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.post("/api/users/:_id/exercises", async (req, res, next) => {
  try {
    const user = await User.findById(req.params._id).exec();
    if (user) {
      user.exercises.push({
        _id: new mongoose.Types.ObjectId(),
        description: req.body.description,
        duration: req.body.duration,
        date: req.body.date || new Date(),
      });
      const result = await user.save();
      res.json(result);
    }
  } catch (error) {
    next(error);
  }
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
