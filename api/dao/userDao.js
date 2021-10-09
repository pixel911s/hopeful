"use strict";

module.exports = {
  get,
  search,
  count,
  save,
  deleteUserFunction,
  saveUserFunction,

  getUserFunction,

  changePassword,

  getBusinessById,

  saveAgent,
  deleteAgent,
  getAgent
};

async function getBusinessById(conn, id) {
  try {
    let sql = "select * from business where id = ?";
    const result = await conn.query(sql, [id]);

    return result[0];
  } catch (err) {
    throw err;
  }
}

async function get(conn, id) {
  try {
    let sql = "select * from user where username = ?";
    const result = await conn.query(sql, [id]);

    return result[0];
  } catch (err) {
    throw err;
  }
}

async function getUserFunction(conn, username) {
  try {
    let sql = "select * from userFunction where username = ?";
    const result = await conn.query(sql, [username]);

    return result;
  } catch (err) {
    throw err;
  }
}

async function count(conn, criteria) {
  try {
    let params = [];

    let sql =
      "select count(u.username) as totalRecord from user u left join business b on u.businessId = b.id where 1=1";

    if (criteria.status != undefined) {
      sql += " and u.status = ?";
      params.push(criteria.status);
    }

    if (criteria.businessType != undefined) {
      sql += " and b.businessType = ?";
      params.push(criteria.businessType);
    }

    if (criteria.agent != undefined) {
      sql += " and b.id = ?";
      params.push(criteria.agent);
    }

    if (criteria.username) {
      sql += " and u.username like ?";
      params.push("%" + criteria.username + "%");
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
      "select u.*, b.businessType, b.name as agentName from user u left join business b on u.businessId = b.id where 1=1";

    if (criteria.status != undefined) {
      sql += " and u.status = ?";
      params.push(criteria.status);
    }

    if (criteria.businessType != undefined) {
      sql += " and b.businessType = ?";
      params.push(criteria.businessType);
    }

    if (criteria.agent != undefined) {
      sql += " and b.id = ?";
      params.push(criteria.agent);
    }

    if (criteria.username) {
      sql += " and u.username like ?";
      params.push("%" + criteria.username + "%");
    }

    sql += " limit " + startRecord + "," + criteria.size;

    let result = await conn.query(sql, params);

    return result;
  } catch (e) {
    throw e;
  }
}

async function changePassword(conn, model) {
  try {
    let params = [];

    let sql = "UPDATE `user` SET ";

    sql += "password = ? ";
    params.push(model.password);

    sql += " where username = ?";
    params.push(model.username);

    await conn.query(sql, params);

    return true;
  } catch (e) {
    throw e;
  }
}

async function save(conn, model) {
  try {
    if (model.id) {
      //update

      let params = [];

      let sql = "UPDATE `user` SET ";

      sql += "status = ? ";
      params.push(model.status);

      sql += ",updateBy = ? ";
      params.push(model.updateUser);

      sql += ",updateDttm = ? ";
      params.push(new Date());

      if (model.password) {
        sql += ",password = ? ";
        params.push(model.password);
      }

      if (model.businessId) {
        sql += ",businessId = ? ";
        params.push(model.businessId);
      }

      sql += " where username = ?";
      params.push(model.id);

      await conn.query(sql, params);
    } else {
      //insert
      let sql =
        "INSERT INTO `user` (`username`,`password`,`status`, `createBy`, `createDttm`, `updateBy`, `updateDttm`, `loginType`, businessId)";
      sql += "  VALUES (?,?,?,?,?,?,?,?,?)";

      await conn.query(sql, [
        model.username.toLowerCase(),
        model.password,
        model.status,
        model.updateUser,
        new Date(),
        model.updateUser,
        new Date(),
        "SYSTEM",
        model.businessId,
      ]);
    }

    return true;
  } catch (e) {
    throw e;
  }
}

async function saveUserFunction(conn, username, functionId) {
  try {
    //insert
    let sql = "INSERT INTO `userFunction` (`username`,`functionCode`)";
    sql += "  VALUES (?,?)";

    await conn.query(sql, [username, functionId]);

    return true;
  } catch (e) {
    throw e;
  }
}

async function deleteUserFunction(conn, username) {
  try {
    //insert
    let sql = "DELETE from userFunction where username = ?";

    await conn.query(sql, [username]);

    return true;
  } catch (e) {
    throw e;
  }
}

async function deleteAgent(conn, username) {
  try {
    //delete
    let sql = "DELETE from userAgent where username = ?";

    await conn.query(sql, [username]);

    return true;
  } catch (e) {
    throw e;
  }
}

async function saveAgent(conn, username, createBy,  model) {
  try {
    //insert
    let sql = "INSERT INTO `userAgent` (`username`,`agentId`,`createBy`,`createDate`)";
    sql += "  VALUES (?,?,?,?)";

    await conn.query(sql, [username, model.agentId, createBy, new Date()]);

    return true;
  } catch (e) {
    throw e;
  }
}

async function getAgent(conn, username) {
  try {
    let sql = "select * from userAgent where userName = ?";
    const result = await conn.query(sql, [username]);

    return result;
  } catch (err) {
    throw err;
  }
}