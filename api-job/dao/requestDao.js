"use strict";
var dateUtil = require("../utils/dateUtil");

module.exports = {
  get,
  create,
  approve,
  count,
  search,
};

async function get(conn, id) {
  try {
    let params = [id];

    let sql = "select * from request where id = ?";

    let result = await conn.query(sql, params);

    return result[0];
  } catch (e) {
    throw e;
  }
}

async function count(conn, criteria) {
  try {
    let params = [];

    let sql = "select count(*) as totalRecord from request where 1=1";

    if (criteria.status != undefined) {
      sql += " and status = ?";
      params.push(criteria.status);
    }

    if (criteria.createBy != undefined) {
      sql += " and createBy = ?";
      params.push(criteria.createBy);
    }

    let result = await conn.query(sql, params);

    return result[0].totalRecord;
  } catch (e) {
    throw e;
  }
}

async function search(conn, criteria) {
  try {
    let startRecord = (criteria.page - 1) * criteria.size;

    let params = [];

    let sql = "select * from request where 1=1";

    if (criteria.status != undefined) {
      sql += " and status = ?";
      params.push(criteria.status);
    }

    if (criteria.createBy != undefined) {
      sql += " and createBy = ?";
      params.push(criteria.createBy);
    }

    sql += " order by createDate desc";

    sql += " limit " + startRecord + "," + criteria.size;

    let result = await conn.query(sql, params);

    return result;
  } catch (e) {
    throw e;
  }
}

async function create(conn, model) {
  try {
    let sql =
      "INSERT INTO `request` ( `requestType`, `data`, `createBy`, `createDate`, `status`, reqNo)";
    sql += " VALUES (?,?,?,?,?,?)";
    let result = await conn.query(sql, [
      model.requestType,
      JSON.stringify(model.data),
      model.createBy,
      new Date(),
      model.status,
      model.reqNo,
    ]);

    return result;
  } catch (e) {
    throw e;
  }
}

async function approve(conn, model) {
  try {
    let sql =
      "UPDATE `request` set status = ? , reason = ?, approveBy = ? , approveDate = ?";
    sql += " where id = ?";
    let result = await conn.query(sql, [
      model.status,
      model.reason,
      model.username,
      new Date(),
      model.id,
    ]);

    return result;
  } catch (e) {
    throw e;
  }
}
