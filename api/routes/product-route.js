"use strict";

var express = require("express");

//Route
var router = require("express").Router();
const productService = require("../service/productService");

router.use(function (req, res, next) {
  next();
});

router.route("/get").post(productService.get);
router.route("/getByBarcode").post(productService.getByBarcode);

router.route("/save").post(productService.save);
router.route("/search").post(productService.search);
router.route("/deleteProduct").post(productService.deleteProduct);

module.exports = router;
