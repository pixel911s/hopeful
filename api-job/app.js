"use strict";

var lineService = require("./service/lineService");
var taskService = require("./service/taskService");

var express = require("express"),
  expressValidator = require("express-validator"),
  bodyParser = require("body-parser"),
  moment = require("moment-timezone"),
  config = require("config"),
  log = require("./utils/log")(module),
  fileUpload = require("express-fileupload");

Date.prototype.toJSON = function () {
  return moment(this).format();
};
// Date.prototype.toJSON = function () {
//     return moment(this).tz('Asia/Bangkok').format();
// }

var port = process.env.PORT || 3110;
var app = express();

app.use(fileUpload());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "100mb",
    extended: true,
    parameterLimit: 10000,
  })
);
app.use(expressValidator());
// app.use(express.static(__dirname));
app.use(express.static(config.path.dir));

app.use(function (req, res, next) {
  var origin = req.headers.origin;

  var allowIps = config.allow.ip;
  var allowOrigin = allowIps[0];

  if (origin != undefined) {
    for (var i = 0; i < allowIps.length; i++) {
      if (origin == allowIps[i]) {
        allowOrigin = origin;
      }
    }
  }

  res.header("Access-Control-Allow-Origin", allowOrigin); // restrict it to the required domain

  // Request methods you wish to allow
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Accept, token"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", false);
  // Pass to next layer of middleware
  next();
});

app.use("/api", require("./route"));

let server = app.listen(port, function () {
  // log.info(app.get('env'));
  // log.info("Starting server listening on port %d in %s mode", port, app.settings.env);

  console.log(
    "Starting server listening on port " +
      port +
      " in " +
      app.settings.env +
      " mode"
  );

  console.log("Start Schedule : Line Notify");

  var cron = require("node-cron");
  cron.schedule("* * * * *", function () {
    runNotify();
  });
});

app.get("/", function (req, res) {
  res.send("Hello Api!!");
});

async function runNotify() {
  let tasks = await taskService.getNotify();

  if (tasks.length > 0) {
    for (let index = 0; index < tasks.length; index++) {
      const element = tasks[index];

      let _msg =
        "\nActivity: " +
        element.activityCode +
        "\n" +
        element.description +
        "\nวันที่นัดหมาย : " +
        element.scheduleDate +
        " " +
        element.scheduleTime;

      lineService.notify(element.lineNotifyToken, _msg);

      taskService.updateNotifyFlag(element.taskId);
    }
  }
}
