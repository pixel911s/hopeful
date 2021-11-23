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
  recallTask,
  getOpenTask,
  getCloseTask,
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
  try {
    let model = req.body;

    await taskDao.save(conn, model);

    return res.send(
      util.callbackSuccess("บันทึกข้อมูล Task เสร็จสมบูรณ์", true)
    );
  } catch (e) {
    console.log(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function closeTask(req, res) {
  //=== ใช้ ปิด Task ที่ทำไปแล้ว
  //==== Parameter
  //==== id : id ของ Task
  //==== username : username ผู้ทำรายการ
  const conn = await pool.getConnection();
  conn.beginTransaction();
  try {
    let model = req.body;

    await taskDao.closeTask(conn, model.id, model.username);

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
  //=== ใช้ Undo Task ที่ปิดแล้ว ให้กลับมา Open เหมือนเดิม
  //==== Parameter
  //==== id : id ของ Task
  //==== username : username ผู้ทำรายการ
  const conn = await pool.getConnection();
  conn.beginTransaction();
  try {
    let model = req.body;

    await taskDao.recallTask(conn, model.id, model.username);

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

async function getOpenTask(req, res) {
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;

    //==== Criteria
    //username = ใส่ค่าว่างหรือไม่ส่ง หากต้องการดูทั้งหมด , หากต้องการดูเฉพาะของตัวเอง ให้ส่ง username มา
    //taskStatus = O - Task ที่ยังไม่ปิด

    criteria.taskStatus = "O";

    let result = await taskDao.getTaskList(conn, criteria);

    return res.send(util.callbackSuccess(null, result));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function getCloseTask(req, res) {
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;

    //==== Criteria
    //username = ใส่ค่าว่างหรือไม่ส่ง หากต้องการดูทั้งหมด , หากต้องการดูเฉพาะของตัวเอง ให้ส่ง username มา
    //taskStatus = C - Task ที่ปิดแล้ว

    criteria.taskStatus = "C";

    let result = await taskDao.getTaskList(conn, criteria);

    return res.send(util.callbackSuccess(null, result));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}
