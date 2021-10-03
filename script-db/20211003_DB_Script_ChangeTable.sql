ALTER TABLE `hopefull_db`.`user` 
DROP FOREIGN KEY `FK_USER_BRANCH`;
ALTER TABLE `hopefull_db`.`user` 
DROP COLUMN `branchId`,
DROP COLUMN `shopId`,
ADD COLUMN `businessId` INT NULL AFTER `status`,
ADD COLUMN `lineNotifyToken` VARCHAR(255) NULL AFTER `businessId`,
CHANGE COLUMN `loginType` `loginType` VARCHAR(45) NULL DEFAULT 'HQ_USER' COMMENT 'HQ_ADMIN\\nHQ_USER\\nAGENT_ADMIN\\nAGENT_USER' ,
CHANGE COLUMN `createUser` `createBy` VARCHAR(45) NULL DEFAULT NULL ,
CHANGE COLUMN `updateUser` `updateBy` VARCHAR(45) NULL DEFAULT NULL ;
DROP INDEX `FK_USER_BRANCH_idx` ;
;


ALTER TABLE `hopefull_db`.`districts` 
DROP FOREIGN KEY `fk_districts_provinces`;
ALTER TABLE `hopefull_db`.`districts` 
CHANGE COLUMN `name_in_thai` `nameInThai` VARCHAR(150) NOT NULL ,
CHANGE COLUMN `name_in_english` `nameInEnglish` VARCHAR(150) NOT NULL ,
CHANGE COLUMN `province_id` `provinceId` INT(11) NOT NULL ;
ALTER TABLE `hopefull_db`.`districts` 
ADD CONSTRAINT `fk_districts_provinces`
  FOREIGN KEY (`provinceId`)
  REFERENCES `hopefull_db`.`provinces` (`id`);

  
ALTER TABLE `hopefull_db`.`subdistricts` 
DROP FOREIGN KEY `fk_subdistricts_districts`;
ALTER TABLE `hopefull_db`.`subdistricts` 
CHANGE COLUMN `name_in_thai` `nameInThai` VARCHAR(150) NOT NULL ,
CHANGE COLUMN `name_in_english` `nameInEnglish` VARCHAR(150) NULL DEFAULT NULL ,
CHANGE COLUMN `district_id` `districtId` INT(11) NOT NULL ,
CHANGE COLUMN `zip_code` `zipCode` INT(11) NULL DEFAULT NULL ;
ALTER TABLE `hopefull_db`.`subdistricts` 
ADD CONSTRAINT `fk_subdistricts_districts`
  FOREIGN KEY (`districtId`)
  REFERENCES `hopefull_db`.`districts` (`id`);

  
ALTER TABLE `hopefull_db`.`provinces` 
CHANGE COLUMN `name_in_thai` `nameInThai` VARCHAR(150) NOT NULL ,
CHANGE COLUMN `name_in_english` `nameInEnglish` VARCHAR(150) NOT NULL ;


ALTER TABLE `hopefull_db`.`subdistricts` 
RENAME TO  `hopefull_db`.`subdistrict` ;

ALTER TABLE `hopefull_db`.`districts` 
RENAME TO  `hopefull_db`.`district` ;

ALTER TABLE `hopefull_db`.`provinces` 
RENAME TO  `hopefull_db`.`province` ;

ALTER TABLE `hopefull_db`.`user_function` 
RENAME TO  `hopefull_db`.`userfunction` ;



