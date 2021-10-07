"use strict";

module.exports = {
    get,
    getDetail,
    search,
    count,
    save,
    saveDetail,
    deleteOrder,
    deleteOrderDetail,
    calculateOrder
};


async function get(conn, id) {
    try {
        let sql = "select * from `order` where id = ?";
        const result = await conn.query(sql, [id]);

        return result[0];
    } catch (err) {
        throw err;
    }
}

async function getDetail(conn, id) {
    try {
        let sql = "select a.*,b.code,b.name,b.unit from orderItem a ";
        sql += " left join product b on a.productId=b.id";
        sql += " where orderId = ?";
        sql += " order by a.id"
        const result = await conn.query(sql, [id]);

        return result[0];
    } catch (err) {
        throw err;
    }
}


async function count(conn, criteria) {
    try {
        let params = [];

        let sql = "select count(id) as totalRecord from `order` where 1=1";

        if (criteria.ownerId) {
            sql += " and ownerId = ?";
            params.push(criteria.ownerId);
        }

        if (criteria.orderNo) {
            sql += " and orderNo like ?";
            params.push("%" + criteria.code + "%");
        }

        if (criteria.deliveryName) {
            sql += " and deliveryName like ?";
            params.push("%" + criteria.deliveryName + "%");
        }

        if (criteria.status) {
            sql += " and status = ?";
            params.push(criteria.status);
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
            "select * from `order` where 1=1";

        if (criteria.ownerId) {
            sql += " and ownerId = ?";
            params.push(criteria.ownerId);
        }

        if (criteria.orderNo) {
            sql += " and orderNo like ?";
            params.push("%" + criteria.code + "%");
        }

        if (criteria.deliveryName) {
            sql += " and deliveryName like ?";
            params.push("%" + criteria.deliveryName + "%");
        }

        if (criteria.status) {
            sql += " and status = ?";
            params.push(criteria.status);
        }

        sql += " order by ownerId,orderNo";

        sql += " limit " + startRecord + "," + criteria.size;

        let result = await conn.query(sql, params);

        return result;
    } catch (e) {
        throw e;
    }
}

async function save(conn, model) {
    try {

        let _id = 0;

        if (model.id) {
            //update

            let params = [];

            let sql = "update `order` set ";
                   
            sql += "ownerId = ? ";
            params.push(model.ownerId);

            sql += ",customerId = ? ";
            params.push(model.customerId);

            sql += ",totalQty = ? ";
            params.push(model.totalQty);

            sql += ",totalAmount = ? ";
            params.push(model.totalAmount);

            sql += ",billDiscountAmount = ? ";
            params.push(model.billDiscountAmount);

            sql += ",itemDiscountAmount = ? ";
            params.push(model.itemDiscountAmount);

            sql += ",netAmount = ? ";
            params.push(model.netAmount);

            sql += ",status = ? ";
            params.push(model.status);

            sql += ",deliveryName = ? ";
            params.push(model.deliveryName);

            sql += ",deliveryAddressInfo = ? ";
            params.push(model.deliveryAddressInfo);

            sql += ",deliverySubDistrict = ? ";
            params.push(model.deliverySubDistrict);

            sql += ",deliveryDistrict = ? ";
            params.push(model.deliveryDistrict);

            sql += ",deliveryZipCode = ? ";
            params.push(model.deliveryZipCode);

            sql += ",updateBy = ? ";
            params.push(model.updateBy);

            sql += ",updateDate = ? ";
            params.push(new Date());

            sql += " where id = ?";
            params.push(model.id);

            await conn.query(sql, params);

        } else {
            //insert

            console.log("INSERT ORDER");

            let sql =
                "insert into `order` (orderNo,orderDate,ownerId,customerId,totalQty,totalAmount,billDiscountAmount,itemDiscountAmount,netAmount,status,deliveryName,deliveryAddressInfo,deliverySubDistrict,deliveryDistrict,deliveryZipCode,createBy,createDate,updateBy,updateDate)";
            sql += "  values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

           let _result = await conn.query(sql, [
                model.orderNo,
                new Date(),
                model.ownerId,
                model.customerId,
                model.totalQty,
                model.totalAmount,
                model.billDiscountAmount,
                model.itemDiscountAmount,
                model.netAmount,
                model.status,
                model.deliveryName,
                model.deliveryAddressInfo,
                model.deliverySubDistrict,
                model.deliveryDistrict,
                model.deliveryZipCode,
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
        console.log("ERROR : ",e);
        throw e;        
    }
}

async function saveDetail(conn, model) {
    try {

        //insert
        let sql =
            "insert into orderItem (`orderId`,`productId`,`qty`,`price`,`discount`,`itemAmount`)";
        sql += "  VALUES (?,?,?,?,?,?)";

        await conn.query(sql, [
            model.orderId,
            model.productId,
            model.qty,
            model.price,
            model.discount,
            model.itemAmount           
        ]);


        return true;
    } catch (e) {
        console.log("ERROR : ",e);
        throw e;
    }
}

async function deleteOrder(conn, id) {
    try {
        //delete

        let sql = "delete from `order` where id = ?";
        await conn.query(sql, [id]);

        return true;
    } catch (e) {
        console.log("ERROR : ",e);
        throw e;
    }
}

async function deleteOrderDetail(conn, id) {
    try {
        //delete

        let sql = "delete from orderItem where orderId = ?";
        await conn.query(sql, [id]);

        return true;
    } catch (e) {
        console.log("ERROR : ",e);
        throw e;
    }
}

async function calculateOrder(model)
{
    model.totalQty = 0;
    model.totalAmount = 0;
    model.itemDiscountAmount = 0;
    
    for (let index = 0; index < model.orderDetail.length; index++) {

        model.orderDetail[index].itemAmount = +(((+model.orderDetail[index].qty) * (+model.orderDetail[index].price)).toFixed(2));
        
        model.totalQty += +model.orderDetail[index].qty;
        model.itemDiscountAmount += +model.orderDetail[index].discount;
        model.totalAmount += +model.orderDetail[index].itemAmount;

    }
    model.netAmount = (+model.totalAmount) - (+model.billDiscountAmount) - (+model.itemDiscountAmount);

    return model;
}
