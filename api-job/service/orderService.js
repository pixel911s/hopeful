"use strict";

const fileUtil = require("../utils/fileUtil");

var util = require("../utils/responseUtils");
var encypt = require("../utils/encypt");
var orderDao = require("../dao/orderDao");
var agentDao = require("../dao/agentDao");
var productDao = require("../dao/productDao");
var customerDao = require("../dao/customerDao");
var runningDao = require("../dao/runingDao");
var activityDao = require("../dao/activityDao");
var noteDao = require("../dao/noteDao");

var auditLogDao = require("../dao/auditLogDao");

var lineService = require("./lineService");

const config = require("config");
const mysql = require("promise-mysql");
const pool = mysql.createPool(config.mysql);

const ExcelJS = require("exceljs");

module.exports = {
  get,
  search,
  create,
  update,
  deleteOrder,
  upload,

  exportTemplate,
  exportKerry,
  exportFlashTransaction,
  exportJTTransaction,
  exportOrder,
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

    for (let index = 0; index < result.orderDetail.length; index++) {
      let orderDetail = result.orderDetail[index];

      if (orderDetail.isSet) {
        orderDetail.itemSet = JSON.parse(orderDetail.itemSet);

        for (let i = 0; i < orderDetail.itemSet.length; i++) {
          let itemSet = orderDetail.itemSet[i];

          itemSet.product = await productDao.get(conn, itemSet.itemId);
        }
      }
    }

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

    if (criteria.loadDetails) {
      for (let index = 0; index < result.length; index++) {
        const order = result[index];
        order.orderDetail = await orderDao.getDetail(conn, order.id);
      }
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
    let model = JSON.parse(req.body.data);
    // let model = req.body;
    let files = req.files;
    let inputFile = config.path.slip_file_input;
    let outputFile = config.path.slip_file_output;

    if (files) {
      let img = files["image"];

      if (img) {
        model.imageUrl = await fileUtil.uploadImg(
          inputFile,
          outputFile,
          "1",
          img
        );
      }
    }

    await addOrder(model, conn);

    const agent = await agentDao.getById(conn, model.ownerId);

    let totalRecord = await orderDao.countFromCustomer(conn, model.customerId);

    if (agent && agent.lineNotifyToken) {
      let msg = "??????????????????????????????????????????????????????";
      msg += "\n????????????????????????????????????????????? " + model.paymentType;
      msg += "\n???????????????????????????????????????????????? " + totalRecord;
      msg += "\nChannel : " + model.saleChannel + " : " + model.saleChannelName;

      msg += "\n\n" + model.deliveryName;
      msg += "\n" + model.deliveryAddressInfo;
      msg += "\n" + model.deliveryDistrict + " " + model.deliverySubDistrict;
      msg += "\n" + model.deliveryProvince + " " + model.deliveryZipcode;
      msg += "\n????????? " + model.deliveryContact;

      msg += "\n\n";

      for (let index = 0; index < model.orderDetail.length; index++) {
        let orderItem = model.orderDetail[index];

        msg += "(" + orderItem.code + " x " + orderItem.qty + ")";

        if (index + 1 < model.orderDetail.length) {
          msg += " + ";
        }
      }

      msg += " = " + model.netAmount;

      msg += "\n" + model.createBy + " " + model.createDate;

      await lineService.notify(agent.lineNotifyToken, msg);
    }

    conn.commit();

    return res.send(
      util.callbackSuccess("?????????????????????????????????????????????????????????????????????????????????????????????", true)
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
  const conn = await pool.getConnection();
  conn.beginTransaction();

  body.uploadDttm = new Date();

  try {
    for (let index = 0; index < body.items.length; index++) {
      const model = body.items[index];
      model.ownerId = body.ownerId;
      model.username = model.sale ? model.sale : body.username;
      model.status = "O";
      model.userAgents = body.userAgents;
      model.uploadBy = body.username;
      model.uploadDttm = body.uploadDttm;
      await addOrder(model, conn);
    }

    conn.commit();

    const agent = await agentDao.getById(conn, body.ownerId);
    if (agent && agent.lineNotifyToken) {
      await lineService.notify(
        agent.lineNotifyToken,
        "??????????????????????????????????????????????????????????????? " +
          body.items.length +
          " ?????????????????? \n?????????: " +
          body.username
      );
    }

    return res.send(
      util.callbackSuccess("????????????????????????????????????????????????????????????????????????????????????????????????", true)
    );
  } catch (e) {
    console.log(e);
    conn.rollback();
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
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

  let customerCriteria = {
    mobile: model.deliveryContact,
    userAgents: model.userAgents,
  };
  let customer = await customerDao.getByMobileNo(conn, customerCriteria);

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

  if (_activityOwner == undefined && model.crmOwner) {
    console.log("FREEEEEEEEEEEE");
    console.log("_activityOwner : ", _activityOwner);
    console.log("model.crmOwner : ", model.crmOwner);

    _activityOwner = model.crmOwner.toLowerCase();

    let customerUpdateOwnerMOdel = {
      id: model.customerId,
      activityOwner: _activityOwner,
    };
    await customerDao.updateOwner(conn, customerUpdateOwnerMOdel);
  }

  //=================================================

  let productLoadLists = [];

  for (let index = 0; index < model.orderDetail.length; index++) {
    let orderItem = model.orderDetail[index];
    orderItem.orderId = _orderId;

    let product = productLoadLists.find((item) => {
      return item.id == orderItem.id;
    });

    if (!product) {
      product = await productDao.get(conn, orderItem.id);
      productLoadLists.push(product);
    }

    orderItem.isSet = product.isSet;
    orderItem.itemSet = Object.assign({}, product.itemInSet);

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
    //==== ????????????????????????????????? = ????????????????????????????????????????????????????????????????????? x ??????????????????????????????????????????????????????????????????
    let _remainingDay = +product.remainingDay * +orderItem.qty;

    let _dueDate = new Date(model.orderDate);
    _dueDate.setDate(_dueDate.getDate() + _remainingDay);
    _dueDate = _dueDate.setHours(0, 0, 0, 0);

    let _activity = {
      code: _activityCode,
      description: _activityDesc,
      productId: product.id,
      remainingDay: _remainingDay,
      dueDate: _dueDate,
      endOfDose: _dueDate,
      agentId: model.ownerId,
      customerId: model.customerId,
      ownerUser: _activityOwner,
      activityStatusId: model.activityStatus ? model.activityStatus : 0,
      refOrderId: _orderId,
      refOrderItemId: _orderItemId,
      username: model.username,
    };

    console.log("ACTIVITY : ", _activity);

    let _activityId = await activityDao.save(conn, _activity);

    //==== Add Audit Log ========================================

    let _logDesc = "Create Activity : Activity Code-->" + _activity.code;

    let _auditLog = {
      logType: "activity",
      logDesc: _logDesc,
      logBy: model.username,
      refTable: "activity",
      refId: _activityId,
    };
    await auditLogDao.save(conn, _auditLog);

    //===========================================================
  }

  if (model.note) {
    let noteObj = {
      customerId: model.customerId,
      description: model.note,
      username: model.username,
    };

    await noteDao.save(conn, noteObj);
  }

  return true;
}

async function update(req, res) {
  const conn = await pool.getConnection();
  conn.beginTransaction();
  try {
    let model = JSON.parse(req.body.data);
    // let model = req.body;
    let files = req.files;
    let inputFile = config.path.slip_file_input;
    let outputFile = config.path.slip_file_output;

    if (files) {
      let img = files["image"];

      if (img) {
        model.imageUrl = await fileUtil.uploadImg(
          inputFile,
          outputFile,
          "1",
          img
        );
      }
    }

    model = await orderDao.calculateOrder(model);

    await orderDao.save(conn, model);

    conn.commit();

    return res.send(
      util.callbackSuccess("?????????????????????????????????????????????????????????????????????????????????????????????", true)
    );
  } catch (e) {
    conn.rollback();
    if (e.code == "ER_DUP_ENTRY") {
      return res.status(401).send("????????????????????????????????????????????????????????????????????????????????????");
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
      util.callbackSuccess("????????????????????????????????????????????????????????????????????????????????????????????????", true)
    );
  } catch (e) {
    conn.rollback();
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function exportTemplate(req, res) {
  const conn = await pool.getConnection();

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(__dirname + "/ORDER_TEMPLATE.xlsx");
    const worksheet = workbook.getWorksheet(3);

    req.body.page = undefined;

    let criteria = {
      page: 1,
      size: 99999,
    };
    let products = await productDao.search(conn, criteria);
    let productIds = [];

    for (let index = 0; index < products.length; index++) {
      const product = products[index];

      const row = worksheet.getRow(index + 2);
      row.getCell(1).value = product.code;
      row.getCell(2).value = product.name;
      row.getCell(3).value = product.description;
      row.getCell(4).value = product.sellPrice;

      productIds.push(product.code);
    }

    // const worksheet1 = workbook.getWorksheet("DATA");
    // let joineddropdownlist = '"' + productIds.join(",") + '"';
    // for (let i = 2; i < 5; i++) {
    //   worksheet1.getCell("L" + i).dataValidation = {
    //     type: "list",
    //     allowBlank: true,
    //     operator: "equal",
    //     formulae: [joineddropdownlist],
    //   };
    // }

    const buffer = await workbook.xlsx.writeBuffer();

    return res.status(200).send(buffer);
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function exportKerry(req, res) {
  const conn = await pool.getConnection();

  try {
    req.body.page = undefined;

    var xl = require("excel4node");

    var wb = new xl.Workbook({
      defaultFont: {
        size: 12,
        name: "AngsanaUPC",
      },
      dateFormat: "dd/MM/yyyy hh:mm:ss",
    });

    var ws = wb.addWorksheet("Sheet 1");

    var borderStyle = {
      bottom: {
        style: "thin",
      },
      top: {
        style: "thin",
      },
      left: {
        style: "thin",
      },
      right: {
        style: "thin",
      },
    };

    var header = wb.createStyle({
      border: borderStyle,
      font: {
        bold: true,
      },
      alignment: {
        horizontal: "center",
      },
    });

    var bodyCenter = wb.createStyle({
      border: borderStyle,
      alignment: {
        horizontal: "center",
      },
    });

    var bodyLeft = wb.createStyle({
      border: borderStyle,
      alignment: {
        horizontal: "left",
      },
    });

    var bodyRight = wb.createStyle({
      border: borderStyle,
      alignment: {
        horizontal: "right",
      },
    });

    ws.cell(8, 1).string("No").style(header);

    ws.cell(8, 2).string("??????????????????????????????").style(header);

    ws.cell(8, 3).string("???????????????????????????????????????").style(header);

    ws.cell(8, 4).string("Email").style(header);

    ws.cell(8, 5).string("?????????????????????1").style(header);

    ws.cell(8, 6).string("?????????????????????2").style(header);

    ws.cell(8, 7).string("????????????????????????????????????").style(header);

    ws.cell(8, 8).string("????????? COD").style(header);

    ws.cell(8, 9).string("Remark").style(header);

    ws.cell(8, 10).string("Ref #1").style(header);

    ws.cell(8, 11).string("Ref #2").style(header);

    let criteria = req.body;

    let result = await orderDao.search(conn, criteria);

    let row = 9;

    var dateFormat = require("dateformat");

    for (let index = 0; index < result.length; index++) {
      const transasction = result[index];

      ws.cell(row, 1)
        .number(index + 1)
        .style(bodyLeft);

      ws.cell(row, 2).string(transasction.deliveryName).style(bodyLeft);

      ws.cell(row, 3).string(transasction.deliveryContact).style(bodyLeft);

      ws.cell(row, 4).string("").style(bodyLeft);

      let address = "";
      if (transasction.deliveryProvince.includes("?????????????????????")) {
        address +=
          "????????????" +
          transasction.deliverySubDistrict +
          " ?????????" +
          transasction.deliveryDistrict +
          " " +
          transasction.deliveryProvince;
      } else {
        address +=
          "????????????" +
          transasction.deliverySubDistrict +
          " ???????????????" +
          transasction.deliveryDistrict +
          " " +
          transasction.deliveryProvince;
      }

      ws.cell(row, 5).string(transasction.deliveryAddressInfo).style(bodyLeft);

      ws.cell(row, 6).string(address).style(bodyLeft);

      ws.cell(row, 7).string(transasction.deliveryZipcode).style(bodyLeft);

      let codAmt = 0;

      if (transasction.paymentType == "COD") {
        codAmt = transasction.netAmount;
      }

      ws.cell(row, 8).number(codAmt).style(bodyRight);

      let productDesc = "";

      // for (let index = 0; index < transasction.details.length; index++) {
      //     const detail = transasction.details[index];

      //     if (index > 0) {
      //         productDesc += '-------------------\n';
      //     }

      //     if (!detail.attr1 && !detail.attr2) {
      //         productDesc += detail.name + '   ??????????????? ' + detail.qty + '\n';
      //     }

      //     if (detail.attr1 && !detail.attr2) {
      //         productDesc += detail.name + '\n';
      //         productDesc += detail.attr1name + ' : ' + detail.attr1 + '   ??????????????? ' + detail.qty + '\n';
      //     }

      //     if (detail.attr1 && detail.attr2) {
      //         productDesc += detail.name + '\n';
      //         productDesc += detail.attr1name + ' : ' + detail.attr1 + '\n';
      //         productDesc += detail.attr2name + ' : ' + detail.attr2 + '   ??????????????? ' + detail.qty + '\n';
      //     }
      // }

      ws.cell(row, 9).string(transasction.remark).style(bodyLeft);

      ws.cell(row, 10).string(transasction.orderNo).style(bodyLeft);

      ws.cell(row, 11).string("").style(bodyLeft);

      row++;
    }

    console.log("END");

    // ws.cell(1, 1).number(100);
    // // ????????????????????????????????????????????????????????? 100 ????????????????????? cell A1
    // ws.cell(1, 2).string('some text');
    // //??????????????????????????????????????????????????????????????? some text ???????????? cell B1
    // ws.cell(1, 3).formula('A1+A2');
    // //?????????????????????????????????????????? A1+A2 ?????? cell C1
    // ws.cell(1, 4).bool(true);
    // //??????????????????????????????????????? boolean true ?????? cell D1

    ws.column(1).setWidth(5);
    ws.column(2).setWidth(30);
    ws.column(3).setWidth(15);
    ws.column(4).setWidth(15);
    ws.column(5).setWidth(40);
    ws.column(6).setWidth(40);
    ws.column(7).setWidth(10);
    ws.column(8).setWidth(15);
    ws.column(9).setWidth(15);
    ws.column(10).setWidth(15);

    wb.write("ExcelFile.xlsx", res);
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function exportFlashTransaction(req, res) {
  const conn = await pool.getConnection();

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(__dirname + "/flash_template.xlsx");
    const worksheet = workbook.getWorksheet(1);

    req.body.page = undefined;

    let criteria = req.body;

    let result = await orderDao.search(conn, criteria);

    for (let index = 0; index < result.length; index++) {
      const transasction = result[index];

      let address = transasction.deliveryAddressInfo;

      if (transasction.deliveryProvince.includes("?????????????????????")) {
        address +=
          "????????????" +
          transasction.deliverySubDistrict +
          " ?????????" +
          transasction.deliveryDistrict +
          " " +
          transasction.deliveryProvince;
      } else {
        address +=
          "????????????" +
          transasction.deliverySubDistrict +
          " ???????????????" +
          transasction.deliveryDistrict +
          " " +
          transasction.deliveryProvince;
      }

      const row = worksheet.getRow(index + 2);
      row.getCell(1).value = transasction.orderNo;
      row.getCell(2).value = transasction.deliveryName;
      row.getCell(3).value = address;
      row.getCell(4).value = transasction.deliveryZipcode;
      row.getCell(5).value = transasction.deliveryContact;

      if (transasction.paymentType == "COD") {
        const codAmt = parseInt(transasction.netAmount.toString(), 10);
        row.getCell(7).value = codAmt;
      }

      row.getCell(8).value = transasction.weightKg;

      // transasction.details = await transactionDao.getDetails(
      //   conn,
      //   transasction.id
      // );

      let remark = transasction.remark;

      // for (let index = 0; index < transasction.details.length; index++) {
      //   const item = transasction.details[index];

      //   remark += item.sku + "=" + item.qty + " ,";
      // }

      // remark += "-";

      row.getCell(15).value = remark;
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return res.status(200).send(buffer);
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function exportJTTransaction(req, res) {
  const conn = await pool.getConnection();

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(__dirname + "/jt_template2.xlsx");
    const worksheet = workbook.getWorksheet(1);

    req.body.page = undefined;

    let criteria = req.body;

    let result = await orderDao.search(conn, criteria);

    for (let index = 0; index < result.length; index++) {
      const transasction = result[index];

      let address = transasction.deliveryAddressInfo;
      let district = transasction.deliveryDistrict;
      if (transasction.deliveryProvince.includes("?????????????????????")) {
        district = "????????? " + transasction.deliveryDistrict;
      }

      const row = worksheet.getRow(index + 2);
      row.getCell(2).value = transasction.orderNo;
      row.getCell(3).value = transasction.weightKg;
      row.getCell(4).value = transasction.deliveryName;
      row.getCell(5).value = transasction.deliveryContact;
      row.getCell(6).value = transasction.deliveryProvince;
      row.getCell(7).value = district;
      row.getCell(8).value = transasction.deliverySubDistrict;
      row.getCell(9).value = transasction.deliveryZipcode;
      row.getCell(10).value = address;
      row.getCell(11).value = 3;
      row.getCell(12).value = transasction.netAmount;

      if (transasction.paymentType == "COD") {
        row.getCell(14).value = transasction.netAmount;
      }

      // transasction.details = await transactionDao.getDetails(
      //   conn,
      //   transasction.id
      // );

      let remark = transasction.remark;

      // for (let index = 0; index < transasction.details.length; index++) {
      //   const item = transasction.details[index];

      //   remark += item.name + " : " + item.qty + " ,";
      // }

      // remark += "-";

      row.getCell(13).value = remark;
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return res.status(200).send(buffer);
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}

async function exportOrder(req, res) {
  const conn = await pool.getConnection();

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(__dirname + "/EXPORT_TEMPLATE.xlsx");
    const worksheet = workbook.getWorksheet("sheet1");

    req.body.page = undefined;

    let criteria = req.body;

    let result = await orderDao.exportOrder(conn, criteria);

    for (let index = 0; index < result.length; index++) {
      const transasction = result[index];

      const row = worksheet.getRow(index + 2);
      row.getCell(1).value = index + 1;
      row.getCell(2).value = transasction.orderNo;
      row.getCell(3).value = transasction.orderDate;
      row.getCell(4).value = transasction.paymentType;
      row.getCell(5).value = transasction.deliveryContact;
      row.getCell(6).value = transasction.deliveryName;
      row.getCell(7).value = transasction.deliveryAddressInfo;
      row.getCell(8).value = transasction.deliveryDistrict;
      row.getCell(9).value = transasction.deliverySubDistrict;
      row.getCell(10).value = transasction.deliveryProvince;
      row.getCell(11).value = transasction.deliveryZipcode;
      row.getCell(12).value = transasction.remark;

      transasction.orderitem = JSON.parse(transasction.orderitem);

      let orderItem = "";
      for (let index2 = 0; index2 < transasction.orderitem.length; index2++) {
        const item = transasction.orderitem[index2];
        orderItem += item.sku + "=" + item.qty;
        if (index2 + 1 < transasction.orderitem.length) {
          orderItem += " , ";
        }
      }

      row.getCell(13).value = orderItem;

      row.getCell(14).value = transasction.deliveryPrice;
      row.getCell(15).value =
        transasction.itemDiscountAmount + transasction.billDiscountAmount;
      row.getCell(16).value = transasction.netAmount;

      row.getCell(17).value = transasction.createBy;
      row.getCell(18).value = transasction.activityOwner;

      row.getCell(19).value = transasction.saleChannel;
      row.getCell(20).value = transasction.saleChannelName;

      row.getCell(21).value = transasction.agentCode;
      row.getCell(22).value = transasction.agentName;
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return res.status(200).send(buffer);
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  } finally {
    conn.release();
  }
}
