ALTER TABLE `address` 
CHANGE COLUMN `id` `id` BIGINT NOT NULL AUTO_INCREMENT ;

ALTER TABLE `address` 
ADD COLUMN `province` INT NULL AFTER `zipCode`,
CHANGE COLUMN `addressName` `name` VARCHAR(300) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NULL DEFAULT NULL ,
CHANGE COLUMN `addressInfo` `info` VARCHAR(500) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NULL DEFAULT NULL ,
CHANGE COLUMN `subDistrict` `subDistrict` INT NULL DEFAULT NULL ,
CHANGE COLUMN `district` `district` INT NULL DEFAULT NULL ;


ALTER TABLE `address` 
CHANGE COLUMN `zipCode` `zipcode` VARCHAR(5 NULL DEFAULT NULL ;

ALTER TABLE `address` 
ADD COLUMN `contact` VARCHAR(45) NULL AFTER `zipcode`,
CHANGE COLUMN `province` `province` INT NULL DEFAULT NULL AFTER `district`;

ALTER TABLE `order` 
ADD COLUMN `deliveryPrice` DECIMAL(18,2) NULL AFTER `itemDiscountAmount`;

ALTER TABLE `order` 
ADD COLUMN `paymentType` VARCHAR(45) NULL AFTER `customerId`;

ALTER TABLE `order` 
CHANGE COLUMN `deliveryZipCode` `deliveryZipcode` VARCHAR(5) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NULL DEFAULT NULL ;

ALTER TABLE `order` 
ADD COLUMN `remark` VARCHAR(500) NULL AFTER `updateDate`;





ALTER TABLE `orderitem` 
DROP FOREIGN KEY `fk_orderItem_orderId`;
ALTER TABLE `hopeful`.`orderitem` 
ADD CONSTRAINT `fk_orderItem_orderId`
  FOREIGN KEY (`orderId`)
  REFERENCES `hopeful`.`order` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;









