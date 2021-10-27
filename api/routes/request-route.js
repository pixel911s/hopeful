"use strict";

//Route
var router = require("express").Router();
const requestService = require("../service/requestService");

router.use(function (req, res, next) {
  next();
});

router.route("/search").post(requestService.search);
router.route("/approve").post(requestService.approve);
router.route("/get").post(requestService.get);

module.exports = router;
