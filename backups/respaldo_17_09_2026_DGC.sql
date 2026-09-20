CREATE DATABASE  IF NOT EXISTS `db_test_7b` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `db_test_7b`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: db_test_7b
-- ------------------------------------------------------
-- Server version	8.4.9

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
-- Table structure for table `tb_logs`
--

DROP TABLE IF EXISTS `tb_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_logs` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `table_name` varchar(80) NOT NULL,
  `table_operation` enum('Create','Read','Udpate','Delete') DEFAULT NULL,
  `db_user` varchar(80) NOT NULL,
  `table_description` text NOT NULL,
  `operation_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `operation_status` bit(1) DEFAULT b'1',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_logs`
--

LOCK TABLES `tb_logs` WRITE;
/*!40000 ALTER TABLE `tb_logs` DISABLE KEYS */;
INSERT INTO `tb_logs` VALUES (1,'tb_users','Create','root@localhost','Usuario creado. ID=5, email=240709@utxicotepec.edu.mx, nick=SilverDGC68, creation_date=2026-09-10 10:27:36, status=','2026-09-10 10:27:36',_binary ''),(2,'tb_users','Create','root@localhost','Usuario creado. ID=6, email=240710@utxicotepec.edu.mx, nick=SilverDGC69, creation_date=2026-09-10 10:29:02, status=','2026-09-10 10:29:02',_binary ''),(3,'tb_users','Create','root@localhost','Usuario creado. ID=7, email=240711@utxicotepec.edu.mx, nick=SilverDGC70, creation_date=2026-09-10 10:29:32, status=','2026-09-10 10:29:32',_binary ''),(4,'tb_users','Create','rodolfo.ss@DESKTOP-7M9IC15','Usuario creado. ID=8, email=240836@utxicotepec.edu.mx, nick=Rodo00Shadow, creation_date=2026-09-10 11:00:39, status=','2026-09-10 11:00:39',_binary ''),(5,'tb_users','Create','rodolfo.ss@DESKTOP-7M9IC15','Usuario creado. ID=9, email=GalletaSalvaje, nick=Galleta00, creation_date=2026-09-10 11:01:47, status=','2026-09-10 11:01:47',_binary ''),(6,'tb_users','Create','rodolfo.ss@DESKTOP-7M9IC15','Usuario creado. ID=10, email=DomadorGatas, nick=F.Miguel.00, creation_date=2026-09-10 11:02:29, status=','2026-09-10 11:02:29',_binary ''),(7,'tb_users','Delete','root@localhost','Usuario eliminado. ID=7, email=240711@utxicotepec.edu.mx, nick=SilverDGC70, creation_date=2026-09-10 10:29:32, last_update=NULL, last_login=NULL, status=','2026-09-10 11:22:08',_binary ''),(8,'tb_users','Delete','rodolfo.ss@DESKTOP-7M9IC15','Usuario eliminado. ID=5, email=240709@utxicotepec.edu.mx, nick=SilverDGC68, creation_date=2026-09-10 10:27:36, last_update=NULL, last_login=NULL, status=','2026-09-10 11:32:31',_binary ''),(9,'tb_users','Udpate','root@localhost','Usuario actualizado. ID=8, email anterior=240836@utxicotepec.edu.mx, email nuevo=240836@utxicotepec.edu.mx, nick anterior=Rodo00Shadow, nick nuevo=RodoUpdated, last_update=2026-09-10 11:34:24, status anterior=, status nuevo=','2026-09-10 11:34:24',_binary ''),(10,'tb_users','Udpate','rodolfo.ss@DESKTOP-7M9IC15','Usuario actualizado. ID=6, email anterior=240710@utxicotepec.edu.mx, email nuevo=240710@utxicotepec.edu.mx, nick anterior=SilverDGC69, nick nuevo=SilverShadowDGC, last_update=2026-09-10 11:37:25, status anterior=, status nuevo=','2026-09-10 11:37:25',_binary ''),(11,'tb_products','Create','root@localhost','Producto creado: \"Laptop Lenovo ThinkPad\". SKU: LAP-001, Precio: $15499.99, Stock inicial: 10','2026-09-17 12:31:59',_binary ''),(12,'tb_products','Create','root@localhost','Producto creado: \"Memoria Kingston 64GB\". SKU: USB-001, Precio: $179.99, Stock inicial: 30','2026-09-17 12:32:44',_binary ''),(13,'tb_products','Create','Victor.Manuel@DESKTOP-PC3TGIH','Producto creado: \"Monitor Samsung 24\"\". SKU: MON-002, Precio: $2899.99, Stock inicial: 12','2026-09-17 12:42:21',_binary ''),(14,'tb_products','Create','Victor.Manuel@DESKTOP-PC3TGIH','Producto creado: \"Mouse Redragon\". SKU: MOU-002, Precio: $449.50, Stock inicial: 20','2026-09-17 12:42:29',_binary ''),(15,'tb_products','Udpate','root@localhost','Estado:  -> \0;','2026-09-17 18:36:21',_binary ''),(16,'tb_products','Udpate','root@localhost','Estado: \0 -> ;','2026-09-17 18:37:07',_binary ''),(17,'tb_products','Udpate','root@localhost','Estado: 1 -> 0;','2026-09-17 18:39:35',_binary ''),(18,'tb_products','Udpate','root@localhost','Estado: 1 -> 0;','2026-09-17 18:41:05',_binary ''),(19,'tb_products','Udpate','root@localhost','Estado: 0 -> 1;','2026-09-17 18:42:19',_binary ''),(20,'tb_products','Udpate','root@localhost','Estado: 0 -> 1;','2026-09-17 18:43:37',_binary '');
/*!40000 ALTER TABLE `tb_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_products`
--

DROP TABLE IF EXISTS `tb_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_products` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `SKU` varchar(50) NOT NULL,
  `name` varchar(250) NOT NULL,
  `description` text,
  `current_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `current_stock` int unsigned NOT NULL DEFAULT '0',
  `status` bit(1) DEFAULT b'1',
  `creation_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_update` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `SKU` (`SKU`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_products`
--

LOCK TABLES `tb_products` WRITE;
/*!40000 ALTER TABLE `tb_products` DISABLE KEYS */;
INSERT INTO `tb_products` VALUES (2,'LAP-001','Laptop Lenovo ThinkPad','Laptop empresarial con 16 GB de RAM',15499.99,10,_binary '','2026-09-17 12:31:59','2026-09-17 18:43:37'),(3,'USB-001','Memoria Kingston 64GB','Memoria USB 3.2 de 64 GB',179.99,30,_binary '','2026-09-17 12:32:44','2026-09-17 18:42:19'),(4,'MON-002','Monitor Samsung 24\"','Monitor Full HD de 24 pulgadas',2899.99,12,_binary '','2026-09-17 12:42:21','2026-09-17 12:42:21'),(5,'MOU-002','Mouse Redragon','Mouse óptico USB para computadora',449.50,20,_binary '','2026-09-17 12:42:29','2026-09-17 12:42:29');
/*!40000 ALTER TABLE `tb_products` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_tb_products_after_insert` AFTER INSERT ON `tb_products` FOR EACH ROW BEGIN
    INSERT INTO `tb_logs` (
        `table_name`,
        `table_operation`,
        `db_user`,
        `table_description`
    ) VALUES (
        'tb_products',
        'Create',
        USER(),
        CONCAT(
            'Producto creado: "', NEW.name,
            '". SKU: ', NEW.SKU,
            ', Precio: $', NEW.current_price,
            ', Stock inicial: ', NEW.current_stock
        )
    );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_tb_products_after_update` AFTER UPDATE ON `tb_products` FOR EACH ROW BEGIN
    DECLARE changes_detail TEXT DEFAULT '';

    IF NOT (OLD.name <=> NEW.name) THEN
        SET changes_detail = CONCAT(
            changes_detail,
            'Nombre: "', OLD.name, '" -> "', NEW.name, '"; '
        );
    END IF;

    IF NOT (OLD.current_price <=> NEW.current_price) THEN
        SET changes_detail = CONCAT(
            changes_detail,
            'Precio: $', OLD.current_price,
            ' -> $', NEW.current_price, '; '
        );
    END IF;

    IF NOT (OLD.current_stock <=> NEW.current_stock) THEN
        SET changes_detail = CONCAT(
            changes_detail,
            'Stock: ', OLD.current_stock,
            ' -> ', NEW.current_stock, '; '
        );
    END IF;

    IF NOT (OLD.status <=> NEW.status) THEN
        SET changes_detail = CONCAT(
            changes_detail,
            'Estado: ',
            CAST(OLD.status AS UNSIGNED),
            ' -> ',
            CAST(NEW.status AS UNSIGNED),
            '; '
        );
    END IF;

    IF CHAR_LENGTH(changes_detail) > 0 THEN
        INSERT INTO `tb_logs` (
            `table_name`,
            `table_operation`,
            `db_user`,
            `table_description`
        ) VALUES (
            'tb_products',
            'Udpate',
            USER(),
            TRIM(changes_detail)
        );
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `tb_users`
--

DROP TABLE IF EXISTS `tb_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_users` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `nick` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `creation_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_update` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `last_login` datetime DEFAULT NULL,
  `status` bit(1) DEFAULT b'1',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `nick` (`nick`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_users`
--

LOCK TABLES `tb_users` WRITE;
/*!40000 ALTER TABLE `tb_users` DISABLE KEYS */;
INSERT INTO `tb_users` VALUES (6,'240710@utxicotepec.edu.mx','SilverShadowDGC','dc1fdb799a15ce3d7d3922fa459c27ec','2026-09-10 10:29:02','2026-09-10 11:37:25',NULL,_binary ''),(8,'240836@utxicotepec.edu.mx','RodoUpdated','2d387be848b138d5fd490915f299b96a','2026-09-10 11:00:39','2026-09-10 11:34:24',NULL,_binary ''),(9,'GalletaSalvaje','Galleta00','adc7a7d326f88d9f6cdb231e43ead341','2026-09-10 11:01:47',NULL,NULL,_binary ''),(10,'DomadorGatas','F.Miguel.00','802ef872ea9fd361d1064e8729b8b9a7','2026-09-10 11:02:29',NULL,NULL,_binary '');
/*!40000 ALTER TABLE `tb_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_users_after_insert` AFTER INSERT ON `tb_users` FOR EACH ROW BEGIN
    INSERT INTO tb_logs (
        table_name,
        table_operation,
        db_user,
        table_description,
        operation_date,
        operation_status
    )
    VALUES (
        'tb_users',
        'Create',
        USER(),
        CONCAT(
            'Usuario creado. ID=', NEW.ID,
            ', email=', NEW.email,
            ', nick=', NEW.nick,
            ', creation_date=', NEW.creation_date,
            ', status=', NEW.status
        ),
        CURRENT_TIMESTAMP,
        b'1'
    );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_users_after_update` AFTER UPDATE ON `tb_users` FOR EACH ROW BEGIN
    INSERT INTO tb_logs (
        table_name,
        table_operation,
        db_user,
        table_description,
        operation_date,
        operation_status
    )
    VALUES (
        'tb_users',
        'Udpate',
        USER(),
        CONCAT(
            'Usuario actualizado. ID=', NEW.ID,
            ', email anterior=', OLD.email,
            ', email nuevo=', NEW.email,
            ', nick anterior=', OLD.nick,
            ', nick nuevo=', NEW.nick,
            ', last_update=', NEW.last_update,
            ', status anterior=', OLD.status,
            ', status nuevo=', NEW.status
        ),
        CURRENT_TIMESTAMP,
        b'1'
    );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_users_after_delete` AFTER DELETE ON `tb_users` FOR EACH ROW BEGIN
    INSERT INTO tb_logs (
        table_name,
        table_operation,
        db_user,
        table_description,
        operation_date,
        operation_status
    )
    VALUES (
        'tb_users',
        'Delete',
        USER(),
        CONCAT(
            'Usuario eliminado. ID=', OLD.ID,
            ', email=', OLD.email,
            ', nick=', OLD.nick,
            ', creation_date=', OLD.creation_date,
            ', last_update=', COALESCE(OLD.last_update, 'NULL'),
            ', last_login=', COALESCE(OLD.last_login, 'NULL'),
            ', status=', COALESCE(OLD.status, b'0')
        ),
        CURRENT_TIMESTAMP,
        b'1'
    );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Dumping events for database 'db_test_7b'
--

--
-- Dumping routines for database 'db_test_7b'
--
/*!50003 DROP PROCEDURE IF EXISTS `sp_restore_product` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_restore_product`(
    IN p_product_id INT UNSIGNED
)
BEGIN

    IF NOT EXISTS (
        SELECT 1
        FROM tb_products
        WHERE ID = p_product_id
    ) THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El producto especificado no existe';

    END IF;

    IF EXISTS (
        SELECT 1
        FROM tb_products
        WHERE ID = p_product_id
            AND status = b'1'
    ) THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El producto ya se encuentra activo';

    END IF;

    UPDATE tb_products
    SET status = b'1'
    WHERE ID = p_product_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_soft_delete_product` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_soft_delete_product`(
    IN p_product_id INT UNSIGNED
)
BEGIN

    IF NOT EXISTS (
        SELECT 1
        FROM tb_products
        WHERE ID = p_product_id
    ) THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El producto especificado no existe';

    END IF;

    IF EXISTS (
        SELECT 1
        FROM tb_products
        WHERE ID = p_product_id
          AND status = b'0'
    ) THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El producto ya se encuentra eliminado';

    END IF;

    UPDATE tb_products
    SET status = b'0'
    WHERE ID = p_product_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-17 19:05:12
