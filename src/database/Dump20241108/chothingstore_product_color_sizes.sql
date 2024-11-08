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
-- Table structure for table `product_color_sizes`
--

DROP TABLE IF EXISTS `product_color_sizes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_color_sizes` (
  `product_color_size_id` int NOT NULL AUTO_INCREMENT,
  `product_color_fk` int NOT NULL,
  `size_fk` int NOT NULL,
  `stock` tinyint DEFAULT '1',
  PRIMARY KEY (`product_color_size_id`),
  KEY `product_color_fk[product_sizes]_idx` (`product_color_fk`),
  KEY `size_fk[product_color_sizes]_idx` (`size_fk`),
  CONSTRAINT `product_color_fk[product_color_sizes]` FOREIGN KEY (`product_color_fk`) REFERENCES `product_colors` (`product_color_id`) ON DELETE CASCADE,
  CONSTRAINT `size_fk[product_color_sizes]` FOREIGN KEY (`size_fk`) REFERENCES `sizes` (`size_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_color_sizes`
--

LOCK TABLES `product_color_sizes` WRITE;
/*!40000 ALTER TABLE `product_color_sizes` DISABLE KEYS */;
INSERT INTO `product_color_sizes` VALUES (30,23,4,0),(32,24,4,1),(36,26,4,1),(41,29,1,1);
/*!40000 ALTER TABLE `product_color_sizes` ENABLE KEYS */;
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
