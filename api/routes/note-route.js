"use strict";

var express = require("express");

//Route
var router = require("express").Router();
const noteService = require("../service/noteService");

router.use(function (req, res, next) {
  next();
});

router.route("/get").post(noteService.get);
router.route("/save").post(noteService.save);
router.route("/getNoteList").post(noteService.getNoteList);

module.exports = router;