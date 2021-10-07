DELETE FROM `hopeful`.`function` WHERE (`functionCode` = 'APPROVE_DISCOUNT');
DELETE FROM `hopeful`.`function` WHERE (`functionCode` = 'CANCEL_TRANSACTION');
DELETE FROM `hopeful`.`function` WHERE (`functionCode` = 'MANAGE_CUSTOMER');
DELETE FROM `hopeful`.`function` WHERE (`functionCode` = 'MANAGE_TRANSACTION');
DELETE FROM `hopeful`.`function` WHERE (`functionCode` = 'MANAGE_USER');
DELETE FROM `hopeful`.`function` WHERE (`functionCode` = 'PAYMENT');
DELETE FROM `hopeful`.`function` WHERE (`functionCode` = 'UPDATE_TRANSACTION');
DELETE FROM `hopeful`.`function` WHERE (`functionCode` = 'VIEW_ALLBRANCH');
DELETE FROM `hopeful`.`function` WHERE (`functionCode` = 'VIEW_DASHBOARD');
DELETE FROM `hopeful`.`function` WHERE (`functionCode` = 'VIEW_DEBTOR');
DELETE FROM `hopeful`.`function` WHERE (`functionCode` = 'VIEW_PAYMENT');


INSERT INTO `hopeful`.`function` (`functionCode`, `name`) VALUES ('VIEW_USER', 'VIEW_USER');
INSERT INTO `hopeful`.`function` (`functionCode`, `name`) VALUES ('CREATE_USER', 'CREATE_USER');
INSERT INTO `hopeful`.`function` (`functionCode`, `name`) VALUES ('VIEW_PRODUCT', 'VIEW_PRODUCT');
INSERT INTO `hopeful`.`function` (`functionCode`, `name`) VALUES ('CREATE_PRODUCT', 'CREATE_PRODUCT');
INSERT INTO `hopeful`.`function` (`functionCode`, `name`) VALUES ('VIEW_CUSTOMER', 'VIEW_CUSTOMER');
INSERT INTO `hopeful`.`function` (`functionCode`, `name`) VALUES ('CREATE_CUSTOMER', 'CREATE_CUSTOMER');
INSERT INTO `hopeful`.`function` (`functionCode`, `name`) VALUES ('VIEW_ORDER', 'VIEW_ORDER');
INSERT INTO `hopeful`.`function` (`functionCode`, `name`) VALUES ('CREATE_ORDER', 'CREATE_ORDER');
INSERT INTO `hopeful`.`function` (`functionCode`, `name`) VALUES ('VIEW_AGENT', 'VIEW_AGENT');
INSERT INTO `hopeful`.`function` (`functionCode`, `name`) VALUES ('CREATE_AGENT', 'CREATE_AGENT');
INSERT INTO `hopeful`.`function` (`functionCode`, `name`) VALUES ('CRM', 'CRM');
