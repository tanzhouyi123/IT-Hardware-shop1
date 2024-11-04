-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.27-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for hardware-shop
DROP DATABASE IF EXISTS `hardware-shop`;
CREATE DATABASE IF NOT EXISTS `hardware-shop` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `hardware-shop`;

-- Dumping structure for table hardware-shop.products
DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` double NOT NULL DEFAULT 0,
  `stock` int(11) NOT NULL DEFAULT 0,
  `category` varchar(255) NOT NULL,
  `cover` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table hardware-shop.products: ~4 rows (approximately)
DELETE FROM `products`;
INSERT INTO `products` (`product_id`, `name`, `description`, `price`, `stock`, `category`, `cover`, `created_at`, `updated_at`) VALUES
	(1, 'Intel CPU i7', 'Powerful i7 CPU', 650.5, 20, 'CPU', 'https://down-my.img.susercontent.com/file/my-11134207-7r98s-lt43odaals1062.webp', '2024-10-14 23:03:09', '2024-10-14 23:03:09'),
	(2, 'Intel CPU i5', 'Powerful i5 CPU', 450, 10, 'CPU', 'https://i.ebayimg.com/images/g/PpYAAOSwCEpiDWmu/s-l500.jpg', '2024-10-14 23:05:27', '2024-10-14 23:05:27'),
	(3, 'AMD CPU R7', 'Powerful R7 CPU', 550, 20, 'CPU', 'https://microless.com/cdn/products/56df232fc7d3576f19031496efe567e0-hi.jpg', '2024-10-14 23:07:21', '2024-10-14 23:07:21'),
	(4, 'AMD CPU R5', 'Powerful R5 CPU', 490, 5, 'CPU', 'https://microless.com/cdn/products/12940642bb2aae900b2a595cbb33091d-hi.jpg', '2024-10-14 23:07:59', '2024-10-14 23:07:59');

-- Dumping structure for table hardware-shop.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ADMIN','USER') NOT NULL DEFAULT 'USER',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
