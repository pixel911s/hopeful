"use strict";

module.exports = {
  get,
  save,
  updateActivityStatus, 
  getOwnerCustomer,
  cancelActivityByOrderId,
  inquiry,
  getActivityDateConfig
};

async function get(conn, id) {
  try {
    let sql =
      "select a.* ";
    sql += ",b.code as productCode, b.name as productName";
    sql += ",c.code as agentCode, c.name as agentName";
    sql += ",d.code as customerCode, d.name as customerName";
    sql += ",e.status";
    sql += " from activity a ";
    sql += " left join product b on a.productId=b.id";
    sql += " left join business c on a.agentId=c.id";
    sql += " left join business d on a.customerId=d.id";
    sql += " left join activityStatus e on a.activityStatusId=e.id";
    sql += " where id = ?";
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
        "INSERT INTO `activity` (`code`,`description`,`productId`,`remainingDay`,`dueDate`,`agentId`,`customerId`,`ownerUser`,`activityStatusId`,`refOrderId`,`refOrderItemId`, `createBy`, `createDate`) ";
      sql += "  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";

      let _result = await conn.query(sql, [
        model.code,
        model.description.trim(),
        model.productId,
        model.remainingDay,
        model.dueDate,
        model.agentId,
        model.customerId,
        model.ownerUser,
        model.activityStatusId,
        model.refOrderId,
        model.refOrderItemId,
        model.username,
        new Date()
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

async function updateActivityStatus(conn, id, activityStatusId, username) {
  try {
    //Update Activity Status
    let sql = "update activity set `activityStatusId`=?, `updateBy`=?, `updateDate`=? where id = ?";

    await conn.query(sql, [
      activityStatusId,
      username,
      new Date(),
      id]);

    return true;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}

async function getOwnerCustomer(conn, customerId) {
  try {
    let sql =
      "select activityOwner from business where id=?";
    const result = await conn.query(sql, [customerId]);
    return result[0];
  } catch (err) {
    throw err;
  }
}

async function cancelActivityByOrderId(conn, orderId, username) {
  try {
    //Update Activity Status
    let sql = "update activity set `activityStatusId`=4, `updateBy`=?, `updateDate`=? where refOrderId = ?";

    await conn.query(sql, [
      username,
      new Date(),
      orderId]);

    return true;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}

async function inquiry(conn, username, fillterType, dayCondition, userAgents, isSupervisor, customerId, isCount, page, size) {
  try {

    let startRecord = (page - 1) * size;

    console.log("Params : ", username, fillterType, dayCondition, userAgents, isSupervisor, customerId, isCount);

    let params = [];

    let sql = "select count(id) as qty from activity a ";
    if (isCount == false) {
      sql = "select a.* ";
      sql += ",b.code as productCode, b.name as productName";
      sql += ",c.code as agentCode, c.name as agentName";
      sql += ",d.code as customerCode, d.name as customerName";
      sql += ",e.status";
      sql += " from activity a ";
      sql += " left join product b on a.productId=b.id";
      sql += " left join business c on a.agentId=c.id";
      sql += " left join business d on a.customerId=d.id";
      sql += " left join activityStatus e on a.activityStatusId=e.id";
    }

    sql += " where 1=1 ";
    if (fillterType == 1) {
      //=== วันนี้
      sql += " and dueDate=current_date";
    } else {
      if (fillterType == 2) {
        //=== เกินกำหนด
        sql += " and dueDate<current_date";
      } else {
        if (fillterType == 3) {
          //=== ยังไม่ถึงกำหนด
          sql += " and dueDate>current_date";
        } else {
          //=== User Define
          if (dayCondition > 0) {
            //=== ก่อนถึงกำหนดกี่วัน
            sql += " and dueDate>current_date and dueDate<=addDate(current_date," + dayCondition + ")";
          } else {
            //==== เลยกำหนดกี่วัน
            sql += " and dueDate<current_date and dueDate>=addDate(current_date," + dayCondition + ")";
          }
        }
      }
    }

    if (isSupervisor == false) {
      sql += " and (a.ownerUser=? or a.ownerUser is null)";
      params.push(username)
    }

    if (customerId != null) {
      sql += " and a.customerId=?"
      params.push(customerId);
    }

    sql += " and activityStatusId not in (3,4)";

    // sql += " and a.agentId in (?)";
    // params.push(userAgents);

    sql += " and a.agentId in (";
    for (let index = 0; index < userAgents.length; index++) {
      sql += userAgents[index];
      if (index != userAgents.length - 1) {
        sql += ",";
      }
    }
    sql += ")"

    if (isCount == false) {
      sql += " order by a.dueDate,a.customerId";

      sql += " limit " + startRecord + "," + size;
    }

    console.log(sql);

    console.log(params);

    const result = await conn.query(sql, [params]);

    return result;
  } catch (err) {
    throw err;
  }
}

async function getActivityDateConfig(conn, username) {
  try {
    let sql =
      "select * from activityDateConfig where username=?";
    const result = await conn.query(sql, [username]);
    return result;
  } catch (err) {
    throw err;
  }
}
