'use strict';
var dateUtil = require('../utils/dateUtil');

module.exports = {
  get,
  save
}

async function get(conn, type, year, month) {


  try {

    let sql = "select * from running where type = ? and year = ? and month = ?";
    const result = await conn.query(sql, [type, year, month]);

    return result[0];
  } catch (err) {
    throw err;
  }
}

async function save(conn, model) {
  try {

    if (model.id && model.id > 0) {
      //update
      let sql = "UPDATE `running` SET `type` = ? , `month`=?,`year`=?,`runing`=?";
      sql += " where id = ?";
      await conn.query(sql, [
        model.type,
        model.month,
        model.year,
        model.runing?model.runing:1,
        model.id
      ]);
    } else {
      //insert
      let sql = "INSERT INTO `running` ( `type`, `month`, `year`, `runing`) ";
      sql += "  VALUES (?,?,?,?)";

      await conn.query(sql, [
        model.type,
        model.month,
        model.year,
        model.runing?model.runing:1
      ]);
    }

    return true;
  } catch (e) {
    throw e;
  }
}
