"use strict";
var dateUtil = require("../utils/dateUtil");

module.exports = {
  getProvinces,
  getDistricts,
  getSubDistricts,

  getActivityStatus,

  searchZipCode,
  countZipCode,
};

async function countZipCode(conn, criteria) {
  try {
    let params = [];

    let sql =
      "SELECT count(*) FROM crm.subdistrict sd left join district d on sd.districtId = d.id left join province p on d.provinceId = p.id where sd.zipCode is not null ";

    sql += " and zipCode like ?";
    params.push("%" + criteria.zipCode + "%");

    const result = await conn.query(sql, params);

    return result;
  } catch (err) {
    throw err;
  }
}

async function searchZipCode(conn, criteria) {
  try {
    let params = [];

    let sql =
      "SELECT sd.zipCode , sd.nameInThai as subdistrict , d.nameInThai as district , p.nameInThai as province FROM crm.subdistrict sd left join district d on sd.districtId = d.id left join province p on d.provinceId = p.id where sd.zipCode is not null ";

    // sql += " and zipCode like ?";
    // params.push("%" + criteria.zipCode + "%");

    sql += " order by sd.zipCode asc ,  sd.nameInThai asc";

    const result = await conn.query(sql, params);

    return result;
  } catch (err) {
    throw err;
  }
}

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
