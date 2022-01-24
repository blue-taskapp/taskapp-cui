const { schedule, filterGCal } = require("task-manager");
const userHome = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
const path = require("path");
const fs = require("fs");

function TaskApp() {
  const now = new Date();
  const to = new Date();
  to.setDate(to.getDate() + 7);
  this.from = now;
  this.to = to;
  this.schedules = schedule(new Date(), to).filter(sch => {
    return now.getTime() < sch.date.getTime();
  });
  this.plans = [];
  this.applyGCal = async function(){ 
    this.schedules = await filterGCal(this.schedules);
  }
  this.load = function () {
    let store;
    try {
      store = JSON.parse(fs.readFileSync(path.join(userHome, ".bluetask.json"), "utf-8"));
    } catch(err) {
      console.error(err);
      return;
    }
    const now = new Date();
    this.schedules = store.schedules.filter(sch => {
      return (new Date(sch.date)).getTime() >= now.getTime();
    });
    this.plans = store.plans.filter(sch => {
      return (new Date(sch.schedule.date)).getTime() >= now.getTime();
    });
  }
  this.save = function () {
    const data = {
      schedules: this.schedules,
      plans: this.plans,
    }
    fs.writeFileSync(path.join(userHome, ".bluetask.json"), JSON.stringify(data));
  }
  this.addPlan = function (title, hours, canSplit) {
    if (canSplit) {
      for (let i = hours; i > 0; i--) {
        const sch = this.schedules.shift();
        this.plans.push({ 
          title,
          schedule: sch,
        });
      }
      return;
    }
  }
  this.checkPlan = function() {
    const now = new Date();
    for (const plan of this.plans) {
      const planTime = new Date(plan.schedule.date);
      if (planTime.getTime() - now.getTime() <= 1000 * 60 * 60) {
        console.log(plan.title);
        console.log(plan.schedule);
      }
    }
    this.plans = this.plans.filter(plan => {
      const planTime = new Date(plan.schedule.date);
      return (planTime.getTime() - now.getTime() > 1000 * 60 * 60);
    });
  }
  this.startTimer = function () {
    const that = this;
    this.timerID = setInterval(() => {
      that.checkPlan()
    }, 1000 * 60 * 60);
  }
}

module.exports = TaskApp;
