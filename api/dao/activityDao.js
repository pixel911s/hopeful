"use strict";

module.exports = {
  get,
  save,
  updateActivityStatus,
  getOnDueCount,
  getOverDueCount,
  getIncomingCount,
  getCustomIncomingCount,
  getOnDueList,
  getOverDueList,
  getIncomingList,
  getCustomIncomingList,
  getOwnerCustomer,
  cancelActivityByOrderId
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

async function getOnDueCount(conn, ownerUser) {
  //=== หาจำนวน Activity ของวันที่ปัจจุบัน เฉพาะที่ยังไม่ปิดการขาย และ ไม่ถูกยกเลิก
  try {
    let sql =
      "select count(id) as qty from activity where dueDate=current_date and activityStatusId not in (3,4) and ownerUser=?";   
    const result = await conn.query(sql, [ownerUser]);

    return result[0];
  } catch (err) {
    throw err;
  }
}

async function getOverDueCount(conn, ownerUser) {
  //=== หาจำนวน Activity ที่เกินกำหนด เฉพาะที่ยังไม่ปิดการขาย และ ไม่ถูกยกเลิก
  try {
    let sql =
      "select count(id) as qty from activity where dueDate<current_date and activityStatusId not in (3,4) and ownerUser=?";   
    const result = await conn.query(sql, [ownerUser]);

    return result[0];
  } catch (err) {
    throw err;
  }
}

async function getIncomingCount(conn, ownerUser) {
  //=== หาจำนวน Activity ที่ยังไม่ถึงกำหนด เฉพาะที่ยังไม่ปิดการขาย และ ไม่ถูกยกเลิก
  try {
    let sql =
      "select count(id) as qty from activity where dueDate>current_date and activityStatusId not in (3,4) and ownerUser=?";   
    const result = await conn.query(sql, [ownerUser]);

    return result[0];
  } catch (err) {
    throw err;
  }
}

async function getCustomIncomingCount(conn, ownerUser, incomingDay) {
  //=== หาจำนวน Activity ที่ยังไม่ถึงกำหนด เฉพาะที่ยังไม่ปิดการขาย และ ไม่ถูกยกเลิก
  try {
    let sql =
      "select count(id) as qty from activity where dueDate>current_date and dueDate<=addDate(current_date,?) and activityStatusId not in (3,4) and ownerUser=?";   
    const result = await conn.query(sql, [ownerUser, incomingDay]);

    return result[0];
  } catch (err) {
    throw err;
  }
}

async function getOnDueList(conn, ownerUser) {
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
    sql += " where dueDate=current_date and activityStatusId not in (3,4) and ownerUser=?";
    sql+=" order by a.customerId";
    const result = await conn.query(sql, [ownerUser]);

    return result[0];
  } catch (err) {
    throw err;
  }
}

async function getOverDueList(conn, ownerUser) {
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
    sql += " where dueDate<current_date and activityStatusId not in (3,4) and ownerUser=?";
    sql+=" order by a.dueDate desc,a.customerId";
    const result = await conn.query(sql, [ownerUser]);

    return result[0];
  } catch (err) {
    throw err;
  }
}

async function getIncomingList(conn, ownerUser) {
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
    sql += " where dueDate>current_date and activityStatusId not in (3,4) and ownerUser=?";
    sql+=" order by a.dueDate,a.customerId";
    const result = await conn.query(sql, [ownerUser]);

    return result[0];
  } catch (err) {
    throw err;
  }
}

async function getCustomIncomingList(conn, ownerUser, incomingDay) {
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
    sql += " where dueDate>current_date and dueDate<=addDate(current_date,?) and activityStatusId not in (3,4) and ownerUser=?";
    sql+=" order by a.dueDate,a.customerId";
    const result = await conn.query(sql, [incomingDay, ownerUser]);

    return result[0];
  } catch (err) {
    throw err;
  }
}

async function getOwnerCustomer(conn, customerId) {
  try {
    let sql =
      "select username from userCustomer where customerId=?";
    const result = await conn.query(sql, [customerId]);
    return result;
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