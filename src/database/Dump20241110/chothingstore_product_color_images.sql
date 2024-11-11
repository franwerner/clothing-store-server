-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: chothingstore
-- ------------------------------------------------------
-- Server version	8.0.36

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
-- Table structure for table `product_color_images`
--

DROP TABLE IF EXISTS `product_color_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_color_images` (
  `product_color_image_id` int NOT NULL AUTO_INCREMENT,
  `product_color_fk` int NOT NULL,
  `url` text NOT NULL,
  PRIMARY KEY (`product_color_image_id`),
  KEY `product_color_fk[product_color_images]_idx` (`product_color_fk`),
  CONSTRAINT `product_color_fk[product_color_images]` FOREIGN KEY (`product_color_fk`) REFERENCES `product_colors` (`product_color_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_color_images`
--

LOCK TABLES `product_color_images` WRITE;
/*!40000 ALTER TABLE `product_color_images` DISABLE KEYS */;
INSERT INTO `product_color_images` VALUES (33,23,'https://example.com/images/camiseta_azul.jpg'),(34,23,'https://example.com/images/camiseta_azul_frontal.jpg'),(35,24,'https://example.com/images/camiseta_roja.jpg'),(36,25,'https://example.com/images/pantalon_negro.jpg'),(37,25,'https://example.com/images/pantalon_negro_lateral.jpg'),(38,26,'https://example.com/images/pantalon_azul.jpg'),(41,29,'https://example.com/images/sudadera_gris.jpg'),(42,29,'https://example.com/images/sudadera_gris_detras.jpg');
/*!40000 ALTER TABLE `product_color_images` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-10 23:08:49
