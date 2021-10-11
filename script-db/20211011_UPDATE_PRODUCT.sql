ALTER TABLE `product` 
ADD COLUMN `status` INT NULL DEFAULT 1 AFTER `imageUrl`;

ALTER TABLE `product` 
ADD COLUMN `description` TEXT NULL AFTER `name`;

ALTER TABLE `product` 
ADD COLUMN `weight` INT NULL DEFAULT 100 AFTER `sellPrice`;
