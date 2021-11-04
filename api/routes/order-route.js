"use strict";

var express = require("express");

//Route
var router = require("express").Router();
const orderService = require("../service/orderService");

router.use(function (req, res, next) {
  next();
});

router.route("/get").post(orderService.get);
router.route("/create").post(orderService.create);
router.route("/update").post(orderService.update);
router.route("/search").post(orderService.search);
router.route("/deleteOrder").post(orderService.deleteOrder);
router.route("/upload").post(orderService.upload);

module.exports = router;
