"use strict";

module.exports = {
  get,
  getProductGroups,
  search,
  count,
  save,
  saveProductGroupItem,
  deleteProductGroup,
  deleteProductGroupItem
};

async function get(conn, id) {
  try {
    let sql = "select * from productgroup where id = ?";
    let sqlProduct = `select 
                        p.*
                      from productgroup pg
                      left join productgroupitem pi on pg.id = pi.productGroupId
                      left join product p on pi.productId = p.id 
                      where 1=1
                      and pg.id = ?
                      group by pg.id, pi.productId`

    const result = await conn.query(sql, [id]);
    const resultProducts = await conn.query(sqlProduct, [id]); //select products 

    if (resultProducts && resultProducts.length > 0) {
      result[0]['itemInSet'] = resultProducts
    }
    const response = result[0];
    return response;
  } catch (err) {
    throw err;
  }
}

async function getProductGroups(conn) {
  try {
    let sql = "select * from productgroup where 1=1 order by no asc";
    const result = await conn.query(sql);
    return result;
  } catch (err) {
    throw err;
  }
}


async function count(conn, criteria) {
  try {
    let params = [];

    let sql = "select count(id) as totalRecord from productgroup where 1=1";

    if (criteria.description) {
      sql += " and description like ?";
      params.push("%" + criteria.description + "%");
    }

    if (criteria.status != undefined) {
      sql += " and status = ?";
      params.push(criteria.status);
    }

    if (criteria.keyword) {
      sql += " and (description like ? or status like ?)";
      params.push("%" + criteria.keyword + "%");
      params.push("%" + criteria.keyword + "%");
    }

    console.log("SQL serch product group", sql);

    const result = await conn.query(sql, params);

    return result[0].totalRecord;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}

async function search(conn, criteria) {
  try {
    let startRecord = (criteria.page - 1) * criteria.size;
    let params = [];

    // let sql = "select pg.* , count(pi.productId) as productCount from productgroup pg";
    // sql += " left join productgroupitem pi on pg.id = pi.productGroupId"
    // sql += " where 1=1"
    // sql += " group by pg.id, pg.description, pg.status"

    let sql = `SELECT
                pg.*,
                COALESCE(pi_count, 0) AS productCount
              FROM productgroup pg
              LEFT JOIN (
                SELECT pi.productGroupId, COUNT(*) AS pi_count
                FROM productgroupitem pi
                GROUP BY pi.productGroupId
              ) pi_counts ON pi_counts.productGroupId = pg.id
              where 1=1`

    if (criteria.description) {
      sql += " and pg.description like ?";
      params.push("%" + criteria.description + "%");
    }

    if (criteria.status != undefined) {
      sql += " and pg.status = ?";
      params.push(criteria.status);
    }

    if (criteria.keyword) {
      sql += " and (pg.description like ? or pg.status like ?)";
      params.push("%" + criteria.keyword + "%");
      params.push("%" + criteria.keyword + "%");
    }

    sql += " order by `no` asc, description asc ";

    sql += " limit " + startRecord + "," + criteria.size;

    const result = await conn.query(sql, params);

    return result;
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
      console.log("Update product group");
      await deleteProductGroupItem(conn, model.id)

      _id = model.id;

      let params = [];

      let sql = "update productgroup set ";

      sql += " `description` = ? ";
      params.push(model.description);

      sql += " ,`no` = ? ";
      params.push(model.no);

      sql += " ,`status` = ? ";
      params.push(model.status);

      sql += " where id = ? ";
      params.push(model.id);

      await conn.query(sql, params);
    } else {
      //insert

      console.log("Insert product group");

      let sql =
        "insert into productgroup (`description`, `no`, `status`)";
      sql += "  VALUES (?,?,?)";

      const _result = await conn.query(sql, [
        model.description,
        model.no,
        model.status
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

async function saveProductGroupItem(conn, productItem, productGroupId) {
  try {
    //insert
    let _id = 0;

    let sql =
      "insert into productgroupitem (`productId`,`productGroupId`)";
    sql += "  VALUES (?,?)";

    const _result = await conn.query(sql, [
      productItem.id,
      productGroupId
    ]);

    _id = _result.insertId;

    return _id;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }

}

async function deleteProductGroup(conn, id) {
  try {
    //delete
    let sql = "delete from productgroup where id = ?";

    await conn.query(sql, [id]);

    return true;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}

async function deleteProductGroupItem(conn, id) {
  try {
    //delete
    let sql = "delete from productgroupitem where productGroupId = ?";

    await conn.query(sql, [id]);

    return true;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}