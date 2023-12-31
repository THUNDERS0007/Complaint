-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 23, 2023 at 12:21 PM
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
-- Database: `testing`
--

-- --------------------------------------------------------

--
-- Table structure for table `complaint`
--

CREATE TABLE `complaint` (
  `complaint_id` int(11) NOT NULL,
  `item` int(11) NOT NULL,
  `issue_detail` text NOT NULL,
  `resolve_dt` date DEFAULT NULL,
  `status` varchar(10) NOT NULL DEFAULT '',
  `created_by` varchar(50) DEFAULT NULL,
  `created_dt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `modify_dt` date DEFAULT NULL,
  `solver` varchar(50) DEFAULT NULL,
  `review` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `complaint`
--

INSERT INTO `complaint` (`complaint_id`, `item`, `issue_detail`, `resolve_dt`, `status`, `created_by`, `created_dt`, `modify_dt`, `solver`, `review`) VALUES
(62, 2, '123', '2023-12-21', 'Solved', 'Aishwarya', '2023-12-21 17:29:48', NULL, 'undefined', ''),
(72, 4, 'i want pc', '2023-12-23', 'Solved', 'Raj', '2023-12-23 11:58:42', NULL, 'Vardhman', ''),
(74, 1, '234', '2023-12-23', 'Solved', 'nmdc1234', '2023-12-23 13:01:13', '2023-12-23', 'nmdc3234', ''),
(76, 3, 'i want pc', '2023-12-23', 'Solved', 'nmdc1237', '2023-12-23 15:41:30', NULL, 'nmdc1234', 'asdf'),
(77, 1, '234', NULL, 'In Process', 'nmdc1237', '2023-12-23 16:05:05', NULL, NULL, 'restart'),
(78, 3, 'not working', NULL, 'In Process', 'nmdc1234', '2023-12-23 16:02:18', NULL, NULL, ''),
(80, 0, '', NULL, 'In Process', 'nmdc1234', '2023-12-23 16:06:29', NULL, NULL, ''),
(81, 1, 'porcessing', NULL, 'In Process', 'nmdc1234', '2023-12-23 16:09:21', '2023-12-23', NULL, '');

-- --------------------------------------------------------

--
-- Table structure for table `complaint_master`
--

CREATE TABLE `complaint_master` (
  `id` int(11) NOT NULL,
  `complaint` varchar(50) NOT NULL,
  `dept_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `complaint_master`
--

INSERT INTO `complaint_master` (`id`, `complaint`, `dept_id`) VALUES
(1, 'Appliances', 2),
(2, 'Wifi', 2),
(3, 'Software', 1),
(4, 'Laptop', 1);

-- --------------------------------------------------------

--
-- Table structure for table `dept`
--

CREATE TABLE `dept` (
  `dept_id` int(11) NOT NULL,
  `dept_name` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `dept`
--

INSERT INTO `dept` (`dept_id`, `dept_name`) VALUES
(1, 'C & IT'),
(2, 'Electronic'),
(3, 'FINANCE');

-- --------------------------------------------------------

--
-- Table structure for table `section`
--

CREATE TABLE `section` (
  `section_id` int(11) NOT NULL,
  `section_name` varchar(250) NOT NULL,
  `dept_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `section`
--

INSERT INTO `section` (`section_id`, `section_name`, `dept_id`) VALUES
(1, 'Staff', 1),
(2, 'Doctor', 1),
(3, 'Server', 2),
(4, 'Server', 2),
(5, 'Accountant', 3),
(6, 'Accountant', 3);

-- --------------------------------------------------------

--
-- Table structure for table `user_id`
--

CREATE TABLE `user_id` (
  `password` varchar(25) NOT NULL DEFAULT '',
  `created_dt` date NOT NULL DEFAULT current_timestamp(),
  `name` varchar(50) NOT NULL DEFAULT '',
  `dept_id` int(11) DEFAULT NULL,
  `Role` varchar(25) DEFAULT NULL,
  `sec_id` int(11) DEFAULT NULL,
  `user_session_id` varchar(255) DEFAULT NULL,
  `sapid` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_id`
--

INSERT INTO `user_id` (`password`, `created_dt`, `name`, `dept_id`, `Role`, `sec_id`, `user_session_id`, `sapid`) VALUES
('1256', '2023-12-11', 'Vardhman', 1, '2', 1, NULL, 'nmdc1234'),
('741', '2023-12-21', 'Raj', 1, '1', 1, NULL, 'nmdc1237'),
('1256', '2023-12-11', 'Aishwarya', 2, '2', 2, NULL, 'nmdc2234'),
('1256', '2023-12-11', 'Rahul', 1, '2', 1, NULL, 'nmdc3234'),
('password4', '2023-12-11', 'Vardhman', 1, 'YourDesignation4', 2, NULL, 'nmdc4234'),
('password5', '2023-12-11', 'Arun', 1, 'YourDesignation5', 1, NULL, 'nmdc5234');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `complaint`
--
ALTER TABLE `complaint`
  ADD PRIMARY KEY (`complaint_id`);

--
-- Indexes for table `complaint_master`
--
ALTER TABLE `complaint_master`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_dept` (`dept_id`);

--
-- Indexes for table `dept`
--
ALTER TABLE `dept`
  ADD PRIMARY KEY (`dept_id`);

--
-- Indexes for table `section`
--
ALTER TABLE `section`
  ADD PRIMARY KEY (`section_id`),
  ADD KEY `dept_section` (`dept_id`);

--
-- Indexes for table `user_id`
--
ALTER TABLE `user_id`
  ADD PRIMARY KEY (`sapid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `complaint`
--
ALTER TABLE `complaint`
  MODIFY `complaint_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `complaint_master`
--
ALTER TABLE `complaint_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `dept`
--
ALTER TABLE `dept`
  MODIFY `dept_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `section`
--
ALTER TABLE `section`
  MODIFY `section_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `complaint_master`
--
ALTER TABLE `complaint_master`
  ADD CONSTRAINT `master_dept` FOREIGN KEY (`dept_id`) REFERENCES `dept` (`dept_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `section`
--
ALTER TABLE `section`
  ADD CONSTRAINT `dept_section` FOREIGN KEY (`dept_id`) REFERENCES `dept` (`dept_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
