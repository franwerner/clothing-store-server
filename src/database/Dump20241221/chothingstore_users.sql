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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `fullname` varchar(226) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `email` varchar(226) NOT NULL,
  `password` varchar(226) NOT NULL,
  `permission` varchar(45) NOT NULL DEFAULT 'standard',
  `ip` varchar(226) NOT NULL,
  `email_confirmed` tinyint NOT NULL DEFAULT '0',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=168 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (109,'Franco Werner','+54 9 343 503-4465','ifrank4444ada123213sd1231311111@gmail.com','$2b$10$amRyhb4wMwz3F0r3z8Q0POqRc3ufT9eMXjkxsmMTXNS8Nwfq9vdW6','standard','::1',0,'2024-12-05 11:16:22'),(110,'Franco Werner','+54 9 343 503-4465','ifrank44441@gmail.com','$2b$10$PZ4J/mvnic2Jh1W9GCTt7O.LxzkD08D8kh7M4GRBx3.MLgwx3cLiK','standard','::1',0,'2024-12-05 11:20:43'),(111,'Franco Werner','+54 9 343 503-4465','ifrank414441@gmail.com','$2b$10$4ZaX8eGyvYGwpsRqbi5wU.g2zW66tAryDomkSc9mec4S.qTCllaLS','standard','::1',0,'2024-12-05 11:21:30'),(112,'Franco Werner','+54 9 343 503-4465','ifrank4114441@gmail.com','$2b$10$r8tofbVFEyETL9A/EPBUmuSV4ZecPX4jsW/RhrkrgTV1/m3xbrYrm','standard','::1',0,'2024-12-05 11:21:54'),(113,'Franco Werner','+54 9 343 503-4465','ifrank41114441@gmail.com','$2b$10$FqRP8sOh8COsojdLl/OvjOQqrdva9ZzhvY2/uqB9TSXow6S2uFY0y','standard','::1',0,'2024-12-05 11:23:06'),(114,'Franco Werner','+54 9 343 503-4465','werner@yopmail.com','$2b$10$8oLspF3i3nkKy6f5Fx3Hsewy79dZmrdzqtNwbKivU2bFggvDdSOWm','standard','::1',1,'2024-12-05 11:24:25'),(115,'Franco Werner','','laco.00@hotmail.com','$2b$10$9Z991uWslNUVagtzgrRzT.dTEFaGt/FbNrcReqvmVJZs8Rboc9cWW','standard','::1',0,'2024-12-05 11:27:51'),(116,'Franco Werner','','laco.030@hotmail.com','$2b$10$qK7qL.leaJ3MFubhCECYledIJIszpEWaw4wv2W1cQhsnktPVtGhb.','standard','::1',0,'2024-12-05 11:29:14'),(123,'Franco Werner','3435707377','joelgermanwerner@hotmail.com','$2b$10$fP9//L.phTX3pO3XY/bQQeKFb087gTCm8xYtWr5lKru226p85R.eW','standard','::1',0,'2024-12-05 12:24:53'),(144,'Karen gaitan','','karengaitann62@gmail.com','$2b$10$p1SPRFhDYwpCcSSWnA6.WOsSGkYhiVfV0CyocWf0zqOXHjA0D8ObS','standard','::1',0,'2024-12-06 11:09:34'),(145,'Franco Werner','','franckwerner22@yopmail.com','$2b$10$4s11nvNTOFJlEsTngZjH0exmZpfDBY2qZ6KGvIDKe0Gfr.rhVzxTe','standard','::1',0,'2024-12-06 12:49:19'),(146,'Franco Werner','','ifrank123@gmail.com','$2b$10$1r4cuxlN6NVuWK0vsxCC5u.U0RkyKxmGpjZzAQs4dI2.FpJfuwYF2','standard','::1',0,'2024-12-06 12:51:20'),(147,'Franco Werner','','adasd@gmail.com','$2b$10$YFwiFRQ1kBhLSzyi.mbRPOwI9o5CaDb7/Op7pgx5zgYvbuceTeBY6','standard','::1',0,'2024-12-06 13:20:16'),(148,'Franco Werner','','ifrank444412@gmail.com','$2b$10$nTwj46/8w0flPGEJz37TOuA2/0t/meVOMvjM7tWeFQd1PTcaxI/C.','standard','::1',0,'2024-12-06 13:23:41'),(152,'Franco Werner','','ifrank444412123@gmail.com','$2b$10$FnMtliTXfkpfalD5.NPe5e.leOzu5oBvj.Vu6bVTbkdSWmC8LsdJm','standard','::1',0,'2024-12-06 13:24:02'),(153,'Franco Werner','','ifrank4444154@gmail.com','$2b$10$hv1p.dqDyXC1bQ.48e5mse4jvckE16uOeRwMMBpIXVjHG2cBCU2Yq','standard','::1',0,'2024-12-06 13:25:15'),(155,'Franco Carlos Werner','3435707377','francktest@yopmail.com','$2b$10$.xsESk7fgJ5utEt7rSsdQeoQQqhNpvp/w5UDOkET93vPD7LkWgu0m','standard','::1',1,'2024-12-08 09:52:54'),(156,'Franco Werner','','franckwernertest2@gmail.com','$2b$10$vwA5tdBOCKmrxn3RUqX52escNfapzbBgsymZaHT0z8N5LAua0UV5.','standard','::1',0,'2024-12-08 11:26:11'),(157,'Franco Werner','','francktest33@yopmail.com','$2b$10$4Z4/.ERWST9mIOe6BIMGY.Ui0qI14sKmsVCwNqWnFsNgBF8HhSWFq','standard','::1',1,'2024-12-08 14:16:50'),(158,'Franco Werner','','francowerner11@yopmail.com','$2b$10$3FN9Fc9RAxE8k.MpdzVOmeuzM/aTx.581drdyApQ5y/b/QDR8.DnS','standard','::1',1,'2024-12-08 14:30:02'),(162,'Franco Werner','','francktest55@yopmail.com','$2b$10$Sc1oB77xuPxjq0.nUfA8MeeeYcf/2QYN8RkuUM9eMEv4F5NZYLxaq','standard','::1',1,'2024-12-08 14:32:07'),(163,'Franco Wernerr','3435707353','francktest44@yopmail.com','$2b$10$pqBDVdWzqDXDkOf08KD.Nu/5SHGQo5R.OY/SRipjzr0Ofw8Zlfw6K','standard','::1',1,'2024-12-08 23:59:23'),(165,'Franco Werner','3435707377','francktest66@yopmail.com','$2b$10$LeAl.SvR8vdVnJzeuGttfOtRMhkCJwzWJuKHE.ixdoVmLFgrcS/x.','standard','::1',1,'2024-12-10 16:21:22'),(166,'Franco Werner','','francktest01@yopmail.com','$2b$10$PD95kV8ILLfehWzWc7elm.uwvq21i39e105fCy57s6x.8Gbx3PlLK','standard','::1',1,'2024-12-10 22:40:31'),(167,'Franco Werner','','francktest02@yopmail.com','$2b$10$5gbZ66dOqWlmuvVwjTu47u76WzVXcXGOZU0hI9BWkB5/P3sPdI/du','standard','::1',0,'2024-12-10 22:48:03');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-21 19:41:38
