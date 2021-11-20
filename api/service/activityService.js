"use strict";

var util = require("../utils/responseUtils");
const fileUtil = require("../utils/fileUtil");
var activityDao = require("../dao/activityDao");
var userDao = require("../dao/userDao");
var auditLogDao = require("../dao/auditLogDao");

const config = require("config");
const mysql = require("promise-mysql");
const pool = mysql.createPool(config.mysql);

module.exports = {
  get,
  save,
  updateActivityStatus,
  getSummaryActivityCount,
  searchList,
  assignActivityOwner
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

    await activityDao.updateActivityStatus(
      conn,
      model.id,
      model.activityStatusId,
      model.username
    );

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

async function getSummaryActivityCount(req, res) {
  //=== ใช้ดึงข้อมูลจำนวน ของ Activity
  //=== Parameter
  //==== username : username ของผู้ใช้งาน
  //==== customerId : Option

  const conn = await pool.getConnection();
  try {
    let criteria = req.body;

    let buttons = [];

    let userAgents = [];
    let userAgentObj = await userDao.getAgentObj(conn, criteria.username);
    for (let index = 0; index < userAgentObj.length; index++) {
      userAgents.push(userAgentObj[index].id);
    }

    if (criteria.businessId != null) {
      userAgents.push(criteria.businessId);
    }

    let isSupervisor = false;
    let userFunctions = await userDao.getUserFunction(conn, criteria.username);
    console.log("user Functions : ", userFunctions);

    for (let index = 0; index < userFunctions.length; index++) {
      if (userFunctions[index].functionCode == "SUPERVISOR") {
        isSupervisor = true;
      }
    }

    let button1 = {
      fillterType: 1,
      dayCondition: 0,
      display: "วันนี้",
      qty: 0,
    };

    criteria.fillterType = 1;
    criteria.dayCondition = 0;
    criteria.userAgents = userAgents;
    criteria.isSupervisor = isSupervisor;
    criteria.customerId = criteria.customerId;
    criteria.isCount = true;

    let resultOnDue = await activityDao.inquiry(conn, criteria);

    if (resultOnDue.length > 0) {
      button1.qty = resultOnDue[0].qty;
    }
    buttons.push(button1);

    let button2 = {
      fillterType: 2,
      dayCondition: 0,
      display: "เกินกำหนด",
      qty: 0,
    };

    criteria.fillterType = 2;

    let resultOverDue = await activityDao.inquiry(conn, criteria);
    if (resultOverDue.length > 0) {
      button2.qty = resultOverDue[0].qty;
    }
    buttons.push(button2);

    let button3 = {
      fillterType: 3,
      dayCondition: 0,
      display: "ยังไม่ถึงกำหนด",
      qty: 0,
    };

    criteria.fillterType = 3;

    let resultIncoming = await activityDao.inquiry(conn, criteria);
    if (resultIncoming.length > 0) {
      button3.qty = resultIncoming[0].qty;
    }
    buttons.push(button3);

    let activitDateConfigs = await activityDao.getActivityDateConfig(
      conn,
      criteria.username
    );
    if (activitDateConfigs.length > 0) {
      for (let index = 0; index < activitDateConfigs.length; index++) {
        let data = {
          fillterType: 4,
          dayCondition: activitDateConfigs[index].condition,
          display: activitDateConfigs[index].display,
          qty: 0,
        };

        criteria.fillterType = 4;
        criteria.dayCondition = activitDateConfigs[index].condition;

        let resultCustom = await activityDao.inquiry(conn, criteria);
        if (resultCustom.length > 0) {
          data.qty = resultCustom[0].qty;
        }
        buttons.push(data);
      }
    }

    return res.send(util.callbackSuccess(null, buttons));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function searchList(req, res) {
  //=== ใช้ดึงรายการ Activiity ตามเงื่อนไข
  //=== Parameter
  //==== username : username ของผู้ใช้งาน
  //==== fillterType : 1 = วันนี้ , 2 = เกินกำหนด , 3 = ล่วงหน้า , 4 : กำหนดเอง ต้องระบุจำนวนวันที่ Parameter dayCondition
  //==== dayCondition : จำนวนวัน ใส่ค่า +- ใช้คู่กับ FillterType = 4
  //==== customerId : Option
  //==== page : หน้าที่
  //==== size : จำนวนหน้าที่แสดง

  const conn = await pool.getConnection();
  try {
    let criteria = req.body;

    let result = null;

    let userAgents = [];
    let userAgentObj = await userDao.getAgentObj(conn, criteria.username);
    for (let index = 0; index < userAgentObj.length; index++) {
      userAgents.push(userAgentObj[index].id);
    }

    if (criteria.businessId != null) {
      userAgents.push(criteria.businessId);
    }

    let isSupervisor = false;
    let userFunctions = await userDao.getUserFunction(conn, criteria.username);

    for (let index = 0; index < userFunctions.length; index++) {
      if (userFunctions[index].functionCode == "SUPERVISOR") {
        isSupervisor = true;
      }
    }

    let totalRecord = 0;

    criteria.userAgents = userAgents;
    criteria.isSupervisor = isSupervisor;
    criteria.isCount = true;

    let totalRecordObj = await activityDao.inquiry(conn, criteria);
    if (totalRecordObj.length > 0) {
      totalRecord = totalRecordObj[0].qty;
    }

    console.log("TOTAL REC: ", totalRecordObj);

    let totalPage = Math.round(totalRecord / criteria.size);
    if (totalPage <= 0) {
      totalPage = 1;
    }

    criteria.isCount = false;

    if (totalRecord > 0) {
      result = await activityDao.inquiry(conn, criteria);
    }

    return res.send(util.callbackPaging(result, totalPage, totalRecord));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function assignActivityOwner(req, res) {
  //=== Assign Owner ของ Activity
  //==== Parameter
  //==== activityId   : เลขที่ Activity
  //==== ownerUser    : Owner to Assigned
  //==== username     : ผู้ทำรายการ

  const conn = await pool.getConnection();
  conn.beginTransaction();
  try {

    let model = req.body;
    console.log("AssignActivityOwnerModel: ", model);

    let _activity = await activityDao.get(conn, model.activityId);
    let _logDesc = "Assign Activity Owner : Activity Code-->" + _activity.code + " : Assigned to New Owner-->" + model.ownerUser;
    if (_activity.ownerUser && _activity!="") {
      _logDesc += " : Replace to Old Owner-->" + _activity.ownerUser;
    }

    let _auditLog ={
      logType: "ASSIGN_ACTIVITY_OWNER",
      logDesc: _logDesc,
      logBy: model.username,
      refTable: "activity",
      refId: _activity.id
    }   

    await activityDao.updateOwner(conn,model.activityId, model.ownerUser, model.username);

    await auditLogDao.save(conn, _auditLog);

    conn.commit();

    return res.send(
      util.callbackSuccess("บันทึกข้อมูล Owner Activity เสร็จสมบูรณ์", true)
    );
  } catch (e) {
    console.log(e);
    conn.rollback();
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}