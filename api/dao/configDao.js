"use strict";
var dateUtil = require("../utils/dateUtil");

module.exports = {
  getByKey,

  getActivityDateConfig,
  getActivityDateConfigByUsername,
  saveActivityDateConfig,
  deleteActivityDateConfig,
};

async function getByKey(conn, key) {
  try {
    let sql = "select * from config c where c.key = ?";

    const result = await conn.query(sql, [key]);

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

async function getActivityDateConfigByUsername(conn, username, type) {
  try {
    let criteria = [];

    let sql = "select * from activitydateconfig where username = ?";

    criteria.push(username);

    if (type != null) {
      sql += " and `type` = ?";
      criteria.push(type);
    }

    sql += "  order by `type` asc,`condition` asc";

    const result = await conn.query(sql, criteria);

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

      sql += ", `type` = ? ";
      params.push(model.type);

      sql += " where id = ?";
      params.push(model.id);

      await conn.query(sql, params);
    } else {
      //insert
      let sql =
        "INSERT INTO `activitydateconfig` (`display`,`condition`,`username`,`type`)";
      sql += "  VALUES (?,?,?,?)";

      await conn.query(sql, [
        model.display.trim(),
        model.condition,
        model.username,
        model.type,
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
