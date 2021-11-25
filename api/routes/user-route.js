"use strict";

var express = require("express");

//Route
var router = require("express").Router();
const userService = require("../service/userService");

router.use(function (req, res, next) {
  next();
});

router.route("/save").post(userService.save);
router.route("/search").post(userService.search);
router.route("/get").post(userService.get);
router.route("/login").post(userService.login);
router.route("/change-password").post(userService.changePassword);
router.route("/getUseragent").post(userService.getUseragent);

module.exports = router;
