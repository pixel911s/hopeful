ALTER TABLE `hopefull_db`.`activity` 
ADD COLUMN `statusDate0` DATETIME NULL AFTER `updateDate`,
ADD COLUMN `statusDate1` DATETIME NULL AFTER `statusDate0`,
ADD COLUMN `statusDate2` DATETIME NULL AFTER `statusDate1`,
ADD COLUMN `statusDate3` DATETIME NULL AFTER `statusDate2`,
ADD COLUMN `statusDate4` DATETIME NULL AFTER `statusDate3`;