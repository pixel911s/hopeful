'use strict';

var util = require('../utils/responseUtils');
var encypt = require('../utils/encypt');
var userDao = require("../dao/userDao");

const config = require('config')
const mysql = require('promise-mysql');
const pool = mysql.createPool(config.mysql);

var request = require('request');

module.exports = {
    notify
}

async function notify(token, message) {

    request({
        method: 'POST',
        uri: 'https://notify-api.line.me/api/notify',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        auth: {
            'bearer': token
        },
        form: {
            message: message
        }
    }, (err, httpResponse, body) => {
        if (err) {
            console.log(err);
        }
    });
}
