"use strict";

var util = require("../utils/responseUtils");
const fileUtil = require("../utils/fileUtil");
var activityDao = require("../dao/activityDao");

const config = require("config");
const mysql = require("promise-mysql");
const pool = mysql.createPool(config.mysql);

module.exports = {
  get,
  save,
  updateActivityStatus,
  getActivityCountByOwner,
  getOnDueList,
  getOverDueList,
  getIncomingList,
  getCustomIncomingList
};

async function get(req, res) {
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;

    let result = await activityDao.get(conn, criteria.id);

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

    await activityDao.save(conn, model);

    conn.commit();

    return res.send(
      util.callbackSuccess("บันทึกข้อมูล Activity เสร็จสมบูรณ์", true)
    );
  } catch (e) {
    console.log(e);
    conn.rollback();
    if (e.code == "ER_DUP_ENTRY") {
      return res.status(401).send("มีข้อมูล Activity นี้แล้วในระบบ");
    } else {
      return res.status(500).send(e.message);
    }
  } finally {
    conn.release();
  }
}

async function updateActivityStatus(req, res) {
  //=== ใช้อัพเดท สถานะ ของ Activity
  //====สถานะ Activity============
  //=== 0 : รอดำเนินงาน
  //=== 1 : อยู่ระหว่างดำเนินงาน
  //=== 2 : เสนอราคา
  //=== 3 : ปิดการขาย
  //=== 4 : ยกเลิก
  //==============================
  //==== Parameter
  //==== id : id ของ Task
  //==== activityStatusId : สถานะของ Activity
  //==== username : username ผู้ทำรายการ
  const conn = await pool.getConnection();
  conn.beginTransaction();
  try {
    let model = req.body;

    await activityDao.updateActivityStatus(conn, model.id, model.activityStatusId, model.username)

    conn.commit();

    return res.send(
      util.callbackSuccess("ทำการอัพเดทข้อมูล Activity เสร็จสมบูรณ์", true)
    );
  } catch (e) {
    conn.rollback();
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function getActivityCountByOwner(req, res) {
  //=== ใช้สรุปจำนวน ของ Activiity ตามสถานะ : OnDue, OverDue, Incomming, CustomIncoming ตามผู้ใช้งาน
  //=== Parameter
  //==== username : username ของผู้ใช้งาน

  const conn = await pool.getConnection();
  try {
    let activityCount = { onDueQty: 0, overDueQty: 0, incomingQty: 0, customIncomingQty: 0 };

    let resultOnDue = await activityDao.getOnDueCount(conn, criteria.username);
    if (resultOnDue) {
      activityCount.onDueQty = resultOnDue.qty;
    }
    let resultOverDue = await activityDao.getOverDueCount(conn, criteria.username);
    if (resultOverDue) {
      activityCount.overDueQty = resultOverDue.qty;
    }
    let resultIncoming = await activityDao.getIncomingCount(conn, criteria.username);
    if (resultIncoming) {
      activityCount.incomingQty = resultIncoming.qty;
    }
    let resultCustomIncoming = await activityDao.getCustomIncomingCount(conn, criteria.username);
    if (resultCustomIncoming) {
      activityCount.customIncomingQty = resultCustomIncoming.qty;
    }

    return res.send(util.callbackSuccess(null, result));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function getOnDueList(req, res) {
  //=== ใช้ดึงรายการ Activiity ตามสถานะ : OnDue ตามผู้ใช้งาน
  //=== Parameter
  //==== username : username ของผู้ใช้งาน
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;

    let result = await activityDao.getOnDueList(conn, criteria.username);

    return res.send(util.callbackSuccess(null, result));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function getOverDueList(req, res) {
  //=== ใช้ดึงรายการ Activiity ตามสถานะ : OverDue ตามผู้ใช้งาน
  //=== Parameter
  //==== username : username ของผู้ใช้งาน
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;

    let result = await activityDao.getOverDueList(conn, criteria.username);

    return res.send(util.callbackSuccess(null, result));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function getIncomingList(req, res) {
  //=== ใช้ดึงรายการ Activiity ตามสถานะ : Incoming ตามผู้ใช้งาน
  //=== Parameter
  //==== username : username ของผู้ใช้งาน
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;

    let result = await activityDao.getIncomingList(conn, criteria.username);

    return res.send(util.callbackSuccess(null, result));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function getCustomIncomingList(req, res) {
  //=== ใช้ดึงรายการ Activiity ตามสถานะ : customIncoming ตามผู้ใช้งาน
  //=== Parameter
  //==== username : username ของผู้ใช้งาน
  //==== incomingDay : จำนวนวันที่ใกล้จะถึง  -> Current Date + incomingDay
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;

    let result = await activityDao.getCustomIncomingList(conn, criteria.username, criteria.incomingDay);

    return res.send(util.callbackSuccess(null, result));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}