//Set up mongoose connection
require("dotenv").config();
const mongoose = require("mongoose");
const mongoURL = process.env.MONGO_URI;

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: String,
  exercises: [
    {
      _id: mongoose.ObjectId,
      description: String,
      duration: Number,
      date: Date,
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
