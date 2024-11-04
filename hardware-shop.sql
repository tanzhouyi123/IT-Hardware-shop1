-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 27, 2024 at 04:40 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hardware-shop`
--
CREATE DATABASE IF NOT EXISTS `hardware-shop` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `hardware-shop`;

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `cart_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `price` double NOT NULL,
  `quantity` int(11) NOT NULL,
  `shipping_fee` double NOT NULL,
  `total_amount` double NOT NULL,
  `status` enum('Pending','Shipping','Fulfilled','Refund') NOT NULL DEFAULT 'Pending',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `product_id`, `price`, `quantity`, `shipping_fee`, `total_amount`, `status`, `updated_at`, `created_at`) VALUES
(1, 3, 1, 650.5, 1, 0, 650.5, 'Pending', '2024-10-21 00:44:21', '2024-08-21 00:44:21'),
(2, 3, 4, 490, 1, 0, 490, 'Shipping', '2024-10-21 00:48:14', '2024-09-22 00:48:14'),
(3, 3, 3, 490, 4, 0, 1960, 'Fulfilled', '2024-10-21 00:48:46', '2024-10-23 00:48:46'),
(4, 4, 3, 550, 2, 0, 1100, 'Fulfilled', '2024-10-21 00:49:43', '2024-10-25 00:49:43'),
(5, 4, 4, 490, 1, 0, 490, 'Shipping', '2024-10-21 12:28:12', '2024-10-27 12:28:12'),
(6, 4, 5, 650, 2, 0, 1300, 'Shipping', '2024-10-27 22:44:23', '2024-10-27 22:44:23'),
(7, 4, 1, 850.5, 2, 0, 1701, 'Pending', '2024-10-27 22:55:30', '2024-10-27 22:55:30');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` double NOT NULL DEFAULT 0,
  `stock` int(11) NOT NULL DEFAULT 0,
  `category` varchar(255) NOT NULL,
  `cover` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `name`, `description`, `price`, `stock`, `category`, `cover`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Intel CPU i7', 'Powerful Intel i7 CPU', 850.5, 18, 'CPU', '/uploads/1730011411450_intel-i7.webp', '2024-10-14 23:03:09', '2024-10-14 23:03:09', NULL),
(2, 'Intel CPU i5', 'Powerful i5 CPU', 450, 20, 'CPU', '/uploads/1730012016325_intel-i5.jpg', '2024-10-14 23:05:27', '2024-10-14 23:05:27', '2024-10-27 22:32:36'),
(3, 'AMD CPU R7', 'Powerful R7 CPU', 550, 20, 'CPU', '/uploads/1730012083523_AMD-R7.jpg', '2024-10-14 23:07:21', '2024-10-14 23:07:21', NULL),
(4, 'AMD CPU R5', 'Powerful R5 CPU', 490, 0, 'CPU', '/uploads/1730012103028_AMD-R5.jpg', '2024-10-14 23:07:59', '2024-10-14 23:07:59', NULL),
(5, 'Adata DDR4 3200 RAM (32GB)', 'DDR4 offers multiple advantages over previous DRAM generations, and ADATA provides the highest quality and the fastest performance. Our Premier DDR4 3200 SO-DIMM memory modules for notebooks arrive in convenient 8GB to 32GB for instant upgrades on any compatible notebook. They deliver faster data transfers than DDR3, coupled with lower energy consumption that reduces heat and extends battery life. Our DDR4 is also optimized to unlock the power of the newest Intel/AMD processors.', 650, 28, 'RAM', '/uploads/1730012803038_Adata-ddr4-3200-32GB.png', '2024-10-27 15:06:43', '2024-10-27 15:06:43', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text NOT NULL,
  `admin_reply` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`review_id`, `order_id`, `rating`, `comment`, `admin_reply`, `created_at`, `updated_at`) VALUES
(3, 2, 3, 'Nice Product', 'Thanks Your Review 👍', '2024-10-22 01:11:01', '2024-10-22 01:22:11'),
(4, 3, 4, 'Good', NULL, '2024-10-22 01:25:39', '2024-10-22 01:34:08');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','User') NOT NULL DEFAULT 'User',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `phone_number`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'Admin', '0125567894', 'admin@gmail.com', 'Admin@1234', 'Admin', '2024-10-14 00:00:00', '2024-10-14 00:00:00'),
(3, 'Tomas', 'Tan', '0125647156', 'tomas.tan@gmail.com', 'Tomas@1234', 'User', '2024-10-14 21:02:31', '2024-10-14 21:02:31'),
(4, 'James', 'Bond', '0123456789', 'james.bond@gmail.com', 'James@1234', 'User', '2024-10-24 00:28:38', '2024-10-24 00:28:38');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`cart_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
