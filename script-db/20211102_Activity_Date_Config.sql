CREATE TABLE `activitydateconfig` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `display` varchar(100) DEFAULT NULL,
  `condition` int DEFAULT NULL,
  `username` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
