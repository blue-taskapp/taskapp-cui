const TaskApp = require(".");

const express = require("express");
const app = express();

const taskApp = new TaskApp();
taskApp.load();

app.get("/add/:title/:hours", (req, res) => {
  const title = req.params.title;
  const hours = parseInt(req.params.hours);
  taskApp.addPlan(title, hours, true);
  taskApp.save();
});

taskApp.startTimer();
app.listen(3001);

