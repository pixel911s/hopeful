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
router
  .route("/updateActivityStatus")
  .post(activityService.updateActivityStatus);
router
  .route("/getSummaryActivityCount")
  .post(activityService.getSummaryActivityCount);
router.route("/searchList").post(activityService.searchList);
router.route("/assignActivityOwner").post(activityService.assignActivityOwner);
router.route("/searchHistories").post(activityService.searchHistories);
router.route("/updateEndOfDose").post(activityService.updateEndOfDose);

router.route("/cancelActivityOwner").post(activityService.cancelActivityOwner);

module.exports = router;
