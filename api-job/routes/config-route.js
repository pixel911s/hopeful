"use strict";

//Route
var router = require("express").Router();
const configService = require("../service/configService");

router.use(function (req, res, next) {
  next();
});

router.route("/activityDate/save").post(configService.saveActivityDateConfig);
router.route("/activityDate/get").post(configService.getActivityDateConfig);
router
  .route("/activityDate/gets")
  .post(configService.getActivityDateConfigByUsername);

router
  .route("/activityDate/delete")
  .post(configService.deleteActivityDateConfig);

module.exports = router;
