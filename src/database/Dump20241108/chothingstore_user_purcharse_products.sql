-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: chothingstore
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `user_purcharse_products`
--

DROP TABLE IF EXISTS `user_purcharse_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_purcharse_products` (
  `user_purcharse_product_id` int NOT NULL AUTO_INCREMENT,
  `product_fk` int NOT NULL,
  `user_purcharse_fk` int NOT NULL,
  `color_fk` int NOT NULL,
  `size_fk` int NOT NULL,
  PRIMARY KEY (`user_purcharse_product_id`),
  KEY `product_fk[user_purcharse_products]_idx` (`product_fk`),
  KEY `user_purcharse_fk[user_purcharse_products]_idx` (`user_purcharse_fk`),
  KEY `color_fk[user_purcharse_products]_idx` (`color_fk`),
  KEY `size_fk[user_purcharse_products]_idx` (`size_fk`),
  CONSTRAINT `color_fk[user_purcharse_products]` FOREIGN KEY (`color_fk`) REFERENCES `colors` (`color_id`),
  CONSTRAINT `product_fk[user_purcharse_products]` FOREIGN KEY (`product_fk`) REFERENCES `products` (`product_id`),
  CONSTRAINT `size_fk[user_purcharse_products]` FOREIGN KEY (`size_fk`) REFERENCES `sizes` (`size_id`),
  CONSTRAINT `user_purcharse_fk[user_purcharse_products]` FOREIGN KEY (`user_purcharse_fk`) REFERENCES `user_purchases` (`user_purcharse_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_purcharse_products`
--

LOCK TABLES `user_purcharse_products` WRITE;
/*!40000 ALTER TABLE `user_purcharse_products` DISABLE KEYS */;
INSERT INTO `user_purcharse_products` VALUES (4,568,1,2,4);
/*!40000 ALTER TABLE `user_purcharse_products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-08 16:50:08
