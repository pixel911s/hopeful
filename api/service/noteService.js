"use strict";

var util = require("../utils/responseUtils");
const fileUtil = require("../utils/fileUtil");
var noteDao = require("../dao/noteDao");

const config = require("config");
const mysql = require("promise-mysql");
const pool = mysql.createPool(config.mysql);

module.exports = {
  get,
  save,
  getNoteList
};

async function get(req, res) {
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;

    let result = await noteDao.get(conn, criteria.id);

    return res.send(util.callbackSuccess(null, result));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function save(req, res) {
  const conn = await pool.getConnection();
  conn.beginTransaction();
  try {
    let model = JSON.parse(req.body.data);

    await noteDao.save(conn, model);

    conn.commit();

    return res.send(
      util.callbackSuccess("บันทึกข้อมูล Note เสร็จสมบูรณ์", true)
    );
  } catch (e) {
    console.log(e);
    conn.rollback();
    if (e.code == "ER_DUP_ENTRY") {
      return res.status(401).send("มีข้อมูล Note นี้แล้วในระบบ");
    } else {
      return res.status(500).send(e.message);
    }
  } finally {
    conn.release();
  }
}

async function getNoteList(req, res) {
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;

     //==== Criteria
    //customerId = รหัส Id ของลูกค้า

    let result = await noteDao.getNoteList(conn, criteria.customerId);

    return res.send(util.callbackSuccess(null, result));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

