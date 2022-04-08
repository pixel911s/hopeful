"use strict";
var userService = require("./userService");
var util = require("../utils/responseUtils");
var requestDao = require("../dao/requestDao");
var userDao = require("../dao/userDao");
var runningDao = require("../dao/runingDao");

var lineService = require("./lineService");

const config = require("config");
const mysql = require("promise-mysql");
const pool = mysql.createPool(config.mysql);

module.exports = {
  search,
  approve,
  get,
};

async function get(req, res) {
  const conn = await pool.getConnection();
  try {
    let result = await requestDao.get(conn, req.body.id);

    if (result.createBy != req.body.username && req.body.businessType == "A") {
      return res.status(404).send("Can't access data");
    }

    result.data = JSON.parse(result.data);

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

    let totalRecord = await requestDao.count(conn, criteria);

    let totalPage = Math.round(totalRecord / criteria.size);
    if (totalPage <= 0) {
      totalPage = 1;
    }

    if (totalRecord > 0) {
      result = await requestDao.search(conn, criteria);
    }

    return res.send(util.callbackPaging(result, totalPage, totalRecord));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function approve(req, res) {
  const conn = await pool.getConnection();
  conn.beginTransaction();
  try {
    let model = req.body;

    let requestModel = await requestDao.get(conn, model.id);

    requestModel.reason = model.reason;
    requestModel.status = model.status;
    requestModel.username = model.username;
    requestModel.data = JSON.parse(requestModel.data);

    await requestDao.approve(conn, requestModel);

    let createUser = await userDao.get(conn, requestModel.createBy);

    if (createUser.lineNotifyToken) {
      if (requestModel.status == "REJECT") {
        await lineService.notify(
          createUser.lineNotifyToken,
          "คำขอหมายเลข " +
            requestModel.reqNo +
            " ของคุณถูกปฏิเสธ.\n" +
            "เหตุผล : " +
            requestModel.reason
        );
      } else {
        await lineService.notify(
          createUser.lineNotifyToken,
          "คำขอหมายเลข " + requestModel.reqNo + " ของคุณอนุมัติแล้ว."
        );
      }
    }

    if (
      requestModel.status == "APPROVE" &&
      (requestModel.requestType == "CREATE_USER" ||
        requestModel.requestType == "UPDATE_USER")
    ) {
      await userService.saveUserData(conn, requestModel.data);
    }

    conn.commit();

    return res.send(util.callbackSuccess("บันทึกข้อมูลเสร็จสมบูรณ์", true));
  } catch (e) {
    conn.rollback();

    console.log(e);

    if (e.code == "ER_DUP_ENTRY") {
      return res.status(401).send("DUPLICATED KEYS");
    } else {
      return res.status(500).send(e.message);
    }
  } finally {
    conn.release();
  }
}
