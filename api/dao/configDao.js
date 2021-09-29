"use strict";
var dateUtil = require("../utils/dateUtil");

module.exports = {
  getLineNotifyToken,
};

async function getLineNotifyToken(conn) {
  try {
    let sql = "select * from config c where c.key = 'LINE_NOTIFY_TOKEN'";

    const result = await conn.query(sql, []);

    return result[0];
  } catch (err) {
    throw err;
  }
}
