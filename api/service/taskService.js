"use strict";

var util = require("../utils/responseUtils");
const fileUtil = require("../utils/fileUtil");
var taskDao = require("../dao/taskDao");

var activityDao = require("../dao/activityDao");

var crmHistoryDao = require("../dao/crmHistoryDao");

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
  getNotify,
  updateNotifyFlag,
  getAllTask,
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

    let _activity = await activityDao.get(conn, model.activityId);

    let history = {
      customerId: _activity.customerId,
      activityCode: "",
      action: "CREATE TASK",
      description: model.description,
      username: model.username,
    };

    await crmHistoryDao.create(conn, history);

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

    let task = await taskDao.get(conn, model.id);

    await taskDao.closeTask(conn, model.id, model.username);

    if (task.activityId) {
      let _activity = await activityDao.get(conn, task.activityId);

      let history = {
        customerId: _activity.customerId,
        activityCode: "",
        action: "CLOSE TASK",
        description: task.description,
        username: model.username,
      };

      await crmHistoryDao.create(conn, history);
    }

    conn.commit();

    return res.send(
      util.callbackSuccess("ทำการยกเลิก Task เสร็จสมบูรณ์", true)
    );
  } catch (e) {
    console.log(e);
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

    let task = await taskDao.get(conn, model.id);

    await taskDao.recallTask(conn, model.id, model.username);

    if (task.activityId) {
      let _activity = await activityDao.get(conn, task.activityId);

      let history = {
        customerId: _activity.customerId,
        activityCode: "",
        action: "REOPEN TASK",
        description: task.description,
        username: model.username,
      };

      await crmHistoryDao.create(conn, history);
    }

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

async function getAllTask(req, res) {
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;

    //==== Criteria
    //username = ใส่ค่าว่างหรือไม่ส่ง หากต้องการดูทั้งหมด , หากต้องการดูเฉพาะของตัวเอง ให้ส่ง username มา
    //taskStatus = O - Task ที่ยังไม่ปิด

    criteria.taskStatus = "O";

    let open = await taskDao.getTaskList(conn, criteria);

    criteria.taskStatus = "C";

    let close = await taskDao.getTaskList(conn, criteria);

    let result = {
      closeTasks: close,
      openTasks: open,
    };

    return res.send(util.callbackSuccess(null, result));
  } catch (e) {
    console.error(e);
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

async function getNotify() {
  const conn = await pool.getConnection();
  try {
    //=== ดึงข้อมูล Task ที่ถึงกำหนดการแจ้งเตือน เพื่อทำส่ง Line Notify

    return await taskDao.getNotify(conn);
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function updateNotifyFlag(taskId) {
  //=== ใช้ ปิด Line Notify
  //==== Parameter
  //==== taskId : id ของ Task
  const conn = await pool.getConnection();
  conn.beginTransaction();
  try {
    await taskDao.updateNotifyFlag(conn, taskId);

    conn.commit();

    return true;
  } catch (e) {
    conn.rollback();
    return false;
  } finally {
    conn.release();
  }
}
