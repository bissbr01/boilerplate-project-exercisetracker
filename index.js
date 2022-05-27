const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const User = require("./models/user");

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("GET /api/users/:_id/logs?[from][&to][&limit]", async (req, res, next) => {
  try {
    const user = await User.findById(req.params._id)
      .where('exercises.date').gt(req.query.from).lt(req.query.to)
      .limit(req.query.limit)
      exec();
    res.json(user);
  } catch (error) {
    next(error);
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
