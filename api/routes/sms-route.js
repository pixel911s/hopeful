"use strict";

//Route
var router = require("express").Router();
const smsService = require("../service/smsService");

router.use(function (req, res, next) {
  next();
});

router.route("/manualSms").post(smsService.manualSms);
router.route("/smsCharts").post(smsService.smsCharts);
router.route("/searchSms").post(smsService.search);
router.route("/getSMSCredit").post(smsService.getSMSCredit);
router.route("/summaryAgent").post(smsService.searchSummaryAgent)

module.exports = router;
