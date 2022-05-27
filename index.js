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

app.get("/api/users/:_id/logs", async (req, res, next) => {
  try {
    const user = await User.findById(req.params._id)
      .where("exercises.date")
      .gte(req.query.from)
      .lte(req.query.to)
      .limit(req.query.limit)
      .exec();
    res.json(user);
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
        _id: new mongoose.Types.ObjectId(req.body._id),
        description: req.body.description,
        duration: req.body.duration,
        date: req.body.date,
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
