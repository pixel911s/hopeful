"use strict";

var express = require("express");

//Route
var router = require("express").Router();
const taskService = require("../service/taskService");

router.use(function (req, res, next) {
  next();
});

router.route("/get").post(taskService.get);
router.route("/save").post(taskService.save);
router.route("/closeTask").post(taskService.closeTask);
router.route("/recallTask").post(taskService.recallTask);
router.route("/getOpenTask").post(taskService.getOpenTask);
router.route("/getCloseTask").post(taskService.getCloseTask);

module.exports = router;