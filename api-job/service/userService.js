"use strict";

var util = require("../utils/responseUtils");
var encypt = require("../utils/encypt");
var userDao = require("../dao/userDao");
var requestService = require("./requestServiceProcessor");

const config = require("config");
const mysql = require("promise-mysql");
const pool = mysql.createPool(config.mysql);

module.exports = {
  login,
  get,
  search,
  save,
  changePassword,
  saveAgents,

  saveUserData,
  getUseragent,

  getAgentsByUser,
  getAllUsername,
};

async function getAllUsername(req, res) {
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;

    let result = await userDao.getUseragent(conn, criteria.agentId);

    return res.send(util.callbackSuccess("", result));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function getAgentsByUser(req, res) {
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;

    let result = await userDao.getAgentObj(conn, criteria.username);

    return res.send(util.callbackSuccess("", result));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function getUseragent(req, res) {
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;

    let result = await userDao.getUseragent(conn, criteria.id);

    return res.send(util.callbackSuccess("", result));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function login(req, res) {
  const conn = await pool.getConnection();
  try {
    let username = req.body.username;
    let password = req.body.password;

    let data = await userDao.get(conn, username);
    let result = false;

    if (data && data != null) {
      if (data.password && password == encypt.decrypt(data.password)) {
        result = true;
        data.business = await userDao.getBusinessById(conn, data.businessId);
        let userFunction = await userDao.getUserFunction(conn, data.username);
        data.function = {};
        userFunction.forEach((uf) => {
          data.function[uf.functionCode] = true;
        });
        data.userAgents = await userDao.getAgentObj(conn, username);
      }
    }

    if (result == true) {
      if (encypt.decrypt(data.password) == "1111") {
        data.status = 9;
      }
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

    let canAccess = false;

    for (let index = 0; index < criteria.userAgents.length; index++) {
      const agent = criteria.userAgents[index];
      if (agent.id == result.businessId) {
        canAccess = true;
        break;
      }
    }

    if (!canAccess) {
      return res.status(404).send("Can't access data");
    }

    result.business = await userDao.getBusinessById(conn, result.businessId);

    result.businessType = result.business.businessType;

    let userFunction = await userDao.getUserFunction(conn, criteria.username);

    result.userAgents = await userDao.getAgentObj(conn, criteria.username);

    userFunction.forEach((f) => {
      if ("CREATE_AGENT" == f.functionCode) {
        result.selectCreateAgent = true;
      }

      if ("VIEW_AGENT" == f.functionCode) {
        result.selectViewAgent = true;
      }

      if ("CREATE_CUSTOMER" == f.functionCode) {
        result.selectCreateCustomer = true;
      }

      if ("VIEW_CUSTOMER" == f.functionCode) {
        result.selectViewCustomer = true;
      }

      if ("CREATE_ORDER" == f.functionCode) {
        result.selectCreateOrder = true;
      }

      if ("VIEW_ORDER" == f.functionCode) {
        result.selectViewOrder = true;
      }

      if ("CREATE_PRODUCT" == f.functionCode) {
        result.selectCreateProduct = true;
      }

      if ("VIEW_PRODUCT" == f.functionCode) {
        result.selectViewProduct = true;
      }

      if ("CREATE_USER" == f.functionCode) {
        result.selectCreateUser = true;
      }

      if ("VIEW_USER" == f.functionCode) {
        result.selectViewUser = true;
      }

      if ("CRM" == f.functionCode) {
        result.selectCRM = true;
      }

      if ("SUPERVISOR" == f.functionCode) {
        result.supervisor = true;
      }

      if ("SENDSMS" == f.functionCode) {
        result.selectSendSMS = true;
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

    model.username = model.username.toLowerCase();

    let successageMsg = "???????????????????????????????????????????????????????????????????????????????????????????????????";

    let updateUser = await userDao.get(conn, model.updateUser);
    updateUser.business = await userDao.getBusinessById(
      conn,
      updateUser.businessId
    );

    if (updateUser.business.businessType != "H") {
      await requestService.create(
        conn,
        model.id ? "UPDATE_USER" : "CREATE_USER",
        model
      );
      successageMsg = "??????????????????????????????????????????????????????????????????????????????????????????????????????";
    } else {
      await saveUserData(conn, model);
    }

    conn.commit();

    return res.send(util.callbackSuccess(successageMsg, true));
  } catch (e) {
    conn.rollback();
    if (e.code == "ER_DUP_ENTRY") {
      return res.status(401).send("????????????????????????????????????????????????????????????????????????????????????");
    } else {
      return res.status(500).send(e.message);
    }
  } finally {
    conn.release();
  }
}

async function saveUserData(conn, model) {
  if (!model.id) {
    if (!model.password) {
      model.password = "1111";
    }

    model.password = encypt.encrypt(model.password);
  }

  if (model.businessType == "H") {
    model.businessId = 1;
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

  await userDao.deleteAgent(conn, model.username);

  for (let index = 0; index < model.userAgents.length; index++) {
    await userDao.saveAgent(
      conn,
      model.username,
      model.createBy,
      model.userAgents[index]
    );
  }

  return true;
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
      util.callbackSuccess("???????????????????????????????????????????????????????????????????????????????????????????????????", true)
    );
  } catch (e) {
    conn.rollback();
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function saveAgents(req, res) {
  const conn = await pool.getConnection();
  conn.beginTransaction();
  try {
    let model = req.body;

    //=================================
    // Object Info
    // {username : "xxx", createBy : "xxx", userAgents[ {agentId} ]}
    //=================================

    await userDao.deleteAgent(conn, model.username);

    for (let index = 0; index < model.userAgents.length; index++) {
      await userDao.saveAgent(
        conn,
        model.username,
        model.createBy,
        model.userAgents[index]
      );
    }

    conn.commit();

    return res.send(
      util.callbackSuccess("????????????????????????????????????????????????????????????????????????????????????????????????", true)
    );
  } catch (e) {
    conn.rollback();
    if (e.code == "ER_DUP_ENTRY") {
      return res.status(401).send("?????????????????????????????????????????????????????????????????????");
    } else {
      return res.status(500).send(e.message);
    }
  } finally {
    conn.release();
  }
}
