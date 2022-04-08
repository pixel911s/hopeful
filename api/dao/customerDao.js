"use strict";

module.exports = {
  get,
  getByMobileNo,
  save,
  deleteCustomer,
  addAddress,
  deleteAddress,
  getAddress,
  updateOwner,
};

async function getByMobileNo(conn, criteria) {
  try {
    let sql = "select * from business where businessType = 'C' and mobile = ?";

    let params = [];

    params.push(criteria.mobile);

    if (criteria.userAgents.length > 0) {
      let userAgents = [];
      for (let index = 0; index < criteria.userAgents.length; index++) {
        const element = criteria.userAgents[index];
        userAgents.push(element.id);
      }
      sql += " and ownerId in (?)";
      params.push(userAgents);
    }

    const result = await conn.query(sql, params);

    return result[0];
  } catch (err) {
    throw err;
  }
}

async function get(conn, id) {
  try {
    let sql = "select * from business where businessType = 'C' and id = ?";
    const result = await conn.query(sql, [id]);

    return result[0];
  } catch (err) {
    throw err;
  }
}

async function updateOwner(conn, model) {
  try {
    if (model.id) {
      let params = [];

      let sql =
        "UPDATE `business` SET `activityOwner` = ? ,unlockDate = date_add(NOW(),interval 1 minute) WHERE `id` = ?";

      params.push(model.activityOwner);
      params.push(model.id);

      await conn.query(sql, params);
    }

    return model;
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

      let sql =
        "UPDATE `business` SET socialName = ?,`name` = ?, `mobile` = ?, `contactName` = ?, `email` = ?, `memo` = ?, `sex` = ?, `age` = ?, `dob` = ?, `updateBy` = ?, `updateDate` = ? WHERE `id` = ?";

      params.push(model.socialName ? model.socialName.trim() : null);
      params.push(model.name.trim());
      params.push(model.mobile.trim());
      params.push(model.contactName ? model.contactName.trim() : "");
      params.push(model.email ? model.email.trim() : "");
      params.push(model.memo ? model.memo.trim() : "");
      params.push(model.sex);
      params.push(model.age);
      params.push(model.dob ? new Date(model.dob) : null);
      params.push(model.username);
      params.push(new Date());
      params.push(model.id);

      await conn.query(sql, params);
    } else {
      //insert
      let sql =
        "INSERT INTO `business` (socialName,`businessType`,`ownerId`,`name`,`mobile`, `createBy`, `createDate`, `updateBy`, `updateDate`) ";
      sql += "  VALUES (?,?,?,?,?,?,?,?,?)";

      let _result = await conn.query(sql, [
        model.socialName ? model.socialName.trim() : null,
        "C",
        model.ownerId,
        model.name.trim(),
        model.mobile.trim(),
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

async function deleteCustomer(conn, id) {
  try {
    //delete
    let sql = "delete from business where id = ?";

    await conn.query(sql, [id]);

    return true;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}

async function addAddress(conn, model) {
  try {
    //insert
    let sql =
      "INSERT INTO `address` (addressType,`businessId`, `name`, `info`, `district`, `subDistrict`, `province`, `zipcode`, `contact`, createBy, createDate, updateBy, updateDate)";
    sql += "  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";

    await conn.query(sql, [
      model.addressType,
      model.businessId,
      model.name.trim(),
      model.info.trim(),
      model.district,
      model.subDistrict,
      model.province,
      model.zipcode,
      model.contact.trim(),
      model.username,
      new Date(),
      model.username,
      new Date(),
    ]);

    return true;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}

async function deleteAddress(conn, id) {
  try {
    //delete
    let sql = "delete from address where id = ?";

    await conn.query(sql, [id]);

    return true;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}

async function getAddress(conn, customerId) {
  try {
    let sql = "select * from address where businessId=?";
    sql += " order by createDate desc";

    let result = await conn.query(sql, [customerId]);

    return result;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}
