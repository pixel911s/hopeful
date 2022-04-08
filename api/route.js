"use strict";

var express = require("express");

//Route
var router = require("express").Router();
router.use("/user", require("./routes/user-route"));
router.use("/agent", require("./routes/agent-route"));
router.use("/request", require("./routes/request-route"));
router.use("/master", require("./routes/master-route"));
router.use("/product", require("./routes/product-route"));
router.use("/agent-product", require("./routes/agent-product-route"));
router.use("/order", require("./routes/order-route"));
router.use("/customer", require("./routes/customer-route"));
router.use("/activity", require("./routes/activity-route"));
router.use("/task", require("./routes/task-route"));
router.use("/note", require("./routes/note-route"));
router.use("/config", require("./routes/config-route"));
router.use("/sms", require("./routes/sms-route"));

router.use(function (req, res, next) {
  next();
});

module.exports = router;
