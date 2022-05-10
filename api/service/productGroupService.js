"use strict";

var util = require("../utils/responseUtils");
const fileUtil = require("../utils/fileUtil");
var productGroupDao = require("../dao/productGroupDao");

const config = require("config");
const mysql = require("promise-mysql");
const pool = mysql.createPool(config.mysql);

module.exports = {
  get,
  getProductGroups,
  search,
  save,
  deleteProductGroup,
};

async function get(req, res) {
  const conn = await pool.getConnection();
  try {
    const criteria = req.body;
    const result = await productGroupDao.get(conn, criteria.id);
    return res.send(util.callbackSuccess(null, result));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function getProductGroups(req, res) {
  const conn = await pool.getConnection();
  try {
    const result = await productGroupDao.getProductGroups(conn);
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
    const criteria = req.body;
    let result = null;

    let totalRecord = await productGroupDao.count(conn, criteria);

    let totalPage = Math.round(totalRecord / criteria.size);
    if (totalPage <= 0) {
      totalPage = 1;
    }

    if (totalRecord > 0) {
      result = await productGroupDao.search(conn, criteria);
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
    let model = JSON.parse(req.body.data);
    const _productGroupId = await productGroupDao.save(conn, model); // insert product group

    await productGroupDao.deleteProductGroupItem(conn, _productGroupId);

    // mapping product group item 
    if (model) {
      if (model.itemInSet && model.itemInSet.length > 0) {
        for (let i = 0; i < model.itemInSet.length; i++) {
          const productItem = model.itemInSet[i];
          if (productItem.id) {
            await productGroupDao.saveProductGroupItem(conn, productItem, _productGroupId);
          }
        }
      }
    }
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

async function deleteProductGroup(req, res) {
  const conn = await pool.getConnection();
  conn.beginTransaction();
  try {
    let model = req.body;

    // await productGroupDao.deleteAgentPrice(conn, model.id);
    await productGroupDao.deleteProductGroup(conn, model.id);

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