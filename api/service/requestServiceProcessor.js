"use strict";
var requestDao = require("../dao/requestDao");
var userDao = require("../dao/userDao");
var runningDao = require("../dao/runingDao");

var lineService = require("./lineService");

module.exports = {
  create,
};

async function create(conn, requestType, model) {
  let requestModel = {
    createBy: model.updateUser,
    data: model,
    status: "REQUEST",
    requestType: requestType,
  };

  let _date = new Date();

  requestModel.reqNo = await runningDao.getNextRunning(
    conn,
    "REQ",
    _date.getFullYear(),
    _date.getMonth() + 1
  );

  await requestDao.create(conn, requestModel);

  let userHQs = await userDao.getHQUser(conn, { haveLineToken: true });

  for (let index = 0; index < userHQs.length; index++) {
    const user = userHQs[index];
    await lineService.notify(
      user.lineNotifyToken,
      "มีรายการคำขอใหม่ หมายเลข : " + requestModel.reqNo
    );
  }
}
