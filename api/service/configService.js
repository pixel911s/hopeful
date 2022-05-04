"use strict";

var util = require("../utils/responseUtils");
var configDao = require("../dao/configDao");

const config = require("config");
const mysql = require("promise-mysql");
const pool = mysql.createPool(config.mysql);

module.exports = {
  getActivityDateConfigByUsername,
  saveActivityDateConfig,
  getActivityDateConfig,
  deleteActivityDateConfig,
};

async function deleteActivityDateConfig(req, res) {
  const conn = await pool.getConnection();
  try {
    await configDao.deleteActivityDateConfig(conn, req.body.id);

    return res.send(util.callbackSuccess(null, true));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function getActivityDateConfig(req, res) {
  const conn = await pool.getConnection();
  try {
    let result = await configDao.getActivityDateConfig(conn, req.body.id);

    return res.send(util.callbackSuccess(null, result));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function getActivityDateConfigByUsername(req, res) {
  const conn = await pool.getConnection();
  try {
    let result = await configDao.getActivityDateConfigByUsername(
      conn,
      req.body.username,
      req.body.type
    );

    return res.send(util.callbackSuccess(null, result));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function saveActivityDateConfig(req, res) {
  const conn = await pool.getConnection();
  try {
    let model = req.body;

    await configDao.saveActivityDateConfig(conn, model);

    return res.send(util.callbackSuccess("บันทึกข้อมูลเสร็จสมบูรณ์", true));
  } catch (e) {
    console.log(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}
