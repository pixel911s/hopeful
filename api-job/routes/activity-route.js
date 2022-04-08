"use strict";

var express = require("express");

//Route
var router = require("express").Router();
const activityService = require("../service/activityService");

router.use(function (req, res, next) {
  next();
});

module.exports = router;
