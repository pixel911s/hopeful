CREATE TABLE `note` (
  `id` int(11) NOT NULL,
  `customerId` int(11) DEFAULT NULL,
  `description` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createBy` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime DEFAULT NULL,
  `updateBy` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updateDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_note_customerId_idx` (`customerId`),
  CONSTRAINT `fk_note_customerId` FOREIGN KEY (`customerId`) REFERENCES `business` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
