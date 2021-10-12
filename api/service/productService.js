"use strict";

var util = require("../utils/responseUtils");
const fileUtil = require("../utils/fileUtil");
var productDao = require("../dao/productDao");

const config = require("config");
const mysql = require("promise-mysql");
const pool = mysql.createPool(config.mysql);

module.exports = {
  get,
  search,
  save,
  deleteProduct,
};

async function get(req, res) {
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;

    let result = await productDao.get(conn, criteria.id);
    result.agentPrices = await productDao.getAgentPrice(conn, criteria.id);

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
    let model = JSON.parse(req.body.data);
    let files = req.files;
    let inputFile = config.path.product_file_input;
    let outputFile = config.path.product_file_output;

    if (files) {
      let img = files["image"];

      if (img) {
        model.imageUrl = await fileUtil.uploadImg(
          inputFile,
          outputFile,
          model.code.trim(),
          img
        );
      }
    }

    let _productId = await productDao.save(conn, model);

    await productDao.deleteAgentPrice(conn, _productId);
    for (let index = 0; index < model.agentPrices.length; index++) {
      model.agentPrices[index].productId = _productId;
      model.agentPrices[index].createBy = model.updateUser;
      await productDao.addAgentPrice(conn, model.agentPrices[index]);
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
