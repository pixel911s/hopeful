"use strict";

var util = require("../utils/responseUtils");
var dateUtil = require("../utils/dateUtil");
const fileUtil = require("../utils/fileUtil");
var activityDao = require("../dao/activityDao");
var taskDao = require("../dao/taskDao");
var userDao = require("../dao/userDao");
var agentDao = require("../dao/agentDao");
var customerDao = require("../dao/customerDao");
var auditLogDao = require("../dao/auditLogDao");
var crmHistoryDao = require("../dao/crmHistoryDao");
var configDao = require("../dao/configDao");

const config = require("config");
const mysql = require("promise-mysql");
const pool = mysql.createPool(config.mysql);

module.exports = {
  get,
  save,
  updateEndOfDose,
  updateActivityStatus,
  getSummaryActivityCount,
  searchList,
  assignActivityOwner,
  searchHistories,
};

async function searchHistories(req, res) {
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;
    let result = null;

    let totalRecord = await crmHistoryDao.count(conn, criteria);

    let totalPage = Math.round(totalRecord / criteria.size);
    if (totalPage <= 0) {
      totalPage = 1;
    }

    if (totalRecord > 0) {
      result = await crmHistoryDao.search(conn, criteria);
    }

    return res.send(util.callbackPaging(result, totalPage, totalRecord));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

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

async function updateEndOfDose(req, res) {
  const conn = await pool.getConnection();
  conn.beginTransaction();
  try {
    let model = req.body;

    await activityDao.updateEndOfDose(conn, model.id, model.endOfDose);

    let history = {
      customerId: model.customerId,
      activityCode: model.code,
      activityId: model.id,
      action: "UPDATE ACTIVITY",
      description:
        "เปลี่ยนวันที่ใช้สินค้าหมดเป็น " + dateUtil.getDateSql(model.endOfDose),
      username: model.username,
    };

    await crmHistoryDao.create(conn, history);

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

    let _activity = await activityDao.get(conn, model.id);

    if (_activity.activityOwner != model.username) {
      return res
        .status(401)
        .send("❌ ไม่สามารถดำเนินการได้ เนื่องจากไม่ใช่ผู้ดูแล");
    }

    let _date0 = _activity.statusDate0;
    let _date1 = _activity.statusDate1;
    let _date2 = _activity.statusDate2;
    let _date3 = _activity.statusDate3;
    let _date4 = _activity.statusDate4;

    if (model.activityStatusId == 0) {
      _date0 = new Date();
      _date1 = null;
      _date2 = null;
      _date3 = null;
      _date4 = null;
    } else {
      if (model.activityStatusId == 1) {
        _date1 = new Date();
        _date2 = null;
        _date3 = null;
        _date4 = null;
      } else {
        if (model.activityStatusId == 2) {
          _date2 = new Date();
          _date3 = null;
          _date4 = null;
        } else {
          if (model.activityStatusId == 3) {
            _date3 = new Date();
            _date4 = null;
          } else {
            _date4 = new Date();
          }
        }
      }
    }

    await activityDao.updateActivityStatus(
      conn,
      model.id,
      model.activityStatusId,
      model.username,
      _date0,
      _date1,
      _date2,
      _date3,
      _date4
    );

    if (model.activityStatusId == 4) {
      await taskDao.closeAllTask(conn, model.id, model.username);
    }

    let _logDesc =
      "Update Activity Status : Activity Code-->" +
      _activity.code +
      " : New Status-->" +
      model.activityStatusId +
      " : Old Status-->" +
      _activity.activityStatusId
        ? _activity.activityStatusId
        : 0;

    let _auditLog = {
      logType: "activity",
      logDesc: _logDesc,
      logBy: model.username,
      refTable: "activity",
      refId: model.id,
    };

    await auditLogDao.save(conn, _auditLog);

    let history = {
      customerId: _activity.customerId,
      activityCode: _activity.code,
      activityId: _activity.id,
      action: "CHANGE ACTIVITY STATUS",
      description: "เปลี่ยนสถานะเป็น " + getStatusText(model.activityStatusId),
      username: model.username,
    };

    await crmHistoryDao.create(conn, history);

    conn.commit();

    return res.send(
      util.callbackSuccess("ทำการอัพเดทข้อมูล Activity เสร็จสมบูรณ์", true)
    );
  } catch (e) {
    console.log(e);
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

    for (let index = 0; index < userFunctions.length; index++) {
      if (userFunctions[index].functionCode == "SUPERVISOR") {
        isSupervisor = true;
      }
    }

    // let button1 = {
    //   fillterType: 1,
    //   dayCondition: 0,
    //   display: "วันนี้",
    //   qty: 0,
    // };

    criteria.fillterType = 1;
    criteria.dayCondition = 0;
    criteria.userAgents = userAgents;
    criteria.isSupervisor = isSupervisor;
    criteria.customerId = criteria.customerId;
    criteria.isCount = true;

    // let resultOnDue = await activityDao.inquiry(conn, criteria);

    // if (resultOnDue.length > 0) {
    //   button1.qty = resultOnDue[0].qty;
    // }
    // buttons.push(button1);

    // let button2 = {
    //   fillterType: 2,
    //   dayCondition: 0,
    //   display: "เกินกำหนด",
    //   qty: 0,
    // };

    // criteria.fillterType = 2;

    // let resultOverDue = await activityDao.inquiry(conn, criteria);
    // if (resultOverDue.length > 0) {
    //   button2.qty = resultOverDue[0].qty;
    // }
    // buttons.push(button2);

    // let button3 = {
    //   fillterType: 3,
    //   dayCondition: 0,
    //   display: "ยังไม่ถึงกำหนด",
    //   qty: 0,
    // };

    // criteria.fillterType = 3;

    // let resultIncoming = await activityDao.inquiry(conn, criteria);
    // if (resultIncoming.length > 0) {
    //   button3.qty = resultIncoming[0].qty;
    // }
    // buttons.push(button3);

    // let activitDateConfigs = await activityDao.getActivityDateConfig(
    //   conn,
    //   criteria.username
    // );

    if (criteria.activityDates.length > 0) {
      for (let index = 0; index < criteria.activityDates.length; index++) {
        criteria.fillterType = criteria.activityDates[index].fillterType;
        criteria.dayCondition = criteria.activityDates[index].condition;

        let resultCustom = await activityDao.inquiry(conn, criteria);
        if (resultCustom.length > 0) {
          criteria.activityDates[index].qty = resultCustom[0].qty;
        }
      }
    }

    return res.send(util.callbackSuccess(null, criteria.activityDates));
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
  //==== customerId     : รหัสลูกค้า

  const conn = await pool.getConnection();
  conn.beginTransaction();
  try {
    let model = req.body;
    console.log("AssignActivityOwnerModel: ", model);

    // let _activity = await activityDao.get(conn, model.activityId);
    let customer = await customerDao.get(conn, model.customerId);

    let currentDate = new Date();

    if (customer.unlockDate && new Date(customer.unlockDate) > currentDate) {
      return res
        .status(401)
        .send(
          "ไม่สามารถแก้ไขข้อมูลได้ กรุณารอ 1 นาที และทำรายการใหม่อีกครั้ง."
        );
    }

    let agent = await agentDao.getById(conn, model.agentId);

    let _logDesc =
      "Assign Activity Owner : Customer ID-->" +
      model.customerId +
      " : Assigned to New Owner-->" +
      model.ownerUser;
    if (customer.activityOwner) {
      _logDesc += " : Replace to Old Owner-->" + customer.activityOwner;
    }

    let _auditLog = {
      logType: "customer_owner",
      logDesc: _logDesc,
      logBy: model.username,
      refTable: "business",
      refId: model.customerId,
    };

    await activityDao.updateOwner(
      conn,
      model.customerId,
      model.ownerUser,
      model.username
    );

    await activityDao.updateDueDate(
      conn,
      model.customerId,
      Number(agent.clearActivityDay)
    );

    await taskDao.closeAllTask(conn, model.activityId, model.username);

    let updateOwner = {
      id: model.customerId,
      activityOwner: model.ownerUser,
    };

    await customerDao.updateOwner(conn, updateOwner);

    let history = {
      customerId: model.customerId,
      activityCode: "",
      action: "CUSTOMER ASSIGN",
      description: model.username + "เข้าเป็นผู้ดูแลลูกค้า",
      username: model.username,
    };

    await crmHistoryDao.create(conn, history);

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

function getStatusText(id) {
  //=== 0 : รอดำเนินงาน
  //=== 1 : อยู่ระหว่างดำเนินงาน
  //=== 2 : เสนอราคา
  //=== 3 : ปิดการขาย
  //=== 4 : ยกเลิก

  if (id == 0) {
    return "รายชื่อ";
  }

  if (id == 1) {
    return "โทร";
  }

  if (id == 2) {
    return "คุย";
  }

  if (id == 3) {
    return "ปิดการขาย";
  }

  if (id == 4) {
    return "ยกเลิก";
  }

  return "";
}
