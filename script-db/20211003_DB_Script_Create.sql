CREATE TABLE `business` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `businessType` varchar(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'H - HQ\nA - AGENT\nC - CUSTOMER',
  `ownerId` int(11) DEFAULT NULL,
  `code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobile` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactName` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `memo` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lineNotifyToken` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hashTag` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createBy` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime DEFAULT NULL,
  `updateBy` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updateDate` datetime DEFAULT NULL,
  `lastBuyDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_business_ownerId` (`ownerId`) /*!80000 INVISIBLE */,
  KEY `idx_business_code` (`code`) /*!80000 INVISIBLE */,
  KEY `idx_business_name` (`name`) /*!80000 INVISIBLE */,
  KEY `idx_business_mobile` (`mobile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `address` (
  `id` int(11) NOT NULL,
  `businessId` int(11) DEFAULT NULL,
  `addressType` varchar(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'C - ContactAddress\nD - DeliveryAddress\nT - TaxAddress\n',
  `addressName` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `addressInfo` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subDistrict` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zipCode` int(11) DEFAULT NULL,
  `createBy` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime DEFAULT NULL,
  `updateBy` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updateDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_address_businessId_idx` (`businessId`),
  CONSTRAINT `fk_address_businessId` FOREIGN KEY (`businessId`) REFERENCES `business` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remainingDay` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(18,2) DEFAULT NULL,
  `discount` decimal(18,2) DEFAULT NULL,
  `sellPrice` decimal(18,2) DEFAULT NULL,
  `imageUrl` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createBy` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updateBy` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updateDate` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_product_code` (`code`) /*!80000 INVISIBLE */,
  KEY `idx_product_name` (`name`) /*!80000 INVISIBLE */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderNo` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `orderDate` datetime DEFAULT NULL,
  `ownerId` int(11) DEFAULT NULL,
  `customerId` int(11) DEFAULT NULL,
  `totalQty` int(11) DEFAULT NULL,
  `totalAmount` decimal(18,2) DEFAULT NULL,
  `billDiscountAmount` decimal(18,2) DEFAULT NULL,
  `itemDiscountAmount` decimal(18,2) DEFAULT NULL,
  `netAmount` decimal(18,2) DEFAULT NULL,
  `status` varchar(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'D - Draft\nO - Order\nC - Cancel',
  `deliveryName` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deliveryAddressInfo` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deliverySubDistrict` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DeliveryDistrict` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deliveryZipCode` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createBy` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime DEFAULT NULL,
  `updateBy` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updateDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order_ownerId_idx` (`ownerId`),
  KEY `fk_order_customerId_idx` (`customerId`),
  CONSTRAINT `fk_order_customerId` FOREIGN KEY (`customerId`) REFERENCES `business` (`id`),
  CONSTRAINT `fk_order_ownerId` FOREIGN KEY (`ownerId`) REFERENCES `business` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `orderitem` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` int(11) DEFAULT NULL,
  `productId` int(11) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `price` decimal(18,2) DEFAULT NULL,
  `discount` decimal(18,2) DEFAULT NULL,
  `itemAmount` decimal(18,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_orderItem_orderId_idx` (`orderId`),
  KEY `fk_orderItem_productId_idx` (`productId`),
  CONSTRAINT `fk_orderItem_orderId` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`),
  CONSTRAINT `fk_orderItem_productId` FOREIGN KEY (`productId`) REFERENCES `product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



