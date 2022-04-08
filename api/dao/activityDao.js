"use strict";

var DateUtil = require("../utils/dateUtil");

module.exports = {
  get,
  save,
  updateActivityStatus,
  getOwnerCustomer,
  cancelActivityByOrderId,
  inquiry,
  getActivityDateConfig,
  updateOwner,
  clearOwner,
  updateDueDate,
  updateEndOfDose,
};

async function get(conn, id) {
  try {
    let sql = "select a.* ";
    sql += ",b.code as productCode, b.name as productName";
    sql += ",c.code as agentCode, c.name as agentName";
    sql += ",d.code as customerCode, d.name as customerName, d.activityOwner";
    sql += ",e.status";
    sql += " from activity a ";
    sql += " left join product b on a.productId=b.id";
    sql += " left join business c on a.agentId=c.id";
    sql += " left join business d on a.customerId=d.id";
    sql += " left join activitystatus e on a.activityStatusId=e.id";
    sql += " where a.id = ?";
    const result = await conn.query(sql, [id]);

    return result[0];
  } catch (err) {
    throw err;
  }
}

async function save(conn, model) {
  try {
    let _id = 0;

    if (model.id) {
      //update

      _id = model.id;

      let params = [];

      let sql =
        "UPDATE `activity` SET `description` = ?, `productId` = ?, `remainingDay` = ?, `dueDate` = ?, `agentId` = ?, `customerId` = ?, `ownerUser` = ?, `activityStatusId` = ?, `updateBy` = ?, `updateDate` = ? WHERE `id` = ?";

      params.push(model.description.trim());
      params.push(model.productId);
      params.push(model.reminingDay);
      params.push(model.dueDate);
      params.push(model.agentId);
      params.push(model.customerId);
      params.push(model.ownerUser);
      params.push(model.activityStatusId);
      params.push(model.username);
      params.push(new Date());
      params.push(model.id);

      await conn.query(sql, params);
    } else {
      //insert
      let sql =
        "INSERT INTO `activity` (`code`,`description`,`productId`,`remainingDay`,`dueDate`,endOfDose,`agentId`,`customerId`,`ownerUser`,`activityStatusId`,`refOrderId`,`refOrderItemId`, `createBy`, `createDate`,`statusDate0`) ";
      sql += "  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

      let _result = await conn.query(sql, [
        model.code,
        model.description.trim(),
        model.productId,
        model.remainingDay,
        model.dueDate ? new Date(model.dueDate) : null,
        model.endOfDose ? new Date(model.endOfDose) : null,
        model.agentId,
        model.customerId,
        model.ownerUser,
        model.activityStatusId,
        model.refOrderId,
        model.refOrderItemId,
        model.username,
        new Date(),
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

async function updateActivityStatus(
  conn,
  id,
  activityStatusId,
  username,
  date0,
  date1,
  date2,
  date3,
  date4
) {
  try {
    //Update Activity Status

    let sql =
      "update activity set `activityStatusId`=?, `updateBy`=?, `statusDate0`=?, `statusDate1`=?, `statusDate2`=?, `statusDate3`=?, `statusDate4`=?, `updateDate`=? where id = ?";

    await conn.query(sql, [
      activityStatusId,
      username,
      date0,
      date1,
      date2,
      date3,
      date4,
      new Date(),
      id,
    ]);

    return true;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}

async function getOwnerCustomer(conn, customerId) {
  try {
    let sql = "select activityOwner from business where id=?";
    const result = await conn.query(sql, [customerId]);
    return result[0];
  } catch (err) {
    throw err;
  }
}

async function cancelActivityByOrderId(conn, orderId, username) {
  try {
    //Update Activity Status
    let sql =
      "update activity set `activityStatusId`=4, `updateBy`=?, `updateDate`=? where refOrderId = ?";

    await conn.query(sql, [username, new Date(), orderId]);

    return true;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}

async function inquiry(conn, criteria) {
  try {
    let fromDate = new Date();
    let toDate = new Date();

    let startRecord = (criteria.page - 1) * criteria.size;

    let params = [];

    let sql = "select count(a.id) as qty from activity a ";

    if (criteria.isCount == false) {
      sql = "select a.* ";
      sql += ",b.code as productCode, b.name as productName";
      sql += ",c.code as agentCode, c.name as agentName";
      sql += ",d.code as customerCode, d.name as customerName, d.mobile";
      sql += ",e.status";
      sql += " from activity a ";

      sql += " left join product b on a.productId=b.id";
      sql += " left join activitystatus e on a.activityStatusId=e.id";
    }

    if (criteria.isCount == false) {
      sql += " left join business c on a.agentId=c.id";
    }

    if (criteria.isCount == false || criteria.customerName || criteria.tel) {
      sql += " left join business d on a.customerId=d.id";
    }

    sql += " where 1=1 ";

    if (criteria.fillterType == 1) {
      //=== วันนี้
      sql += " and dueDate between ? and ?";

      params.push(DateUtil.convertForSqlFromDate(fromDate));
      params.push(DateUtil.convertForSqlToDate(toDate));
    } else {
      if (criteria.fillterType == 2) {
        //=== เกินกำหนด
        sql += " and dueDate<current_date";
      } else {
        if (criteria.fillterType == 3) {
          //=== ยังไม่ถึงกำหนด
          sql += " and dueDate>current_date";
        } else {
          //=== User Define

          sql += " and dueDate between ? and ?";

          if (criteria.dayCondition > 0) {
            //=== ก่อนถึงกำหนดกี่วัน
            toDate.setDate(toDate.getDate() + criteria.dayCondition);
            params.push(DateUtil.convertForSqlFromDate(fromDate));
            params.push(DateUtil.convertForSqlToDate(toDate));
          } else {
            //==== เลยกำหนดกี่วัน
            fromDate.setDate(toDate.getDate() + criteria.dayCondition);
            params.push(DateUtil.convertForSqlFromDate(fromDate));
            params.push(DateUtil.convertForSqlToDate(toDate));
          }
        }
      }
    }

    if (criteria.isSupervisor == false) {
      sql += " and (a.ownerUser=? or a.ownerUser is null)";
      params.push(criteria.username);
    }

    if (criteria.customerId != null) {
      sql += " and a.customerId=?";
      params.push(criteria.customerId);
    }

    if (criteria.tel != null && criteria.tel != "") {
      sql += " and d.mobile like ?";
      params.push("%" + criteria.tel + "%");
    }

    if (criteria.owner != null && criteria.owner != "") {
      sql += " and a.ownerUser like ?";
      params.push("%" + criteria.owner + "%");
    }

    if (criteria.code != null && criteria.code != "") {
      sql += " and a.code like ?";
      params.push("%" + criteria.code + "%");
    }

    if (criteria.customerName != null && criteria.customerName != "") {
      sql += " and d.name like ?";
      params.push("%" + criteria.customerName + "%");
    }

    if (criteria.eod == 1) {
      sql += " and a.endOfDose < NOW()";
    } else if (criteria.eod == 0) {
      sql += " and a.endOfDose > NOW()";
    }

    if (criteria.status && criteria.status.length > 0) {
      let status = [];

      for (let index = 0; index < criteria.status.length; index++) {
        const item = criteria.status[index];
        status.push(item.id);
      }
      sql += " and a.activityStatusId in (?)";
      params.push(status);
    }

    if (criteria.agent) {
      sql += " and a.agentId = ?";
      params.push(criteria.agent);
    } else {
      sql += " and a.agentId in (?)";
      params.push(criteria.userAgents);
    }

    if (!criteria.isCount) {
      sql += " order by a.dueDate,a.customerId";

      sql += " limit " + startRecord + "," + criteria.size;
    }

    const result = await conn.query(sql, params);

    return result;
  } catch (err) {
    throw err;
  }
}

async function getActivityDateConfig(conn, username) {
  try {
    let sql = "select * from activitydateconfig where username=?";
    const result = await conn.query(sql, [username]);
    return result;
  } catch (err) {
    throw err;
  }
}

async function updateOwner(conn, customerId, ownerUser, username) {
  try {
    //Update Activity Status
    let sql =
      "update activity set `ownerUser`=?, `updateBy`=?, `updateDate`=? where customerId = ? and activityStatusId != 3 and activityStatusId != 4";

    await conn.query(sql, [ownerUser, username, new Date(), customerId]);

    return true;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}

async function updateDueDate(conn, customerId, dueDate) {
  try {
    //Update Activity Status
    let sql =
      "update activity set `dueDate`= NOW() + INTERVAL ? DAY where customerId = ? and activityStatusId != 3 and activityStatusId != 4 and NOW() > dueDate + INTERVAL ? DAY";

    await conn.query(sql, [dueDate, customerId, dueDate]);

    return true;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}

async function updateEndOfDose(conn, id, dueDate) {
  try {
    //Update Activity Status
    let sql = "update activity set `endOfDose`= ? where id = ? ";

    await conn.query(sql, [new Date(dueDate), id]);

    return true;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}

async function clearOwner(conn, date) {
  try {
    //Update Activity Status
    let sql =
      "update activity set `ownerUser`= null, `updateBy`= 'SYSTEM', `updateDate`= NOW() where NOW() > dueDate + INTERVAL ? DAY";

    await conn.query(sql, [date]);

    return true;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}
