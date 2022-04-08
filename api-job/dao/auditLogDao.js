"use strict";
var dateUtil = require("../utils/dateUtil");

module.exports = {
  save,
};

async function save(conn, model) {
  try {
    let sql =
      "INSERT INTO `auditlog` (`logType`, `logDate`, `logDesc`, logBy, `refTable`, `refId`) ";
    sql += " VALUES (?,?,?,?,?,?)";
    let result = await conn.query(sql, [
      model.logType,
      new Date(),
      model.logDesc,
      model.logBy,
      model.refTable,
      model.refId,
    ]);

    return result;
  } catch (e) {
    throw e;
  }
}
