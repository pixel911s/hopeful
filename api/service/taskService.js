"use strict";

var util = require("../utils/responseUtils");
const fileUtil = require("../utils/fileUtil");
var taskDao = require("../dao/taskDao");

const config = require("config");
const mysql = require("promise-mysql");
const pool = mysql.createPool(config.mysql);

module.exports = {
  get,
  save,
  closeTask,
  recallTask
};

async function get(req, res) {
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;

    let result = await taskDao.get(conn, criteria.id);
   
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
    
    await taskDao.save(conn, model);

    conn.commit();

    return res.send(
      util.callbackSuccess("บันทึกข้อมูล Task เสร็จสมบูรณ์", true)
    );
  } catch (e) {
    console.log(e);
    conn.rollback();
    if (e.code == "ER_DUP_ENTRY") {
      return res.status(401).send("มีข้อมูล Task นี้แล้วในระบบ");
    } else {
      return res.status(500).send(e.message);
    }
  } finally {
    conn.release();
  }
}

async function closeTask(req, res) {
  const conn = await pool.getConnection();
  conn.beginTransaction();
  try {
    let model = req.body;

    await taskDao.closeTask(conn, model.id, model.username)

    conn.commit();

    return res.send(
      util.callbackSuccess("ทำการยกเลิก Task เสร็จสมบูรณ์", true)
    );
  } catch (e) {
    conn.rollback();
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function recallTask(req, res) {
    const conn = await pool.getConnection();
    conn.beginTransaction();
    try {
      let model = req.body;
  
      await taskDao.recallTask(conn, model.id, model.username)
  
      conn.commit();
  
      return res.send(
        util.callbackSuccess("ทำการเรียกคืน Task เสร็จสมบูรณ์", true)
      );
    } catch (e) {
      conn.rollback();
      return res.status(500).send(e.message);
    } finally {
      conn.release();
    }
  }