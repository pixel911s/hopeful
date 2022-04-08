"use strict";

var util = require("../utils/responseUtils");
var agentDao = require("../dao/agentDao");

const config = require("config");
const mysql = require("promise-mysql");
const pool = mysql.createPool(config.mysql);

module.exports = {
  gets,
  search,
  save,
  get,
};

async function get(req, res) {
  const conn = await pool.getConnection();
  try {
    let result = await agentDao.getByCode(conn, req.body.code);

    return res.send(util.callbackSuccess(null, result));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function gets(req, res) {
  const conn = await pool.getConnection();
  try {
    let result = await agentDao.gets(conn);

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

    let totalRecord = await agentDao.count(conn, criteria);

    let totalPage = Math.round(totalRecord / criteria.size);
    if (totalPage <= 0) {
      totalPage = 1;
    }

    if (totalRecord > 0) {
      result = await agentDao.search(conn, criteria);
    }

    return res.send(util.callbackPaging(result, totalPage, totalRecord));
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
    let model = req.body;

    if (!model.id) {
      let agent = await agentDao.getByCode(conn, model.code);
      if (agent) {
        return res.status(401).send("❌ มีรหัสตัวแทนนี้แล้วในระบบ");
      }
    }

    await agentDao.save(conn, model);

    conn.commit();

    return res.send(util.callbackSuccess("บันทึกข้อมูลเสร็จสมบูรณ์", true));
  } catch (e) {
    conn.rollback();

    if (e.code == "ER_DUP_ENTRY") {
      return res.status(401).send("DUPLICATED KEYS");
    } else {
      return res.status(500).send(e.message);
    }
  } finally {
    conn.release();
  }
}
