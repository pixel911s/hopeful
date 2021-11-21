"use strict";

var util = require("../utils/responseUtils");
var encypt = require("../utils/encypt");
var orderDao = require("../dao/orderDao");
var productDao = require("../dao/productDao");
var customerDao = require("../dao/customerDao");
var runningDao = require("../dao/runingDao");
var activityDao = require("../dao/activityDao");

const config = require("config");
const mysql = require("promise-mysql");
const pool = mysql.createPool(config.mysql);

module.exports = {
  get,
  search,
  create,
  update,
  deleteOrder,
  upload,
};

async function get(req, res) {
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;

    let result = await orderDao.get(conn, criteria.id);
    let canAccess = false;

    for (let index = 0; index < criteria.userAgents.length; index++) {
      const agent = criteria.userAgents[index];
      if (agent.id == result.ownerId) {
        canAccess = true;
      }
    }

    if (!canAccess) {
      return res.status(404).send("Can't access data");
    }

    result.orderDetail = await orderDao.getDetail(conn, criteria.id);

    return res.send(util.callbackSuccess(null, result));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function search(req, res) {
  const conn = await pool.getConnection();
  try {
    let criteria = req.body;
    let result = null;

    let totalRecord = await orderDao.count(conn, criteria);

    let totalPage = Math.round(totalRecord / criteria.size);
    if (totalPage <= 0) {
      totalPage = 1;
    }

    if (totalRecord > 0) {
      result = await orderDao.search(conn, criteria);
    }

    return res.send(util.callbackPaging(result, totalPage, totalRecord));
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function create(req, res) {
  console.log("CREATE ORDER");

  const conn = await pool.getConnection();
  conn.beginTransaction();
  try {
    let model = req.body;

    addOrder(model, conn);

    conn.commit();

    return res.send(
      util.callbackSuccess("บันทึกข้อมูลออเดอร์เสร็จสมบูรณ์", true)
    );
  } catch (e) {
    console.log(e);
    conn.rollback();
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function upload(req, res) {
  console.log("UPLOAD ORDER");

  let body = req.body;

  for (let index = 0; index < body.items.length; index++) {
    const conn = await pool.getConnection();
    try {
      conn.beginTransaction();
      const model = body.items[index];
      model.ownerId = body.ownerId;
      model.username = body.username;
      model.status = "O";
      await addOrder(model, conn);
      conn.commit();
    } catch (e) {
      console.log(e);
      conn.rollback();
      return res.status(500).send(e.message);
    } finally {
      conn.release();
    }
  }

  return res.send(
    util.callbackSuccess("อัพโหลดข้อมูลออเดอร์เสร็จสมบูรณ์", true)
  );
}

async function addOrder(model, conn) {
  model = await orderDao.calculateOrder(model);

  console.log("MODEL : ", model);

  let _date = new Date();
  let month = _date.getMonth() + 1;

  model.orderNo = await runningDao.getNextRunning(
    conn,
    "SO",
    _date.getFullYear(),
    month
  );

  console.log("ORDER NO : ", model.orderNo);

  //CHECK CUSTOMER
  let customer = await customerDao.getByMobileNo(conn, model.deliveryContact);

  if (customer != undefined) {
    //OLD CUSTOMER
    model.customerId = customer.id;

    let addresses = await customerDao.getAddress(conn, customer.id);

    let duplicatedAddress = await addresses.filter(
      (addr) =>
        addr.name == model.deliveryName &&
        addr.info == model.deliveryAddressInfo &&
        addr.district == model.deliveryDistrict &&
        addr.subDistrict == model.deliverySubDistrict &&
        addr.province == model.deliveryProvince &&
        addr.zipcode == model.deliveryZipcode
    );

    let address;

    if (duplicatedAddress.length == 0) {
      console.log("NEW");
      address = {
        businessId: customer.id,
        name: model.deliveryName,
        info: model.deliveryAddressInfo,
        district: model.deliveryDistrict,
        subDistrict: model.deliverySubDistrict,
        province: model.deliveryProvince,
        zipcode: model.deliveryZipcode,
        contact: model.deliveryContact,
        username: model.username,
        addressType: "D",
      };
    } else {
      console.log("DUPLICATED");
      address = duplicatedAddress[0];
      console.log(address);

      await customerDao.deleteAddress(conn, address.id);

      address.username = model.username;
      address.id = undefined;
    }

    await customerDao.addAddress(conn, address);
  } else {
    //NEW CUSTOMER
    customer = {
      ownerId: model.ownerId,
      name: model.deliveryName,
      mobile: model.deliveryContact,
      username: model.username,
    };

    let customerId = await customerDao.save(conn, customer);

    let address = {
      businessId: customerId,
      name: model.deliveryName,
      info: model.deliveryAddressInfo,
      district: model.deliveryDistrict,
      subDistrict: model.deliverySubDistrict,
      province: model.deliveryProvince,
      zipcode: model.deliveryZipcode,
      contact: model.deliveryContact,
      username: model.username,
      addressType: "D",
    };

    await customerDao.addAddress(conn, address);

    model.customerId = customerId;
  }

  let _orderId = await orderDao.save(conn, model);

  console.log("RET ORDER ID : ", _orderId);

  //=== Get Owner Customer to Create Activity =======

  let _activityOwnerObj = await activityDao.getOwnerCustomer(
    conn,
    model.customerId
  );
  console.log("OWNER CUSTOMER : ", _activityOwnerObj);

  let _activityOwner = _activityOwnerObj.activityOwner;

  //=================================================

  for (let index = 0; index < model.orderDetail.length; index++) {
    let orderItem = model.orderDetail[index];
    orderItem.orderId = _orderId;
    let _orderItemId = await orderDao.saveDetail(conn, orderItem);

    //=== Add Activity ==========================================

    let _activityDesc =
      orderItem.code +
      "-" +
      orderItem.name +
      " : " +
      orderItem.qty +
      " " +
      orderItem.unit;
    let _activityCode = await runningDao.getNextRunning(
      conn,
      "A",
      _date.getFullYear(),
      month
    );
    //==== จำนวนวันนัด = จำนวนวันที่ใช้ของสินค้า x จำนวนสินค้าที่สั่งซื้อ
    let _remainingDay = +orderItem.remainingDay * +orderItem.qty;

    let _dueDate = new Date();
    _dueDate.setDate(_dueDate.getDate() + _remainingDay);
    _dueDate = _dueDate.setHours(0, 0, 0, 0);

    let _activity = {
      code: _activityCode,
      description: _activityDesc,
      productId: orderItem.id,
      remainingDay: _remainingDay,
      dueDate: _dueDate,
      agentId: model.ownerId,
      customerId: model.customerId,
      ownerUser: _activityOwner,
      activityStatusId: 0,
      refOrderId: _orderId,
      refOrderItemId: _orderItemId,
      username: model.username,
    };

    console.log("ACTIVITY : ", _activity);

    let _activityId = await activityDao.save(conn, _activity);

    //===========================================================

    //==== Add Audit Log ========================================

    let _logDesc = "Create Activity : Activity Code-->" + _activity.code;

    let _auditLog = {
      logType: "activity",
      logDesc: _logDesc,
      logBy: model.username,
      refTable: "activity",
      refId: _activityId
    }

    await auditLogDao.save(conn, _auditLog);
  }

  return true;
}

async function update(req, res) {
  const conn = await pool.getConnection();
  conn.beginTransaction();
  try {
    let model = req.body;

    model = await orderDao.calculateOrder(model);

    await orderDao.save(conn, model);

    conn.commit();

    return res.send(
      util.callbackSuccess("บันทึกข้อมูลออเดอร์เสร็จสมบูรณ์", true)
    );
  } catch (e) {
    conn.rollback();
    if (e.code == "ER_DUP_ENTRY") {
      return res.status(401).send("มีข้อมูลออเดอร์นี้แล้วในระบบ");
    } else {
      return res.status(500).send(e.message);
    }
  } finally {
    conn.release();
  }
}

async function deleteOrder(req, res) {
  const conn = await pool.getConnection();
  conn.beginTransaction();
  try {
    let model = req.body;

    // await orderDao.deleteOrderDetail(conn, model.id);

    let order = await orderDao.get(conn, model.id);

    order.username = model.username;
    order.status = "C";

    await orderDao.save(conn, order);

    //=== Cancel Activity ==================
    await activityDao.cancelActivityByOrderId(conn, model.id);
    //======================================

    conn.commit();

    return res.send(
      util.callbackSuccess("ทำการลบข้อมูลออเดอร์เสร็จสมบูรณ์", true)
    );
  } catch (e) {
    conn.rollback();
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}
