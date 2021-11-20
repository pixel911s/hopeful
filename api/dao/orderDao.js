"use strict";

var dateUtil = require("../utils/dateUtil");

module.exports = {
  get,
  getDetail,
  search,
  count,
  save,
  saveDetail,
  deleteOrder,
  deleteOrderDetail,
  calculateOrder,
};

async function get(conn, id) {
  try {
    let sql =
      "select o.*, bu.name as businessName from `order` o left join business bu on o.ownerId = bu.id where o.id = ?";
    const result = await conn.query(sql, [id]);

    return result[0];
  } catch (err) {
    throw err;
  }
}

async function getDetail(conn, id) {
  try {
    let sql = "select a.*,b.code,b.name,b.unit, b.imageUrl from orderItem a ";
    sql += " left join product b on a.productId=b.id";
    sql += " where orderId = ?";
    sql += " order by a.id";
    const result = await conn.query(sql, [id]);

    return result;
  } catch (err) {
    throw err;
  }
}

async function count(conn, criteria) {
  try {
    let params = [];

    let sql =
      "select count(o.id) as totalRecord from `order`  o left join business b on o.ownerId = b.id where 1=1";

    if (criteria.agent != undefined) {
      sql += " and b.id = ?";
      params.push(criteria.agent);
    } else {
      if (criteria.userAgents.length > 0) {
        let userAgents = [];
        for (let index = 0; index < criteria.userAgents.length; index++) {
          const element = criteria.userAgents[index];
          userAgents.push(element.id);
        }
        sql += " and ( b.id in (?) or b.businessType = 'H')";
        params.push(userAgents);
      } else {
        sql += " and b.businessType = 'H'";
      }
    }

    if (criteria.exceptHQ) {
      sql += " and b.businessType <> 'H'";
    }

    if (criteria.orderNo) {
      sql += " and o.orderNo like ?";
      params.push("%" + criteria.code + "%");
    }

    if (criteria.deliveryName) {
      sql += " and o.deliveryName like ?";
      params.push("%" + criteria.deliveryName + "%");
    }

    if (criteria.status) {
      sql += " and o.status = ?";
      params.push(criteria.status);
    }

    if (criteria.dates != undefined) {
      sql += " and o.orderDate between ? AND ?";
      params.push(dateUtil.convertForSqlFromDate(criteria.dates[0]));
      params.push(dateUtil.convertForSqlToDate(criteria.dates[1]));
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

    let sql =
      "select o.*, b.name as businessName from `order` o left join business b on o.ownerId = b.id  where 1=1";

    if (criteria.agent != undefined) {
      sql += " and b.id = ?";
      params.push(criteria.agent);
    } else {
      if (criteria.userAgents.length > 0) {
        let userAgents = [];
        for (let index = 0; index < criteria.userAgents.length; index++) {
          const element = criteria.userAgents[index];
          userAgents.push(element.id);
        }
        sql += " and ( b.id in (?) or b.businessType = 'H')";
        params.push(userAgents);
      } else {
        sql += " and b.businessType = 'H'";
      }
    }

    if (criteria.exceptHQ) {
      sql += " and b.businessType <> 'H'";
    }

    if (criteria.orderNo) {
      sql += " and o.orderNo like ?";
      params.push("%" + criteria.code + "%");
    }

    if (criteria.deliveryName) {
      sql += " and o.deliveryName like ?";
      params.push("%" + criteria.deliveryName + "%");
    }

    if (criteria.status) {
      sql += " and o.status = ?";
      params.push(criteria.status);
    }

    if (criteria.dates != undefined) {
      sql += " and o.orderDate between ? AND ?";
      params.push(dateUtil.convertForSqlFromDate(criteria.dates[0]));
      params.push(dateUtil.convertForSqlToDate(criteria.dates[1]));
    }

    sql += " order by o.orderDate desc , o.orderNo desc";

    sql += " limit " + startRecord + "," + criteria.size;

    let result = await conn.query(sql, params);

    return result;
  } catch (e) {
    throw e;
  }
}

async function save(conn, model) {
  try {
    let _id = 0;

    if (model.id) {
      //update

      let params = [];

      let sql = "update `order` set ";

      sql += "paymentType = ? ";
      params.push(model.paymentType);

      sql += ",ownerId = ? ";
      params.push(model.ownerId);

      sql += ",customerId = ? ";
      params.push(model.customerId);

      sql += ",totalQty = ? ";
      params.push(model.totalQty);

      sql += ",totalAmount = ? ";
      params.push(model.totalAmount);

      sql += ",billDiscountAmount = ? ";
      params.push(model.billDiscountAmount);

      sql += ",itemDiscountAmount = ? ";
      params.push(model.itemDiscountAmount);

      sql += ",deliveryPrice = ? ";
      params.push(model.deliveryPrice);

      sql += ",netAmount = ? ";
      params.push(model.netAmount);

      sql += ",status = ? ";
      params.push(model.status);

      sql += ",deliveryName = ? ";
      params.push(model.deliveryName ? model.deliveryName.trim() : "");

      sql += ",deliveryAddressInfo = ? ";
      params.push(
        model.deliveryAddressInfo ? model.deliveryAddressInfo.trim() : ""
      );

      sql += ",deliverySubDistrict = ? ";
      params.push(model.deliverySubDistrict);

      sql += ",deliveryDistrict = ? ";
      params.push(model.deliveryDistrict);

      sql += ",deliveryProvince = ? ";
      params.push(model.deliveryProvince);

      sql += ",deliveryZipcode = ? ";
      params.push(model.deliveryZipcode);

      sql += ",deliveryContact = ? ";
      params.push(model.deliveryContact ? model.deliveryContact.trim() : "");

      sql += ",remark = ? ";
      params.push(model.remark);

      sql += ",updateBy = ? ";
      params.push(model.username);

      sql += ",updateDate = ? ";
      params.push(new Date());

      sql += " where id = ?";
      params.push(model.id);

      await conn.query(sql, params);
    } else {
      //insert

      console.log("INSERT ORDER");

      let sql =
        "insert into `order` (paymentType,orderNo,orderDate,ownerId,customerId,totalQty,totalAmount,billDiscountAmount,itemDiscountAmount,deliveryPrice,netAmount,status,deliveryName,deliveryAddressInfo,deliverySubDistrict,deliveryDistrict,deliveryProvince,deliveryZipcode,deliveryContact, remark,createBy,createDate,updateBy,updateDate)";
      sql += "  values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

      let _result = await conn.query(sql, [
        model.paymentType,
        model.orderNo,
        model.orderDate ? new Date(model.orderDate) : new Date(),
        model.ownerId,
        model.customerId,
        model.totalQty,
        model.totalAmount,
        model.billDiscountAmount,
        model.itemDiscountAmount,
        model.deliveryPrice,
        model.netAmount,
        model.status,
        model.deliveryName ? model.deliveryName.trim() : "",
        model.deliveryAddressInfo ? model.deliveryAddressInfo.trim() : "",
        model.deliverySubDistrict,
        model.deliveryDistrict,
        model.deliveryProvince,
        model.deliveryZipcode,
        model.deliveryContact ? model.deliveryContact.trim() : "",
        model.remark,
        model.username,
        new Date(),
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

async function saveDetail(conn, model) {
  try {
    //insert

    let _id = 0;

    let sql =
      "insert into orderItem (`orderId`,`productId`,`qty`,`price`,`discount`,`itemAmount`)";
    sql += "  VALUES (?,?,?,?,?,?)";

    let _result = await conn.query(sql, [
      model.orderId,
      model.id,
      model.qty,
      model.price,
      model.discount,
      model.itemAmount,
    ]);

    _id = _result.insertId;

    return _id;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}

async function deleteOrder(conn, id) {
  try {
    //delete

    let sql = "delete from `order` where id = ?";
    await conn.query(sql, [id]);

    return true;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}

async function deleteOrderDetail(conn, id) {
  try {
    //delete

    let sql = "delete from orderItem where orderId = ?";
    await conn.query(sql, [id]);

    return true;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}

async function calculateOrder(model) {
  model.totalQty = 0;
  model.totalAmount = 0;
  model.itemDiscountAmount = 0;

  for (let index = 0; index < model.orderDetail.length; index++) {
    model.orderDetail[index].itemAmount = +(
      +model.orderDetail[index].qty * +model.orderDetail[index].price
    ).toFixed(2);

    model.totalQty += +model.orderDetail[index].qty;
    model.itemDiscountAmount += +model.orderDetail[index].discount;
    model.totalAmount += +model.orderDetail[index].itemAmount;
  }
  model.netAmount =
    +model.totalAmount -
    +model.billDiscountAmount -
    +model.itemDiscountAmount +
    +model.deliveryPrice;

  return model;
}
