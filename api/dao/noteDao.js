"use strict";

module.exports = {
    get,
    save,
    search
};

async function get(conn, id) {
    try {
        let sql =
            "select * from note where id = ?";
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
                "UPDATE `note` SET `description` = ?, `updateBy` = ?, `updateDate` = ? WHERE `id` = ?";

            params.push(model.description.trim());
            params.push(model.username);
            params.push(new Date());
            params.push(model.id);

            await conn.query(sql, params);
        } else {
            //insert
            let sql =
                "INSERT INTO `note` (`customerId`, `description`, `createBy`, `createDate`, `updateBy`, `updateDate`) ";
            sql += "  VALUES (?,?,?,?,?,?)";

            let _result = await conn.query(sql, [
                model.customerId,
                model.description.trim(),
                model.username,
                new Date(),
                null,
                null,
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

async function search(conn, criteria) {
    try {
        let params = [];

        let startRecord = (criteria.page - 1) * criteria.size;

        let sql = "select count(id) as qty from note where customerId=?";

        if (!criteria.isCount)
        {
            sql = "select * from note where customerId=?";       
            sql += " order by createDate desc";
            sql += " limit " + startRecord + "," + criteria.size;
        }
        
        params.push(criteria.customerId)


        const result = await conn.query(sql, params);

        return result;
    } catch (err) {
        throw err;
    }
}