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
router.route("/removeAddress").post(customerService.removeAddress);

router.route("/createAddress").post(customerService.createAddress);
router.route("/updateAddress").post(customerService.updateAddress);

module.exports = router;
