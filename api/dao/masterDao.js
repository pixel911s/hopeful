"use strict";
var dateUtil = require("../utils/dateUtil");

module.exports = {
  getProvinces,
  getDistricts,
  getSubDistricts,
  getBranchs,
};

async function getBranchs(conn) {
  try {
    let sql = "select * from branch order by id asc";

    const result = await conn.query(sql, []);

    return result;
  } catch (err) {
    throw err;
  }
}

async function getProvinces(conn) {
  try {
    let sql = "select * from provinces where 1=1 order by name_in_thai asc";

    const result = await conn.query(sql, []);

    return result;
  } catch (err) {
    throw err;
  }
}

async function getDistricts(conn, id) {
  try {
    let sql =
      "select * from districts where province_id = ?  order by name_in_thai asc";

    const result = await conn.query(sql, [id]);

    return result;
  } catch (err) {
    throw err;
  }
}

async function getSubDistricts(conn, id) {
  try {
    let sql =
      "select * from subdistricts where district_id = ? order by name_in_thai asc";

    const result = await conn.query(sql, [id]);

    return result;
  } catch (err) {
    throw err;
  }
}
