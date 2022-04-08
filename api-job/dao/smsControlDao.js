'use strict';

module.exports = {
  used,
  get
}

async function used(conn, point) {
  try {

      let sql = "UPDATE `sms_control` SET `totalSms` = `totalSms` - ?";
      await conn.query(sql, [
        point
      ]);

    return true;
  } catch (e) {
    throw e;
  }
}

async function get(conn) {

  try {

    let sql = "select * from sms_control";
    const result = await conn.query(sql, []);

    return result[0];
  } catch (err) {
    throw err;
  }
}

