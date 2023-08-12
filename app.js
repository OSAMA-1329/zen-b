// required config

require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { URL } = require("./utils/config");

// getting all routers

const loginRouter = require("./Controllers/loginRoutes");
const studentRouter = require("./Controllers/studentRoutes");
const taskRouter = require("./Controllers/taskRoutes");
const leaveRouter = require("./Controllers/leaveRoutes");
const portfolioRouter = require("./Controllers/portfolioRoutes");
const capstoneRouter = require("./Controllers/capstoneRoutes");
const webcodeRouter = require("./Controllers/webcodeRoutes");

app.use(express.json());
app.use(cors());

mongoose.set("strictQuery", false);

mongoose
  .connect(URL)
  .then(() => {
    console.log("connected to Mongo DB");
  })
  .catch((err) => {
    console.error(err);
  });

app.get("/", (req, res) => {
  res.send("Welcome to Zen-Dashboard");
});

app.use(studentRouter);
app.use(taskRouter);
app.use(loginRouter);
app.use(leaveRouter);
app.use(portfolioRouter);
app.use(capstoneRouter);
app.use(webcodeRouter);

module.exports = app;
