"use strict";

module.exports = {
  get,
  save,
  closeTask,
  recallTask,
  getTaskList,
};

async function get(conn, id) {
  try {
    let sql = "select * from task where id = ?";
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
        "UPDATE `task` SET `activityId` = ?, `description` = ?, `scheduleDate` = ?, `scheduleTime` = ?, `noticeDay` = ?, `updateBy` = ?, `updateDate` = ? WHERE `id` = ?";

      params.push(model.activityId);
      params.push(model.description.trim());
      params.push(model.scheduleDate);
      params.push(model.scheduleTime);
      params.push(model.noticeDay);
      params.push(model.username);
      params.push(new Date());
      params.push(model.id);

      await conn.query(sql, params);
    } else {
      //insert
      let sql =
        "INSERT INTO `task` (`activityId`,`description`,`scheduleDate`,`scheduleTime`,`noticeDay`,`isClose`,`closeDate`, `createBy`, `createDate`, `updateBy`, `updateDate`) ";
      sql += "  VALUES (?,?,?,?,?,?,?,?,?,?,?)";

      let _result = await conn.query(sql, [
        model.activityId,
        model.description.trim(),
        model.scheduleDate,
        model.scheduleTime,
        model.noticeDay,
        false,
        null,
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

async function closeTask(conn, id, username) {
  try {
    // ปิด Task
    let sql =
      "update task set `isClose`=true, `closeDate`=?, `updateBy`=?, `updateDate`=? where id = ?";

    await conn.query(sql, [new Date(), username, new Date(), id]);

    return true;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}

async function recallTask(conn, id, username) {
  try {
    // undo การปิด Task

    let sql =
      "update task set `isClose`=false, `closeDate`=?, `updateBy`=?, `updateDate`=? where id = ?";

    await conn.query(sql, [null, username, new Date(), id]);

    return true;
  } catch (e) {
    console.log("ERROR : ", e);
    throw e;
  }
}

async function getTaskList(conn, ownerUser, taskStatus) {
  //== taskStatus
  //== O : Open
  //== C : Close
  try {
    let params = [];

    let sql =
      "select t.*, activity.code as activityCode from task t left join activity activity on t.activityId = activity.id where  1=1 ";
    if (ownerUser && ownerUser != "") {
      sql += " and t.createBy=?";
      params.push(ownerUser);
    }
    if (taskStatus == "C") {
      sql += " and t.isClose=true";
    } else {
      sql += " and t.isClose=false";
    }
    sql += " order by t.scheduleDate desc,t.scheduleTime desc";

    const result = await conn.query(sql, params);

    return result;
  } catch (err) {
    throw err;
  }
}
