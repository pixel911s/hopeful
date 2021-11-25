"use strict";

//Route
var router = require("express").Router();
const customerService = require("../service/customerService");

router.use(function (req, res, next) {
  next();
});

router.route("/get").post(customerService.get);
router.route("/getByMobile").post(customerService.getByMobile);
router.route("/getAddress").post(customerService.getAddress);
router.route("/updateProfile").post(customerService.updateProfile);

module.exports = router;
