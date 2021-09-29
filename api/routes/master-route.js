"use strict";

var express = require("express");

//Route
var router = require("express").Router();
const masterService = require("../service/masterService");

router.use(function (req, res, next) {
  next();
});

router.route("/getProvinces").post(masterService.getProvinces);
router.route("/getDistricts").post(masterService.getDistricts);
router.route("/getSubDistricts").post(masterService.getSubDistricts);
router.route("/getBranchs").post(masterService.getBranchs);

module.exports = router;
