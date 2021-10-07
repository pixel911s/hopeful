"use strict";

var util = require("../utils/responseUtils");
var encypt = require("../utils/encypt");
var orderDao = require("../dao/orderDao");
var runningDao = require("../dao/runingDao");

const config = require("config");
const mysql = require("promise-mysql");
const pool = mysql.createPool(config.mysql);

module.exports = {
    get,
    search,
    create,
    update,
    deleteOrder,
};


async function get(req, res) {
    const conn = await pool.getConnection();
    try {
        let criteria = req.body;

        let result = await orderDao.get(conn, criteria.id);

        result.orderDetail = await orderDao.getDetail(conn, criteria.id);

        return res.send(util.callbackSuccess(null, result));
    } catch (e) {
        console.error(e);
        return res.status(500).send(e.message);
    } finally {
        conn.release();
    }
}

async function search(req, res) {
    const conn = await pool.getConnection();
    try {
        let criteria = req.body;
        let result = null;

        let totalRecord = await orderDao.count(conn, criteria);

        let totalPage = Math.round(totalRecord / criteria.size);
        if (totalPage <= 0) {
            totalPage = 1;
        }

        if (totalRecord > 0) {
            result = await orderDao.search(conn, criteria);
        }

        return res.send(util.callbackPaging(result, totalPage, totalRecord));
    } catch (e) {
        console.error(e);
        return res.status(500).send(e.message);
    } finally {
        conn.release();
    }
}

async function create(req, res) {

    console.log("CREATE ORDER");

    const conn = await pool.getConnection();
    conn.beginTransaction();
    try {
        let model = req.body;

        model = await orderDao.calculateOrder(model);

        console.log("MODEL : ",model);
        
        let _date = new Date();

        model.orderNo = await runningDao.getNextRunning(conn, "SO", _date.getFullYear(), _date.getMonth());

        console.log("ORDER NO : ",model.orderNo);

        let _orderId = await orderDao.save(conn, model);    
        
        console.log("RET ORDER ID : ", _orderId);
       
        for (let index = 0; index < model.orderDetail.length; index++) {
            model.orderDetail[index].orderId = _orderId;
            await orderDao.saveDetail(conn, model.orderDetail[index]);
        }

        conn.commit();

        return res.send(
            util.callbackSuccess("บันทึกข้อมูลออเดอร์เสร็จสมบูรณ์", true)
        );
    } catch (e) {
        conn.rollback();
        if (e.code == "ER_DUP_ENTRY") {
            return res.status(401).send("มีข้อมูลออเดอร์นี้แล้วในระบบ");
        } else {
            return res.status(500).send(e.message);
        }
    } finally {
        conn.release();
    }
}

async function update(req, res) {
    const conn = await pool.getConnection();
    conn.beginTransaction();
    try {
        let model = req.body;

        model = await orderDao.calculateOrder(model);

        await orderDao.save(conn, model);      
        await orderDao.deleteOrderDetail(conn, model.id);

        for (let index = 0; index < model.orderDetail.length; index++) {
            model.orderDetail[index].orderId = model.id;
            await orderDao.saveDetail(conn, model.orderDetail[index]);
        }

        conn.commit();

        return res.send(
            util.callbackSuccess("บันทึกข้อมูลออเดอร์เสร็จสมบูรณ์", true)
        );
    } catch (e) {
        conn.rollback();
        if (e.code == "ER_DUP_ENTRY") {
            return res.status(401).send("มีข้อมูลออเดอร์นี้แล้วในระบบ");
        } else {
            return res.status(500).send(e.message);
        }
    } finally {
        conn.release();
    }
}

async function deleteOrder(req, res) {
    const conn = await pool.getConnection();
    conn.beginTransaction();
    try {
        let model = req.body;

        await orderDao.deleteOrderDetail(conn, model.id);

        await orderDao.deleteOrder(conn, model.id);

        conn.commit();

        return res.send(
            util.callbackSuccess("ทำการลบข้อมูลออเดอร์เสร็จสมบูรณ์", true)
        );
    } catch (e) {
        conn.rollback();
        return res.status(500).send(e.message);
    } finally {
        conn.release();
    }
}

