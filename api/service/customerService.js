"use strict";

var util = require("../utils/responseUtils");
("");
var customerDao = require("../dao/customerDao");

const config = require("config");
const mysql = require("promise-mysql");
const pool = mysql.createPool(config.mysql);

module.exports = {
  getByMobile,
};

async function getByMobile(req, res) {
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;

    let result = await customerDao.getByMobileNo(conn, criteria.mobile);

    if (result) {
      result.addresses = await customerDao.getAddress(conn, result.id);
    }

    return res.send(util.callbackSuccess(null, result));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}
