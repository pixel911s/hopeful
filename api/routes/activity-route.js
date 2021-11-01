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
router.route("/getActivityCountByOwner").post(activityService.getActivityCountByOwner);
router.route("/getOverDueList").post(activityService.getOverDueList);
router.route("/getIncomingList").post(activityService.getIncomingList);
router.route("/getCustomIncomingList").post(activityService.getCustomIncomingList);

module.exports = router;