"use strict";
const { any, concat } = require("async");
const { mode } = require("crypto-js");
var dateUtil = require("../utils/dateUtil");

module.exports = {
  getNextRunning,
  get,
  save,
};

async function getNextRunning(conn, type, year, month) {
  console.log("GET NEXT RUNNING NO");

  let _runningNo = "";

  const data = await get(conn, type, year, month);

  console.log("DATA : ", data);

  if (data && data.length > 0) {
    console.log("NEW RUNNING : ", data[0]);
    _runningNo = await save(conn, data[0]);
  } else {
    let _model = { type: type, year: year, month: month };
    console.log("INCREASE RUNNING : ", _model);
    _runningNo = await save(conn, _model);
  }

  return _runningNo;
}

async function get(conn, type, year, month) {
  try {
    let sql = "select * from running where type = ? and year = ? and month = ?";
    const result = await conn.query(sql, [type, year, month]);

    return result;
  } catch (err) {
    throw err;
  }
}

async function save(conn, model) {
  try {
    let _runningNo = "";

    if (model.id && model.id > 0) {
      //update

      console.log("UPDATE RUNNING");

      model.runing = +model.runing + 1;

      let sql =
        "UPDATE `running` SET `type` = ? , `month`=?,`year`=?,`runing`=?";
      sql += " where id = ?";
      await conn.query(sql, [
        model.type,
        model.month,
        model.year,
        model.runing,
        model.id,
      ]);
    } else {
      //insert

      console.log("INSERT RUNNING");

      model.runing = 1;

      let sql = "INSERT INTO `running` ( `type`, `month`, `year`, `runing`) ";
      sql += "  VALUES (?,?,?,?)";

      await conn.query(sql, [
        model.type,
        model.month,
        model.year,
        model.runing,
      ]);
    }

    console.log("EXECUTE : ", model);

    _runningNo = model.type
      .concat(model.year.toString())
      .concat(model.month.toString().padStart(2, "0"))
      .concat("-")
      .concat(model.runing.toString().padStart(6, "0"));

    console.log("RETURN RUNNING NO : ", _runningNo);

    return _runningNo;
  } catch (e) {
    throw e;
  }
}
