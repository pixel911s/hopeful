"use strict";

var express = require("express");

//Route
var router = require("express").Router();
const productGroupService = require("../service/productGroupService");

router.use(function (req, res, next) {
  next();
});

router.route("/get").post(productGroupService.get);
router.route("/getProductGroups").post(productGroupService.getProductGroups);
router.route("/save").post(productGroupService.save);
router.route("/search").post(productGroupService.search);
router.route("/deleteProductGroup").post(productGroupService.deleteProductGroup);

module.exports = router;