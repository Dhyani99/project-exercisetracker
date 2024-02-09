const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

let mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
});

const User = mongoose.model("User", userSchema);

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  let user = new User({ username: req.body.username });
  user.save();
  res.json({ username: user.username, _id: user._id });
});

app.get("/api/users", async(req, res) => {
  try{
    let result = await User.find()
    res.status(200).json(result);
  } catch (error){
    res.status(500).json(error);
  }

  //res.json({ username: user.username, _id: user._id });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
