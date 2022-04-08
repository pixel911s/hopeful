"use strict";

var util = require("../utils/responseUtils");
("");
var customerDao = require("../dao/customerDao");

const config = require("config");
const mysql = require("promise-mysql");
const pool = mysql.createPool(config.mysql);

module.exports = {
  get,
  getByMobile,
  getAddress,
  updateProfile,
};

async function updateProfile(req, res) {
  const conn = await pool.getConnection();
  try {
    let model = req.body;

    let customer = await customerDao.get(conn, model.customerId);
    customer.email = model.email;
    customer.name = model.name;
    customer.mobile = model.mobile;

    await customerDao.save(conn, model);

    return res.send(
      util.callbackSuccess("บันทึกข้อมูล Note เสร็จสมบูรณ์", true)
    );
  } catch (e) {
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function get(req, res) {
  //=== Parameter
  //=== {id: 0}

  const conn = await pool.getConnection();
  try {
    let criteria = req.body;

    let result = await customerDao.get(conn, criteria.id);

    // let canAccess = false;

    // for (let index = 0; index < criteria.userAgents.length; index++) {
    //   const agent = criteria.userAgents[index];
    //   if (agent.id == result.ownerId) {
    //     canAccess = true;
    //   }
    // }

    // if (!canAccess) {
    //   return res.status(404).send("Can't access data");
    // }

    return res.send(util.callbackSuccess(null, result));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function getByMobile(req, res) {
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;

    let result = await customerDao.getByMobileNo(conn, criteria);

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

async function getAddress(req, res) {
  //=== Parameter
  //=== {customerId: 0}

  const conn = await pool.getConnection();
  try {
    let criteria = req.body;

    let result = await customerDao.getAddress(conn, criteria.customerId);

    return res.send(util.callbackSuccess(null, result));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}
