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
  search,
  deleteNote,
};

async function deleteNote(req, res) {
  const conn = await pool.getConnection();
  try {
    let model = req.body;

    let note = await noteDao.get(conn, model.id);

    if (
      note.customerId != model.customerId ||
      note.createBy != model.username
    ) {
      return res.status(401).send("❌ ไม่สามารถลบข้อมูล Note ของคนอื่นได้.");
    }

    await noteDao.deleteNote(conn, model);

    return res.send(util.callbackSuccess("ลบข้อมูล Note เสร็จสมบูรณ์", true));
  } catch (e) {
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

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
  try {
    let model = req.body;

    await noteDao.save(conn, model);

    return res.send(
      util.callbackSuccess("บันทึกข้อมูล Note เสร็จสมบูรณ์", true)
    );
  } catch (e) {
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function search(req, res) {
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;

    //=== Criteria
    //=== customerId = รหัส Id ของลูกค้า
    //=== page : หน้าที่
    //=== size : จำนวนหน้าที่แสดง

    let result = null;

    let totalRecord = 0;
    criteria.isCount = true;

    let totalRecordObj = await noteDao.search(conn, criteria);
    if (totalRecordObj.length > 0) {
      totalRecord = totalRecordObj[0].qty;
    }

    let totalPage = Math.round(totalRecord / criteria.size);
    if (totalPage <= 0) {
      totalPage = 1;
    }

    criteria.isCount = false;

    if (totalRecord > 0) {
      result = await noteDao.search(conn, criteria);
    }

    return res.send(util.callbackPaging(result, totalPage, totalRecord));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}
