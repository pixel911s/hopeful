"use strict";
var dateUtil = require("../utils/dateUtil");

module.exports = {
  getLineNotifyToken,

  getActivityDateConfig,
  getActivityDateConfigByUsername,
  saveActivityDateConfig,
  deleteActivityDateConfig,
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

async function getActivityDateConfig(conn, id) {
  try {
    let sql = "select * from activitydateconfig where id = ?";

    const result = await conn.query(sql, [id]);

    return result[0];
  } catch (err) {
    throw err;
  }
}

async function getActivityDateConfigByUsername(conn, username) {
  try {
    let sql =
      "select * from activitydateconfig where username = ? order by `condition` asc";

    const result = await conn.query(sql, [username]);

    return result;
  } catch (err) {
    throw err;
  }
}

async function saveActivityDateConfig(conn, model) {
  try {
    if (model.id) {
      //update

      let params = [];

      let sql = "UPDATE `activitydateconfig` SET ";

      sql += "display = ? ";
      params.push(model.display.trim());

      sql += ", `condition` = ? ";
      params.push(model.condition);

      sql += " where id = ?";
      params.push(model.id);

      await conn.query(sql, params);
    } else {
      //insert
      let sql =
        "INSERT INTO `activitydateconfig` (`display`,`condition`,`username`)";
      sql += "  VALUES (?,?,?)";

      await conn.query(sql, [
        model.display.trim(),
        model.condition,
        model.username,
      ]);
    }

    return true;
  } catch (e) {
    throw e;
  }
}

async function deleteActivityDateConfig(conn, id) {
  try {
    let sql = "delete from activitydateconfig where id = ?";

    await conn.query(sql, [id]);

    return true;
  } catch (err) {
    throw err;
  }
}
