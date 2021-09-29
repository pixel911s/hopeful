"use strict";

var express = require("express");

//Route
var router = require("express").Router();
router.use("/user", require("./routes/user-route"));
router.use("/master", require("./routes/master-route"));

router.use(function (req, res, next) {
  next();
});

module.exports = router;
