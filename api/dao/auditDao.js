"use strict";
var dateUtil = require("../utils/dateUtil");

module.exports = {
  create,
  createSms,
  countSms,
  searchSms,
  genChartsSms,
  updateStatus,
  getByToken,

  getSuccesPaymentLogs,
  countSuccesPaymentLogs,
  getGraphIncomes,
};

async function getGraphIncomes(conn) {
  try {
    let params = [];

    let sql =
      "SELECT YEAR(createDttm) as year, MONTH(createDttm) as month, SUM(amount) as amount FROM sp_sys.audit where action = 'EXPAND_DATE' or action = 'ADD_SMS' GROUP BY YEAR(createDttm), MONTH(createDttm) order by YEAR(createDttm) asc , MONTH(createDttm) asc;";

    let result = await conn.query(sql, params);

    return result;
  } catch (e) {
    throw e;
  }
}

async function countSuccesPaymentLogs(conn, criteria) {
  try {
    let params = [];

    let sql = "select count(*) as totalRecord FROM audit ad";

    sql += " left join shop s on ad.shopId = s.id";
    sql += " left join shop af on s.saleId = af.id";
    sql +=
      " where (ad.action = 'EXPAND_DATE' or ad.action = 'ADD_SMS') and ad.status = 1";

    let result = await conn.query(sql, params);

    return result[0].totalRecord;
  } catch (e) {
    throw e;
  }
}

async function getSuccesPaymentLogs(conn, criteria) {
  try {
    let startRecord = (criteria.page - 1) * criteria.size;

    let params = [];

    let sql =
      "SELECT ad.createDttm, s.name , ad.description, ad.amount, af.name as af, ad.status FROM sp_sys.audit ad";

    sql += " left join shop s on ad.shopId = s.id";
    sql += " left join shop af on s.saleId = af.id";
    sql +=
      " where (ad.action = 'EXPAND_DATE' or ad.action = 'ADD_SMS') and ad.status = 1";
    sql += " order by ad.createDttm desc";

    sql += " limit " + startRecord + "," + criteria.size;

    let result = await conn.query(sql, params);

    return result;
  } catch (e) {
    throw e;
  }
}

async function genChartsSms(conn, criteria) {
  try {
    let params = [];
    let sql = "";

    if (criteria.type == 1) {
      sql +=
        "select YEAR(sendDttm) as year, MONTH(sendDttm) as month, sum(sms) as sms from sms_transaction where 1=1";

      let d = new Date();
      let year = d.getFullYear();

      sql += " and shopId = ?";
      params.push(criteria.shopId);

      sql += " and YEAR(sendDttm) = ?";
      params.push(year);

      sql +=
        " GROUP BY YEAR(sendDttm), MONTH(sendDttm) order by YEAR(sendDttm), MONTH(sendDttm) asc";

      let result = await conn.query(sql, params);

      let items = [
        { label: "มกราคม", id: 1, sms: 0 },
        { label: "กุมภาพันธ์", id: 2, sms: 0 },
        { label: "มีนาคม", id: 3, sms: 0 },
        { label: "เมษายน", id: 4, sms: 0 },
        { label: "พฤษภาคม", id: 5, sms: 0 },
        { label: "มิถุนายน", id: 6, sms: 0 },
        { label: "กรกฏาคม", id: 7, sms: 0 },
        { label: "สิงหาคม", id: 8, sms: 0 },
        { label: "กันยายน", id: 9, sms: 0 },
        { label: "ตุลาคม", id: 10, sms: 0 },
        { label: "พฤศจิกายน", id: 11, sms: 0 },
        { label: "ธันวาคม", id: 12, sms: 0 },
      ];

      for (let index = 0; index < items.length; index++) {
        const item = items[index];

        for (let index = 0; index < result.length; index++) {
          const element = result[index];

          if (item.id == element.month) {
            item.sms = element.sms;
          }
        }
      }

      return items;
    } else {
      sql +=
        "select YEAR(sendDttm) as year, MONTH(sendDttm) as month, DAY(sendDttm) as day, sum(sms) as sms from sms_transaction where 1=1";

      let startDate = new Date();
      let endDate = new Date();
      startDate.setDate(startDate.getDate() - 11);
      startDate.setHours(0);
      startDate.setMinutes(0);
      startDate.setSeconds(0);
      startDate.setMilliseconds(0);

      sql += " and shopId = ?";
      params.push(criteria.shopId);

      sql += " and sendDttm  between ? AND ?";
      params.push(dateUtil.convertForSqlFromDate(startDate));
      params.push(dateUtil.convertForSqlToDate(endDate));

      sql +=
        " GROUP BY YEAR(sendDttm), MONTH(sendDttm), DAY(sendDttm) order by YEAR(sendDttm), MONTH(sendDttm), DAY(sendDttm) asc";

      console.log(sql);

      let result = await conn.query(sql, params);

      let items = [];

      for (let index = 1; index <= 12; index++) {
        let item = {
          label:
            startDate.getFullYear() +
            "-" +
            (startDate.getMonth() + 1) +
            "-" +
            startDate.getDate(),
          sms: 0,
        };
        for (let index = 0; index < result.length; index++) {
          const element = result[index];

          if (element.day == startDate.getDate()) {
            item.sms = element.sms;
          }
        }
        items.push(item);
        startDate.setDate(startDate.getDate() + 1);
      }

      return items;
    }

    // if (criteria.dates != undefined) {
    //   sql += " and sendDttm  between ? AND ?";
    //   params.push(dateUtil.convertForSqlFromDate(criteria.dates[0]));
    //   params.push(dateUtil.convertForSqlToDate(criteria.dates[1]));
    // }

    return null;
  } catch (e) {
    throw e;
  }
}

async function countSms(conn, criteria) {
  try {
    let params = [];

    let sql = "select count(id) as totalRecord from sms_transaction where 1=1";

    if (criteria.shopId) {
      sql += " and shopId = ?";
      params.push(criteria.shopId);
    }

    if (criteria.dates != undefined) {
      sql += " and sendDttm  between ? AND ?";
      params.push(dateUtil.convertForSqlFromDate(criteria.dates[0]));
      params.push(dateUtil.convertForSqlToDate(criteria.dates[1]));
    }

    let result = await conn.query(sql, params);

    return result[0].totalRecord;
  } catch (e) {
    throw e;
  }
}

async function searchSms(conn, criteria) {
  try {
    let startRecord = 0;

    if (criteria.page && criteria.size) {
      startRecord = (criteria.page - 1) * criteria.size;
    }

    let params = [];

    let sql = "select * from sms_transaction where 1=1";

    if (criteria.shopId) {
      sql += " and shopId = ?";
      params.push(criteria.shopId);
    }

    if (criteria.dates != undefined) {
      sql += " and sendDttm  between ? AND ?";
      params.push(dateUtil.convertForSqlFromDate(criteria.dates[0]));
      params.push(dateUtil.convertForSqlToDate(criteria.dates[1]));
    }

    sql += " order by sendDttm desc ";

    if (criteria.page && criteria.size) {
      sql += " limit " + startRecord + "," + criteria.size;
    }

    let result = await conn.query(sql, params);

    return result;
  } catch (e) {
    throw e;
  }
}

async function createSms(conn, model) {
  try {
    let sql =
      "INSERT INTO `sms_transaction` (`mobile`, `shopId`, `sendDttm`, `status`, sms, data)  ";
    sql += " VALUES (?,?,?,?,?,?)";
    let result = await conn.query(sql, [
      model.mobile,
      model.shopId,
      new Date(),
      "SUCCESS",
      model.sms,
      model.data,
    ]);

    return result;
  } catch (e) {
    throw e;
  }
}

async function create(conn, model) {
  try {
    let sql =
      "INSERT INTO `audit` (`action`, `shopId`, `description`, token, `amount`, `createDttm`, data, status, createUser) ";
    sql += " VALUES (?,?,?,?,?,?,?,?,?)";
    let result = await conn.query(sql, [
      model.action,
      model.shopId,
      model.description,
      model.token ? model.token : null,
      model.amount,
      new Date(),
      model.data ? JSON.stringify(model.data) : null,
      model.status != undefined ? model.status : 1,
      model.username ? model.username : null,
    ]);

    return result;
  } catch (e) {
    throw e;
  }
}

async function updateStatus(conn, token, status) {
  try {
    let sql = "UPDATE `audit` set status = ?";
    sql += " where token = ?";
    let result = await conn.query(sql, [status, token]);

    return result;
  } catch (e) {
    throw e;
  }
}

async function getByToken(conn, token) {
  try {
    let params = [];

    let sql = "select * from audit where token = ? and status = 0";

    let result = await conn.query(sql, [token]);

    return result[0];
  } catch (e) {
    throw e;
  }
}
