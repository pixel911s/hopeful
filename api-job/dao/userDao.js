"use strict";

module.exports = {
  get,
  getHQUser,
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
  getAgent,
  getAgentObj,

  getUseragent,

  getAllUsername,
};

async function getAllUsername(conn, criteria) {
  try {
    let sql = "select username from user";
    const result = await conn.query(sql, []);

    return result;
  } catch (err) {
    throw err;
  }
}

async function getHQUser(conn, criteria) {
  try {
    let params = [];
    let sql =
      "select u.*, b.businessType, b.name as agentName from user u left join business b on u.businessId = b.id where b.businessType = 'H'";

    if (criteria.haveLineToken) {
      sql += " and u.lineNotifyToken is not null";
    }

    const result = await conn.query(sql, params);

    return result;
  } catch (err) {
    throw err;
  }
}

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
    let sql = "select * from userfunction where username = ?";
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

      if (model.lineNotifyToken) {
        sql += ",lineNotifyToken = ? ";
        params.push(model.lineNotifyToken);
      }

      sql += " where username = ?";
      params.push(model.id);

      await conn.query(sql, params);
    } else {
      //insert
      let sql =
        "INSERT INTO `user` (`username`,`password`,`status`, `createBy`, `createDttm`, `updateBy`, `updateDttm`, `loginType`, businessId, lineNotifyToken)";
      sql += "  VALUES (?,?,?,?,?,?,?,?,?,?)";

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
        model.lineNotifyToken,
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
    let sql = "INSERT INTO `userfunction` (`username`,`functionCode`)";
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
    let sql = "DELETE from userfunction where username = ?";

    await conn.query(sql, [username]);

    return true;
  } catch (e) {
    throw e;
  }
}

async function deleteAgent(conn, username) {
  try {
    //delete
    let sql = "DELETE from useragent where username = ?";

    await conn.query(sql, [username]);

    return true;
  } catch (e) {
    throw e;
  }
}

async function saveAgent(conn, username, createBy, model) {
  try {
    //insert
    let sql =
      "INSERT INTO `useragent` (`username`,`agentId`,`createBy`,`createDate`)";
    sql += "  VALUES (?,?,?,?)";

    await conn.query(sql, [
      username,
      model.agentId ? model.agentId : model.id,
      createBy,
      new Date(),
    ]);

    return true;
  } catch (e) {
    throw e;
  }
}

async function getAgent(conn, username) {
  try {
    let sql = "select * from useragent where userName = ?";
    const result = await conn.query(sql, [username]);

    return result;
  } catch (err) {
    throw err;
  }
}

async function getAgentObj(conn, username) {
  try {
    let sql =
      "select bu.* from business bu left join useragent ua on bu.id = ua.agentId where ua.userName = ? order by bu.name asc";
    const result = await conn.query(sql, [username]);

    return result;
  } catch (err) {
    throw err;
  }
}

async function getUseragent(conn, agentId) {
  try {
    let sql = "SELECT * FROM useragent where agentId = ? order by username asc";

    if (agentId == 1) {
      sql = "SELECT * FROM user where businessId = ? order by username asc";
    }

    const result = await conn.query(sql, [agentId]);

    return result;
  } catch (err) {
    throw err;
  }
}
