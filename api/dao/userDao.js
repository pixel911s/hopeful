"use strict";

module.exports = {
  get,
  getById,
  search,
  count,
  save,
  deleteUserFunction,
  saveUserFunction,

  getUserFunction,
  getShopById,

  changePassword,
  removeUser,

  getByTel,
};

async function getShopById(conn, id) {
  try {
    let sql = "select * from shop where id = ?";
    const result = await conn.query(sql, [id]);

    return result[0];
  } catch (err) {
    throw err;
  }
}

async function getById(conn, id) {
  try {
    let sql =
      "select u.*, b.name as branchName, b.isHQ from user u left join branch b on u.branchId = b.id where u.username = ?";
    const result = await conn.query(sql, [id]);

    return result[0];
  } catch (err) {
    throw err;
  }
}

async function getByTel(conn, tel) {
  try {
    let sql = "select * from user where tel = ?";
    const result = await conn.query(sql, [tel]);

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
    let sql = "select * from user_function where username = ?";
    const result = await conn.query(sql, [username]);

    return result;
  } catch (err) {
    throw err;
  }
}

async function count(conn, criteria) {
  try {
    let params = [];

    let sql = "select count(username) as totalRecord from user where 1=1";

    if (criteria.status != undefined) {
      sql += " and status = ?";
      params.push(criteria.status);
    }

    if (criteria.branch != undefined) {
      sql += " and branchId = ?";
      params.push(criteria.branch);
    }

    if (criteria.username) {
      sql += " and username like ?";
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
      "select u.*, b.name as branchName from user u left join branch b on u.branchId = b.id where 1=1";

    if (criteria.status != undefined) {
      sql += " and u.status = ?";
      params.push(criteria.status);
    }

    if (criteria.branch != undefined) {
      sql += " and u.branchId = ?";
      params.push(criteria.branch);
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

      sql += ",updateUser = ? ";
      params.push(model.updateUser);

      sql += ",updateDttm = ? ";
      params.push(new Date());

      if (model.password) {
        sql += ",password = ? ";
        params.push(model.password);
      }

      if (model.branchId) {
        sql += ",branchId = ? ";
        params.push(model.branchId);
      }

      sql += " where username = ?";
      params.push(model.id);

      await conn.query(sql, params);
    } else {
      //insert
      let sql =
        "INSERT INTO `user` (`username`,`password`,`status`, `createUser`, `createDttm`, `updateUser`, `updateDttm`, `loginType`, branchId)";
      sql += "  VALUES (?,?,?,?,?,?,?,?,?)";

      await conn.query(sql, [
        model.username,
        model.password,
        model.status,
        model.updateUser,
        new Date(),
        model.updateUser,
        new Date(),
        "SYSTEM",
        model.branchId,
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
    let sql = "INSERT INTO `user_function` (`username`,`functionCode`)";
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
    let sql = "DELETE from user_function where username = ?";

    await conn.query(sql, [username]);

    return true;
  } catch (e) {
    throw e;
  }
}

async function removeUser(conn, shopId) {
  try {
    //insert
    let sql = "DELETE from user where shopId = ? and isOwner = 0";

    await conn.query(sql, [shopId]);

    return true;
  } catch (e) {
    throw e;
  }
}
