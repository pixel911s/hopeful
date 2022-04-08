"use strict";

module.exports = {
  get,
  search,
  count,
  save,

  getAgentPrice,

  getAgentProduct,
};

async function getAgentProduct(conn, agentId, productId) {
  try {
    let sql = "select * from agentproduct where agentId = ? and productId = ?";
    const result = await conn.query(sql, [agentId, productId]);
    return result[0];
  } catch (err) {
    throw err;
  }
}

async function get(conn, agentId, id) {
  try {
    let sql =
      "select p.*, ap.remainingDay as agentRemainingDay, ap.balance from product p left join agentproduct ap on p.id = ap.productId and ap.agentId = ? where p.id = ?";
    const result = await conn.query(sql, [agentId, id]);

    let sku = result[0];

    if (sku.isSet && sku.itemInSet) sku.itemInSet = JSON.parse(sku.itemInSet);

    return sku;
  } catch (err) {
    throw err;
  }
}

async function count(conn, criteria) {
  try {
    let params = [];

    let sql = "select count(id) as totalRecord from product where 1=1";

    if (criteria.status != undefined) {
      sql += " and status = ?";
      params.push(criteria.status);
    }

    if (criteria.keyword) {
      sql += " and (name like ? or code like ?)";
      params.push("%" + criteria.keyword + "%");
      params.push("%" + criteria.keyword + "%");
    }

    console.log(sql);

    let result = await conn.query(sql, params);

    return result[0].totalRecord;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}

async function search(conn, criteria) {
  try {
    let startRecord = (criteria.page - 1) * criteria.size;

    let params = [];

    let sql =
      "select p.*, ap.remainingDay as agentRemainingDay, ap.balance from product p left join agentproduct ap on p.id = ap.productId and ap.agentId = ? where 1=1";

    params.push(criteria.agentId);

    if (criteria.status != undefined) {
      sql += " and p.status = ?";
      params.push(criteria.status);
    }

    if (criteria.keyword) {
      sql += " and (p.name like ? or p.code like ?)";
      params.push("%" + criteria.keyword + "%");
      params.push("%" + criteria.keyword + "%");
    }

    sql += " order by p.code";

    sql += " limit " + startRecord + "," + criteria.size;

    console.log(sql);

    let result = await conn.query(sql, params);

    return result;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}

async function save(conn, model) {
  try {
    let _id = 0;

    if (model.id) {
      //update

      _id = model.id;

      let params = [];

      let sql = "update agentproduct set ";

      sql += "balance = ? ";
      params.push(model.balance);

      sql += " ,remainingDay = ? ";
      params.push(model.remainingDay);

      sql += " ,updateBy = ? ";
      params.push(model.username);

      sql += " ,updateDttm = ? ";
      params.push(new Date());

      sql += " where productId = ? and agentId = ?";
      params.push(model.productId);
      params.push(model.agentId);

      await conn.query(sql, params);
    } else {
      //insert

      console.log("Insert");

      let sql =
        "INSERT INTO `agentproduct` ( `productId`, `agentId`, `balance`, `remainingDay`, updateBy, updateDttm) ";
      sql += "  VALUES (?,?,?,?,?,?)";

      let _result = await conn.query(sql, [
        model.productId,
        model.agentId,
        model.balance,
        model.remainingDay,
        model.username,
        new Date(),
      ]);

      console.log("INSERT RESULT : ", _result);

      _id = _result.insertId;

      console.log("AUTO ID : ", _id);
    }

    return _id;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}

async function getAgentPrice(conn, productId) {
  try {
    let sql = "select * from agentprice where productId=?";
    sql += " order by qty";

    let result = await conn.query(sql, [productId]);

    return result;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}
