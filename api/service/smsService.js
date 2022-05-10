"use strict";

var util = require("../utils/responseUtils");

var userDao = require("../dao/userDao");
var auditDao = require("../dao/auditDao");
var smsControlDao = require("../dao/smsControlDao");

const config = require("config");
const mysql = require("promise-mysql");
const pool = mysql.createPool(config.mysql);

var request = require("request");
const axios = require("axios");

module.exports = {
  sendSms,
  manualSms,
  search,
  smsCharts,
  getSMSCredit,
  searchSummaryAgent,
  getTotalDailySMS,
  getTotalMonthlySMS,
};

async function getSMSCredit(req, res) {
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;
    let result = null;

    result = await smsControlDao.get(conn);

    return res.send(util.callbackSuccess("", result.totalSms));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function smsCharts(req, res) {
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;
    let result = null;

    result = await auditDao.genChartsSms(conn, criteria);

    return res.send(util.callbackSuccess(null, result));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function search(req, res) {
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;
    let result = null;

    let totalRecord = await auditDao.countSms(conn, criteria);

    let totalPage = Math.round(totalRecord / criteria.size);
    if (totalPage <= 0) {
      totalPage = 1;
    }

    if (totalRecord > 0) {
      result = await auditDao.searchSms(conn, criteria);
    }

    return res.send(util.callbackPaging(result, totalPage, totalRecord));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function manualSms(req, res) {
  const conn = await pool.getConnection();
  try {
    conn.beginTransaction();

    let data = req.body;

    let totalSms = countMsg(data.message) * data.tels.length;

    let sms = await smsControlDao.get(conn);

    if (sms.totalSms < totalSms) {
      return res.status(401).send("จำนวนเครดิต SMS ไม่เพียงพอในการส่งข้อความ.");
    }

    var i,
      j,
      temparray,
      chunk = 100;

    for (i = 0, j = data.tels.length; i < j; i += chunk) {
      temparray = data.tels.slice(i, i + chunk);

      let mobileNo = "";

      for (let index = 0; index < temparray.length; index++) {
        const mobile = temparray[index].value;
        if (index > 0) {
          mobileNo += ",";
        }
        mobileNo += "66" + mobile.substring(1);
      }

      await sendSms(conn, mobileNo, "HOPEFUL", data.message, temparray.length, data.agentId, data.createBy);
    }

    conn.commit();

    return res.send(util.callbackSuccess(null, true));
  } catch (e) {
    conn.rollback();
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function sendSms(conn, mobile, senderId, message, length, agentId, createBy) {
  var propertiesObject = {
    user: config.smsGateway.username,
    password: config.smsGateway.password,
    msisdn: mobile,
    fl: 0,
    msg: message,
    sid: senderId,
    dc: 8,
  };

  let res = await axios.get(config.smsGateway.url, {
    params: propertiesObject,
  });
  // let res = {
  //     status: 200
  // }

  if (res.status == 200) {
    let totalUseSms = countMsg(message) * length;

    let audit = {
      sms: totalUseSms,
      mobile: "0" + mobile.substring(2),
      data: mobile,
      message: message,
      agentId,
      createBy
    };

    if (audit.mobile.length > 10) {
      audit.mobile = "multi";
    }

    await auditDao.createSms(conn, audit);

    await smsControlDao.used(conn, totalUseSms);
  }
}

function countMsg(text) {
  if (!text) {
    text = "";
  }

  let countTracking = (text.match(/#tracking/g) || []).length;
  let totalLength = text.length;

  if (countTracking > 0) {
    totalLength -= "#tracking".length;
    totalLength += 12;
  }

  let totalMsg = 1;

  if (totalLength > 70 && totalLength <= 133) {
    totalMsg = 2;
  } else if (totalLength > 133 && totalLength <= 200) {
    totalMsg = 3;
  } else if (totalLength > 200 && totalLength <= 268) {
    totalMsg = 4;
  } else if (totalLength > 268 && totalLength <= 335) {
    totalMsg = 5;
  } else if (totalLength > 335 && totalLength <= 402) {
    totalMsg = 6;
  } else if (totalLength > 402 && totalLength <= 469) {
    totalMsg = 7;
  } else if (totalLength > 469) {
    totalMsg = 8;
  }

  return totalMsg;
}

async function searchSummaryAgent(req, res) {
  let conn;
  try {
    conn = await pool.getConnection();
    let criteria = req.body;
    let result = null;

    let totalRecord = await auditDao.countSummaryByAgent(conn, criteria);

    let totalPage = Math.round(totalRecord / criteria.size);
    if (totalPage <= 0) {
      totalPage = 1;
    }

    if (totalRecord > 0) {
      result = await auditDao.getSummaryByAgent(conn, criteria);
    }

    return res.send(util.callbackPaging(result, totalPage, totalRecord));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function getTotalDailySMS(req, res) {
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;
    let result = null;

    result = await auditDao.getTotalDailySmsTrans(conn, criteria);
    let totalDaily = result.totalDaily ?? 0;

    return res.send(util.callbackSuccess("", totalDaily));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function getTotalMonthlySMS(req, res) {
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;
    let result = null;

    result = await auditDao.getTotalMonthlySmsTrans(conn, criteria);
    let totalMonthly = result.totalMonthly ?? 0;

    return res.send(util.callbackSuccess("", totalMonthly));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}