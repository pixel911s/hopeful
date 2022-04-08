"use strict";

module.exports = {
  gets,
  count,
  search,
  save,
  getByCode,
  getById,
};

async function getById(conn, id) {
  try {
    let sql = "select * from business where businessType = 'A' and id = ?";

    const result = await conn.query(sql, [id]);

    return result[0];
  } catch (err) {
    throw err;
  }
}

async function getByCode(conn, code) {
  try {
    let sql = "select * from business where businessType = 'A' and code = ?";

    const result = await conn.query(sql, [code.trim().toUpperCase()]);

    return result[0];
  } catch (err) {
    throw err;
  }
}

async function gets(conn) {
  try {
    let sql =
      "select * from business where businessType = 'A' || businessType = 'H' order by name asc";

    const result = await conn.query(sql, []);

    return result;
  } catch (err) {
    throw err;
  }
}

async function count(conn, criteria) {
  try {
    let params = [];

    let sql =
      "select count(*) as totalRecord from business where businessType = 'A'";

    if (criteria.keyword) {
      sql += " and name like ?";
      params.push("%" + criteria.keyword + "%");
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

    let sql = "select * from business where businessType = 'A'";

    if (criteria.keyword) {
      sql += " and name like ?";
      params.push("%" + criteria.keyword + "%");
    }

    sql += " order by code asc limit " + startRecord + "," + criteria.size;

    let result = await conn.query(sql, params);

    return result;
  } catch (e) {
    throw e;
  }
}

async function save(conn, model) {
  try {
    if (model.id) {
      //update

      let params = [];

      let sql = "UPDATE `business` SET ";

      sql += "code = ? ";
      params.push(model.code.trim().toUpperCase());

      sql += ", name = ? ";
      params.push(model.name.trim());

      sql += ", lineNotifyToken = ? ";
      params.push(model.lineNotifyToken ? model.lineNotifyToken.trim() : null);

      sql += ", updateBy = ? ";
      params.push(model.updateUser);

      sql += ", updateDate = ? ";
      params.push(new Date());

      sql += " where id = ?";
      params.push(model.id);

      await conn.query(sql, params);
    } else {
      //insert
      let sql =
        "INSERT INTO `business` (`businessType`,`code`,`name`, lineNotifyToken, `createBy`, `createDate`, `updateBy`, `updateDate`)";
      sql += "  VALUES (?,?,?,?,?,?,?,?)";

      await conn.query(sql, [
        "A",
        model.code.trim().toUpperCase(),
        model.name.trim(),
        model.lineNotifyToken ? model.lineNotifyToken.trim() : null,
        model.updateUser,
        new Date(),
        model.updateUser,
        new Date(),
      ]);
    }

    return true;
  } catch (e) {
    throw e;
  }
}
