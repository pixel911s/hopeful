CREATE TABLE `activity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `productId` int(11) DEFAULT NULL,
  `remainingDay` int(11) DEFAULT NULL,
  `dueDate` datetime DEFAULT NULL,
  `agentId` int(11) DEFAULT NULL,
  `customerId` int(11) DEFAULT NULL,
  `ownerUser` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activityStatusId` int(11) DEFAULT NULL,
  `refOrderId` int(11) DEFAULT NULL,
  `refOrderItemId` int(11) DEFAULT NULL,
  `createBy` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime DEFAULT NULL,
  `updateBy` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updateDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_activity_refProductId_idx` (`productId`),
  KEY `fk_activity_agentId_idx` (`agentId`),
  KEY `fk_activity_customerId_idx` (`customerId`),
  KEY `fk_activity_statusId_idx` (`activityStatusId`),
  CONSTRAINT `fk_activity_agentId` FOREIGN KEY (`agentId`) REFERENCES `business` (`id`),
  CONSTRAINT `fk_activity_customerId` FOREIGN KEY (`customerId`) REFERENCES `business` (`id`),
  CONSTRAINT `fk_activity_productId` FOREIGN KEY (`productId`) REFERENCES `product` (`id`),
  CONSTRAINT `fk_activity_statusId` FOREIGN KEY (`activityStatusId`) REFERENCES `activitystatus` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `activitystatus` (
  `id` int(11) NOT NULL,
  `status` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `activityId` int(11) DEFAULT NULL,
  `description` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scheduleDate` datetime DEFAULT NULL,
  `seheduleTime` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `noticeDay` int(11) DEFAULT NULL,
  `isClose` tinyint(4) DEFAULT NULL,
  `closeDate` datetime DEFAULT NULL,
  `createBy` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime DEFAULT NULL,
  `updateBy` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updateDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_task_activityId_idx` (`activityId`),
  CONSTRAINT `fk_task_activityId` FOREIGN KEY (`activityId`) REFERENCES `activity` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `usercustomer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customerId` int(11) DEFAULT NULL,
  `createBy` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_userCustomer_idx` (`customerId`),
  CONSTRAINT `fk_userCustomer_customerId` FOREIGN KEY (`customerId`) REFERENCES `business` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
