"use strict";

var util = require("../utils/responseUtils");
var masterDao = require("../dao/masterDao");

const config = require("config");
const mysql = require("promise-mysql");
const pool = mysql.createPool(config.mysql);

module.exports = {
  getProvinces,
  getDistricts,
  getSubDistricts,
  getActivityStatus,

  searchZipcode,
};

async function searchZipcode(req, res) {
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;

    let result = await masterDao.searchZipCode(conn, criteria);

    return res.send(util.callbackSuccess(null, result));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function getActivityStatus(req, res) {
  const conn = await pool.getConnection();
  try {
    let result = await masterDao.getActivityStatus(conn);

    return res.send(util.callbackSuccess(null, result));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function getProvinces(req, res) {
  const conn = await pool.getConnection();
  try {
    let result = await masterDao.getProvinces(conn);

    return res.send(util.callbackSuccess(null, result));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function getDistricts(req, res) {
  const conn = await pool.getConnection();
  try {
    let result = await masterDao.getDistricts(conn, req.body.id);

    return res.send(util.callbackSuccess(null, result));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function getSubDistricts(req, res) {
  const conn = await pool.getConnection();
  try {
    let result = await masterDao.getSubDistricts(conn, req.body.id);

    return res.send(util.callbackSuccess(null, result));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}
