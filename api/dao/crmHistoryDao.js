"use strict";

module.exports = {
  create,
  search,
  count,
};

async function create(conn, model) {
  try {
    let sql =
      "INSERT INTO `crmhistory` ( `action`, `description`, activityCode, `customerId`, `createDttm`, `createUser`, activityId) ";
    sql += " VALUES (?,?,?,?,?,?,?)";
    let result = await conn.query(sql, [
      model.action,
      model.description,
      model.activityCode,
      model.customerId,
      new Date(),
      model.username ? model.username : null,
      model.activityId,
    ]);

    return result;
  } catch (e) {
    throw e;
  }
}

async function count(conn, criteria) {
  try {
    let params = [];

    let sql =
      "select count(o.id) as totalRecord from `crmhistory`  o  where 1=1";

    if (criteria.customerId) {
      sql += " and customerId = ?";
      params.push(criteria.customerId);
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

    let sql = "select * from `crmhistory` where 1=1";

    if (criteria.customerId) {
      sql += " and customerId = ?";
      params.push(criteria.customerId);
    }

    sql += " order by createDttm desc";

    sql += " limit " + startRecord + "," + criteria.size;

    let result = await conn.query(sql, params);

    return result;
  } catch (e) {
    throw e;
  }
}
