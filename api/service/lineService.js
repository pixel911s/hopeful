"use strict";

var util = require("../utils/responseUtils");
var encypt = require("../utils/encypt");
var userDao = require("../dao/userDao");

const config = require("config");
const mysql = require("promise-mysql");
const pool = mysql.createPool(config.mysql);

var request = require("request");

module.exports = {
  notify,
  sendImg,
};

async function sendImg(token, imageUrl) {
  request(
    {
      method: "POST",
      uri: "https://notify-api.line.me/api/notify",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      auth: {
        bearer: token,
      },
      form: {
        imageThumbnail: imageUrl,
        imageFullsize: imageUrl,
      },
    },
    (err, httpResponse, body) => {
      if (err) {
        console.log(err);
      }
    }
  );
}

async function notify(token, message) {
  request(
    {
      method: "POST",
      uri: "https://notify-api.line.me/api/notify",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        bearer: token,
      },
      form: {
        message: message,
      },
    },
    (err, httpResponse, body) => {
      if (err) {
        console.log(err);
      }
    }
  );
}
