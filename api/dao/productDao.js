"use strict";

module.exports = {
    get,
    search,
    count,
    save,
    deleteProduct,
    addAgentPrice,
    deleteAgentPrice,
    getAgentPrice
};


async function get(conn, id) {
    try {
        let sql = "select * from product where id = ?";
        const result = await conn.query(sql, [id]);

        return result[0];
    } catch (err) {
        throw err;
    }
}

async function count(conn, criteria) {
    try {
        let params = [];

        let sql = "select count(id) as totalRecord from product where 1=1";

        if (criteria.code) {
            sql += " and code like ?";
            params.push("%" + criteria.code + "%");
        }

        if (criteria.name) {
            sql += " and name like ?";
            params.push("%" + criteria.name + "%");
        }

        let result = await conn.query(sql, params);

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

        let sql =
            "select * from product where 1=1";

        if (criteria.code) {
            sql += " and code like ?";
            params.push("%" + criteria.code + "%");
        }

        if (criteria.name) {
            sql += " and name like ?";
            params.push("%" + criteria.name + "%");
        }

        sql += " order by code";

        sql += " limit " + startRecord + "," + criteria.size;

        let result = await conn.query(sql, params);

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

            _id = model.id;

            let params = [];

            let sql = "update product set ";

            sql += "code = ? ";
            params.push(model.code);

            sql += ",name = ? ";
            params.push(model.name);

            sql += ",unit = ? ";
            params.push(model.unit);

            sql += ",remainingDay = ? ";
            params.push(model.remainingDay);

            sql += ",price = ? ";
            params.push(model.price);

            sql += ",discount = ? ";
            params.push(model.discount);

            sql += ",sellPrice = ? ";
            params.push(model.sellPrice);

            sql += ",imageUrl = ? ";
            params.push(model.imageUrl);

            sql += ",updateBy = ? ";
            params.push(model.updateBy);

            sql += ",updateDate = ? ";
            params.push(new Date());

            sql += " where id = ?";
            params.push(model.id);

            await conn.query(sql, params);
        } else {
            //insert
            let sql =
                "insert into product (`code`,`name`,`unit`,`remainingDay`,`price`,`discount`,`sellPrice`,`imageUrl`,`createBy`, `createDate`, `updateBy`, `updateDate`)";
            sql += "  VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";

            let _result = await conn.query(sql, [
                model.code,
                model.name,
                model.unit,
                model.remainingDay,
                model.price,
                model.discount,
                model.sellPrice,
                model.imageUrl,
                model.createBy,
                new Date(),
                model.updateBy,
                new Date()
            ]);

            console.log("INSERT RESULT : ",_result);

            _id = _result.insertId;

            console.log("AUTO ID : ", _id);
        }

        return _id;
    } catch (e) {
        console.log("ERROR : ", e);
        throw e;
    }
}

async function deleteProduct(conn, id) {
    try {
        //delete
        let sql = "delete from product where id = ?";

        await conn.query(sql, [id]);

        return true;
    } catch (e) {
        console.log("ERROR : ", e);
        throw e;
    }
}

async function addAgentPrice(conn, id) {
    try {
        //insert
        let sql =
            "insert into agentPrice (`productId`,`qty`,`price`,`createBy`, `createDate`)";
        sql += "  VALUES (?,?,?,?,?)";

        await conn.query(sql, [
            model.productId,
            model.qty,
            model.price,
            model.createBy,
            new Date()
        ]);

        return true;
    } catch (e) {
        console.log("ERROR : ", e);
        throw e;
    }
}

async function deleteAgentPrice(conn, productId) {
    try {
        //delete
        let sql = "delete from agentPrice where productId = ?";

        await conn.query(sql, [productId]);

        return true;
    } catch (e) {
        console.log("ERROR : ", e);
        throw e;
    }
}

async function getAgentPrice(conn, productId) {
    try {

        let sql = "select * from agentPrice where productId=?";
        sql += " order by qty";

        let result = await conn.query(sql, [productId]);

        return result;
    } catch (e) {
        console.log("ERROR : ", e);
        throw e;
    }
}