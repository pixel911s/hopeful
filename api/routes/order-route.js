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
router.route("/exportTemplate").post(orderService.exportTemplate);
router
  .route("/exportOrderStatusTemplate")
  .post(orderService.exportOrderStatusTemplate);
router.route("/exportKerry").post(orderService.exportKerry);
router.route("/exportKA").post(orderService.exportFlashTransaction);
router.route("/exportJT").post(orderService.exportJTTransaction);
router.route("/exportOrder").post(orderService.exportOrder);
router.route("/deleteByUpload").post(orderService.deleteByUpload);
router.route("/searchUpload").post(orderService.searchUpload);

router.route("/updateStatus").post(orderService.updateStatus);

module.exports = router;
