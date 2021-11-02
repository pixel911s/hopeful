"use strict";

var express = require("express");

//Route
var router = require("express").Router();
const activityService = require("../service/activityService");

router.use(function (req, res, next) {
  next();
});

router.route("/get").post(activityService.get);
router.route("/save").post(activityService.save);
router.route("/updateActivityStatus").post(activityService.updateActivityStatus);
router.route("/getSummaryActivityCount").post(activityService.getSummaryActivityCount);
router.route("/searchList").post(activityService.searchList);

module.exports = router;