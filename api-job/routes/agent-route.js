"use strict";

//Route
var router = require("express").Router();
const agentService = require("../service/agentService");

router.use(function (req, res, next) {
  next();
});

router.route("/gets").post(agentService.gets);
router.route("/search").post(agentService.search);
router.route("/save").post(agentService.save);
router.route("/get").post(agentService.get);

module.exports = router;
