"use strict";

//Route
var router = require("express").Router();
const customerService = require("../service/customerService");

router.use(function (req, res, next) {
  next();
});

router.route("/getByMobile").post(customerService.getByMobile);

module.exports = router;
