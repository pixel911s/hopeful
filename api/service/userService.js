"use strict";

var util = require("../utils/responseUtils");
var encypt = require("../utils/encypt");
var userDao = require("../dao/userDao");

const config = require("config");
const mysql = require("promise-mysql");
const pool = mysql.createPool(config.mysql);

module.exports = {
  login,
  get,
  search,
  save,
  changePassword,
};

async function login(req, res) {
  const conn = await pool.getConnection();
  try {
    let username = req.body.username;
    let password = req.body.password;

    let data = await userDao.getById(conn, username);
    let result = false;

    if (data && data != null) {
      if (data.password && password == encypt.decrypt(data.password)) {
        result = true;
        let userFunction = await userDao.getUserFunction(conn, data.username);
        data.function = {};
        userFunction.forEach((uf) => {
          data.function[uf.functionCode] = true;
        });
      }
    }

    if (result == true) {
      data.password = undefined;
      return res.send(util.callbackSuccess(null, data));
    } else {
      return res.status(400).send("Username or Password is invalid.");
    }
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

    let result = await userDao.get(conn, criteria.username);

    let userFunction = await userDao.getUserFunction(conn, criteria.username);

    userFunction.forEach((f) => {
      if ("MANAGE_USER" == f.functionCode) {
        result.selectUser = true;
      }

      if ("MANAGE_TRANSACTION" == f.functionCode) {
        result.selectTransaction = true;
      }

      if ("UPDATE_TRANSACTION" == f.functionCode) {
        result.selectUpdateTransaction = true;
      }

      if ("CANCEL_TRANSACTION" == f.functionCode) {
        result.selectCancelTransaction = true;
      }

      if ("MANAGE_CUSTOMER" == f.functionCode) {
        result.selectCustomer = true;
      }

      if ("APPROVE_DISCOUNT" == f.functionCode) {
        result.selectRequestDiscount = true;
      }

      if ("VIEW_DEBTOR" == f.functionCode) {
        result.selectViewDebtor = true;
      }

      if ("VIEW_PAYMENT" == f.functionCode) {
        result.selectViewPayment = true;
      }

      if ("VIEW_DASHBOARD" == f.functionCode) {
        result.selectViewDashBoard = true;
      }

      if ("VIEW_ALLBRANCH" == f.functionCode) {
        result.selectViewAllBranch = true;
      }

      if ("PAYMENT" == f.functionCode) {
        result.selectPayment = true;
      }
    });

    result.id = result.username;
    result.password = undefined;

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

    let totalRecord = await userDao.count(conn, criteria);

    let totalPage = Math.round(totalRecord / criteria.size);
    if (totalPage <= 0) {
      totalPage = 1;
    }

    if (totalRecord > 0) {
      result = await userDao.search(conn, criteria);
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
      if (!model.password) {
        model.password = "1111";
      }

      model.password = encypt.encrypt(model.password);
    }

    await userDao.save(conn, model);
    await userDao.deleteUserFunction(conn, model.username);

    for (let index = 0; index < model.functions.length; index++) {
      await userDao.saveUserFunction(
        conn,
        model.username,
        model.functions[index]
      );
    }

    conn.commit();

    return res.send(
      util.callbackSuccess("บันทึกข้อมูลผู้ใช้งานเสร็จสมบูรณ์", true)
    );
  } catch (e) {
    conn.rollback();
    if (e.code == "ER_DUP_ENTRY") {
      return res.status(401).send("มีผู้ใช้งานชื่อนี้แล้วในระบบ");
    } else {
      return res.status(500).send(e.message);
    }
  } finally {
    conn.release();
  }
}

async function changePassword(req, res) {
  const conn = await pool.getConnection();
  conn.beginTransaction();
  try {
    let model = req.body;

    model.password = encypt.encrypt(model.password);

    await userDao.changePassword(conn, model);

    conn.commit();

    return res.send(
      util.callbackSuccess("บันทึกข้อมูลผู้ใช้งานเสร็จสมบูรณ์", true)
    );
  } catch (e) {
    conn.rollback();
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}
