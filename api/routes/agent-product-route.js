"use strict";

var express = require("express");

//Route
var router = require("express").Router();
const agentProductService = require("../service/agentProductService");

router.use(function (req, res, next) {
  next();
});

router.route("/get").post(agentProductService.get);
router.route("/getByBarcode").post(agentProductService.getByBarcode);

router.route("/save").post(agentProductService.save);
router.route("/search").post(agentProductService.search);
router.route("/deleteProduct").post(agentProductService.deleteProduct);

module.exports = router;
