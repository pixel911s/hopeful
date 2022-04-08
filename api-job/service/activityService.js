"use strict";

var activityDao = require("../dao/activityDao");
var agentDao = require("../dao/agentDao");

const config = require("config");
const mysql = require("promise-mysql");
const pool = mysql.createPool(config.mysql);

var schedule = require("node-schedule");

var rule = new schedule.RecurrenceRule();
rule.hour = 1;
rule.minute = 0;
rule.second = 0;

schedule.scheduleJob(rule, async function () {
  console.log("START BATCH");
  const conn = await pool.getConnection();
  try {
    let agents = await agentDao.gets(conn);

    for (let index = 0; index < agents.length; index++) {
      const agent = agents[index];
      await activityDao.clearOwner(conn, agent.id, agent.clearActivityDay);
    }
  } catch (e) {
    conn.rollback();
    console.error(e);
  } finally {
    conn.release();
  }
});
