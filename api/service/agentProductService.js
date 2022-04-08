"use strict";

var util = require("../utils/responseUtils");
const fileUtil = require("../utils/fileUtil");
var productDao = require("../dao/agentProductDao");

const config = require("config");
const mysql = require("promise-mysql");
const pool = mysql.createPool(config.mysql);

module.exports = {
  get,
  search,
  save,
  deleteProduct,
  getByBarcode,
};

async function getByBarcode(req, res) {
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;

    let result = await productDao.getByBarcode(conn, criteria.barcode);

    return res.send(util.callbackSuccess(null, result));
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

    let result = await productDao.get(conn, criteria.agentId, criteria.id);
    result.agentPrices = await productDao.getAgentPrice(conn, criteria.id);

    // for (let index = 0; index < result.itemInSet.length; index++) {
    //   const element = result.itemInSet[index];

    //   let _prod = await productDao.get(conn, element.itemId);
    //   element.product = _prod;
    // }

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

    let totalRecord = await productDao.count(conn, criteria);

    let totalPage = Math.round(totalRecord / criteria.size);
    if (totalPage <= 0) {
      totalPage = 1;
    }

    if (totalRecord > 0) {
      result = await productDao.search(conn, criteria);
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

    let data = await productDao.getAgentProduct(conn, model.agentId, model.id);

    if (!data) {
      data = {
        productId: model.id,
        agentId: model.agentId,
      };
    }

    data.balance = model.balance;
    data.remainingDay = model.remainingDay;

    await productDao.save(conn, data);

    conn.commit();

    return res.send(
      util.callbackSuccess("บันทึกข้อมูลสินค้าเสร็จสมบูรณ์", true)
    );
  } catch (e) {
    console.log(e);
    conn.rollback();
    if (e.code == "ER_DUP_ENTRY") {
      return res.status(401).send("มีข้อมูลสินค้านี้แล้วในระบบ");
    } else {
      return res.status(500).send(e.message);
    }
  } finally {
    conn.release();
  }
}

async function deleteProduct(req, res) {
  const conn = await pool.getConnection();
  conn.beginTransaction();
  try {
    let model = req.body;

    await productDao.deleteAgentPrice(conn, model.id);
    await productDao.deleteProduct(conn, model.id);

    conn.commit();

    return res.send(
      util.callbackSuccess("ทำการลบข้อมูลสินค้าเสร็จสมบูรณ์", true)
    );
  } catch (e) {
    conn.rollback();
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}
