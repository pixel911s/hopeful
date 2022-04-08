"use strict";

module.exports = {
  get,
  search,
  count,
  save,
  deleteProduct,
  addAgentPrice,
  deleteAgentPrice,
  getAgentPrice,
  getByBarcode,
};

async function get(conn, id) {
  try {
    let sql = "select * from product where id = ?";
    const result = await conn.query(sql, [id]);

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

    if (criteria.code) {
      sql += " and code like ?";
      params.push("%" + criteria.code + "%");
    }

    if (criteria.name) {
      sql += " and name like ?";
      params.push("%" + criteria.name + "%");
    }

    if (criteria.status) {
      sql += " and status = ?";
      params.push(criteria.status);
    }

    if (criteria.keyword) {
      sql += " and (name like ? or code like ?)";
      params.push("%" + criteria.keyword + "%");
      params.push("%" + criteria.keyword + "%");
    }

    if (criteria.isSet) {
      if (criteria.isSet == true) {
        sql += " and isSet=true";
      } else {
        sql += " and isSet=false";
      }
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

    let sql = "select * from product where 1=1";

    if (criteria.code) {
      sql += " and code like ?";
      params.push("%" + criteria.code + "%");
    }

    if (criteria.name) {
      sql += " and name like ?";
      params.push("%" + criteria.name + "%");
    }

    if (criteria.status) {
      sql += " and status = ?";
      params.push(criteria.status);
    }

    if (criteria.keyword) {
      sql += " and (name like ? or code like ?)";
      params.push("%" + criteria.keyword + "%");
      params.push("%" + criteria.keyword + "%");
    }

    if (criteria.isSet) {
      if (criteria.isSet == true) {
        sql += " and isSet=true";
      } else {
        sql += " and isSet=false";
      }
    }

    sql += " order by code";

    sql += " limit " + startRecord + "," + criteria.size;

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

    console.log(model);
    if (!model.isSet) {
      model.itemInSet = [];
    }

    if (model.id) {
      //update

      _id = model.id;

      let params = [];

      let sql = "update product set ";

      sql += "code = ? ";
      params.push(model.code.trim());

      sql += " ,name = ? ";
      params.push(model.name.trim());

      sql += " ,`description` = ? ";
      params.push(model.description);

      sql += " ,`weight` = ? ";
      params.push(model.weight);

      sql += " ,unit = ? ";
      params.push(model.unit);

      sql += " ,remainingDay = ? ";
      params.push(model.remainingDay);

      sql += " ,price = ? ";
      params.push(model.price);

      sql += " ,discount = ? ";
      params.push(model.discount);

      sql += " ,sellPrice = ? ";
      params.push(model.sellPrice);

      sql += " ,imageUrl = ? ";
      params.push(model.imageUrl);

      sql += " ,`status` = ? ";
      params.push(model.status);

      sql += " ,updateBy = ? ";
      params.push(model.updateUser);

      sql += " ,updateDate = ? ";
      params.push(new Date());

      sql += " ,isSet = ? ";
      params.push(model.isSet);

      sql += " ,itemInSet = ?";
      params.push(JSON.stringify(model.itemInSet));

      sql += " where id = ?";
      params.push(model.id);

      await conn.query(sql, params);
    } else {
      //insert

      console.log("Insert");

      let sql =
        "insert into product (`code`,`name`,`description`, `weight` ,`unit`,`remainingDay`,`price`,`discount`,`sellPrice`,`imageUrl`,`status`,`createBy`, `createDate`, `updateBy`, `updateDate`, `isSet`, `itemInSet`)";
      sql += "  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

      let _result = await conn.query(sql, [
        model.code.trim(),
        model.name.trim(),
        model.description,
        model.weight,
        model.unit,
        model.remainingDay,
        model.price,
        model.discount,
        model.sellPrice,
        model.imageUrl,
        model.status,
        model.updateUser,
        new Date(),
        model.updateUser,
        new Date(),
        model.isSet,
        JSON.stringify(model.itemInSet),
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

async function deleteProduct(conn, id) {
  try {
    //delete
    let sql = "delete from product where id = ?";

    await conn.query(sql, [id]);

    return true;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}

async function addAgentPrice(conn, model) {
  try {
    //insert
    let sql =
      "insert into agentprice (`productId`,`qty`,`price`,`createBy`, `createDate`)";
    sql += "  VALUES (?,?,?,?,?)";

    await conn.query(sql, [
      model.productId,
      model.qty,
      model.price,
      model.createBy,
      new Date(),
    ]);

    return true;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}

async function deleteAgentPrice(conn, productId) {
  try {
    //delete
    let sql = "delete from agentprice where productId = ?";

    await conn.query(sql, [productId]);

    return true;
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

async function getByBarcode(conn, barcode) {
  try {
    console.log("LOAD BAR = " + barcode);
    let sql = "select * from product where code=?";

    let result = await conn.query(sql, [barcode]);

    let sku = result[0];

    if (sku && sku.isSet && sku.itemInSet)
      sku.itemInSet = JSON.parse(sku.itemInSet);

    return sku;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}
