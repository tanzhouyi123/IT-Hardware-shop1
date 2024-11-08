-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 08, 2024 at 02:56 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
(1, 5, 1, 11.9, 2, 0, 23.8, 'Fulfilled', '2024-11-08 03:13:02', '2024-11-08 03:13:02'),
(2, 5, 2, 2.3, 10, 0, 23, 'Shipping', '2024-11-08 03:18:20', '2024-11-08 03:18:20'),
(3, 5, 2, 2.3, 20, 0, 46, 'Refund', '2024-11-08 18:40:57', '2024-11-08 18:40:57'),
(4, 5, 3, 10, 1, 0, 10, 'Pending', '2024-11-08 18:40:57', '2024-11-08 18:40:57');

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
(1, 'Hammer', 'Good Quality Hammer for home use', 11.9, 18, 'Supplies', '/uploads/1731005813882_Hammer.jpg', '2024-11-08 02:56:53', '2024-11-08 02:56:53', NULL),
(2, 'Screw', 'Strong Holder Screw', 2.3, 970, 'Supplies', '/uploads/1731005912181_38955f5c-e279-47cb-9235-aac9958a3b3d__77740.jpg', '2024-11-08 02:58:32', '2024-11-08 02:58:32', NULL),
(3, 'Screw Driver', 'Stankey Screw Drew', 10, 99, 'ScrewDriver', '/uploads/1731006227124_OIP.jpeg', '2024-11-08 03:03:47', '2024-11-08 03:03:47', NULL),
(92, 'Nippon Paint', 'Nippon Paint 9000 Gloss Finish', 120, 20, 'Paint', '/uploads/1731006674537_nippon_paint_9000-2-1200x1200.jpg', '2024-11-08 03:11:14', '2024-11-08 03:11:14', NULL);

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
(4, 3, 4, 'Good', 'thanks', '2024-10-22 01:25:39', '2024-10-22 01:34:08'),
(5, 9, 5, '1111111', NULL, '2024-10-30 11:12:48', '2024-11-04 17:20:36'),
(6, 13, 1, 'Fake thor hammer', 'good', '2024-10-30 11:22:35', '2024-10-30 11:22:35'),
(7, 1, 4, 'Good hammer buy two sharing with my family', NULL, '2024-11-08 03:18:40', '2024-11-08 03:18:40');

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
(4, 'James', 'Bond', '0123456789', 'james.bond@gmail.com', 'James@1234', 'User', '2024-10-24 00:28:38', '2024-10-24 00:28:38'),
(5, 'Zhou Yi', 'Tan', '0125903398', 'tanzhouyi123@gmail.com', 'Yi_3301999', 'User', '2024-10-28 15:59:34', '2024-10-28 15:59:34'),
(6, 'Luffy', 'Monkey', '0125903398', 'TANZHOUYI456@GMAIL.COM', 'Zxcv\"1234', 'User', '2024-11-04 17:23:34', '2024-11-04 17:23:34'),
(7, 'Handsome', 'Tan', '0123456789', 'handsome@mail.com', 'Yeaaa_123456', 'User', '2024-11-04 17:32:35', '2024-11-04 17:32:35'),
(8, 'wee', 'Bryan', '0177577978', 'byranwee@mail.com', 'Wee_1234', 'User', '2024-11-04 17:34:03', '2024-11-04 17:34:03'),
(9, 'Mia', 'Khalifa', '0129915571', 'happy@mail.com', 'Happy_1234', 'User', '2024-11-04 17:53:54', '2024-11-04 17:53:54'),
(10, 'Happy', 'Polla', '0145778921', 'pollaisgood@mail.com', 'Polla_1234', 'User', '2024-11-04 18:01:07', '2024-11-04 18:01:07'),
(11, 'Adeline ', 'Chang', '0154789257', 'adelinechang@mail.com', 'Adeline_123', 'User', '2024-11-04 18:11:35', '2024-11-04 18:11:35'),
(12, 'Alice ', 'Chang', '0123456789', 'datobaby@gmail.com', 'Dato_123', 'User', '2024-11-04 18:19:40', '2024-11-04 18:19:40');

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
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
