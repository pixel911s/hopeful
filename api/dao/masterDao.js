"use strict";
var dateUtil = require("../utils/dateUtil");

module.exports = {
  getProvinces,
  getDistricts,
  getSubDistricts,

  getActivityStatus,
};

async function getActivityStatus(conn) {
  try {
    let sql = "select * from activitystatus where 1=1 order by id asc";

    const result = await conn.query(sql, []);

    return result;
  } catch (err) {
    throw err;
  }
}

async function getProvinces(conn) {
  try {
    let sql = "select * from province where 1=1 order by nameInThai asc";

    const result = await conn.query(sql, []);

    return result;
  } catch (err) {
    throw err;
  }
}

async function getDistricts(conn, id) {
  try {
    let sql =
      "select * from district where provinceId = ?  order by nameInThai asc";

    const result = await conn.query(sql, [id]);

    return result;
  } catch (err) {
    throw err;
  }
}

async function getSubDistricts(conn, id) {
  try {
    let sql =
      "select * from subdistrict where districtId = ? order by nameInThai asc";

    const result = await conn.query(sql, [id]);

    return result;
  } catch (err) {
    throw err;
  }
}
