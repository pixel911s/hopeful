ALTER TABLE `orderitem` 
ADD COLUMN `isSet` TINYINT NULL AFTER `itemAmount`,
ADD COLUMN `itemSet` JSON NULL AFTER `isSet`;

ALTER TABLE `product` 
ADD COLUMN `isSet` TINYINT NULL AFTER `updateDate`,
ADD COLUMN `itemInSet` JSON NULL AFTER `isSet`;