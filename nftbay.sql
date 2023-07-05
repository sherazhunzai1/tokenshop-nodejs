-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 23, 2022 at 08:06 AM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 8.0.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nftbay`
--

-- --------------------------------------------------------

--
-- Table structure for table `auctions`
--

CREATE TABLE `auctions` (
  `auctionId` int(11) NOT NULL,
  `tokenId` int(11) NOT NULL,
  `owner_address` varchar(255) DEFAULT NULL,
  `transactionHash` varchar(255) DEFAULT NULL,
  `reservePrice` float NOT NULL,
  `highestBid` float NOT NULL DEFAULT 0,
  `endTimeInSeconds` double NOT NULL,
  `isSettled` int(11) NOT NULL DEFAULT 0,
  `highestBidder` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `auctions`
--

INSERT INTO `auctions` (`auctionId`, `tokenId`, `owner_address`, `transactionHash`, `reservePrice`, `highestBid`, `endTimeInSeconds`, `isSettled`, `highestBidder`, `createdAt`, `status`) VALUES
(0, 7, '0xd612716baAc72169e8B120753F258e884aB3f426', 'fgfh', 2, 5, 76767, 0, '0xd612716baAc72169e8B120753F258e884aB3f426', '2022-02-02 12:56:24', 1);

-- --------------------------------------------------------

--
-- Table structure for table `biddings`
--

CREATE TABLE `biddings` (
  `bidding_id` int(11) NOT NULL,
  `auction_id` int(11) NOT NULL,
  `bidder_id` varchar(255) NOT NULL,
  `price` float NOT NULL,
  `transferHash` varchar(255) NOT NULL,
  `settlement` int(11) NOT NULL DEFAULT 0,
  `result` varchar(255) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `cat_id` int(11) NOT NULL,
  `cat_name` varchar(255) DEFAULT NULL,
  `cat_description` varchar(255) DEFAULT NULL,
  `cat_img` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`cat_id`, `cat_name`, `cat_description`, `cat_img`, `createdAt`) VALUES
(1, 'test 1', 'testing', NULL, '2022-11-22 23:05:24'),
(2, 'test 2', 'test 222', NULL, '2022-11-22 23:46:26');

-- --------------------------------------------------------

--
-- Table structure for table `creators`
--

CREATE TABLE `creators` (
  `creatorID` int(11) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `walletAddress` varchar(255) DEFAULT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `bio` longtext CHARACTER SET utf8 DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  `cover` varchar(255) DEFAULT 'cover.png',
  `portfolio` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `creators`
--

INSERT INTO `creators` (`creatorID`, `username`, `walletAddress`, `firstName`, `email`, `lastName`, `bio`, `img`, `cover`, `portfolio`, `instagram`, `twitter`, `facebook`, `createdAt`, `status`) VALUES
(3, 'asim', '0x202185742aBf203f81462b6f53414BA776903dEb', 'Asad', 'asad@gmail.com', 'Ali', NULL, NULL, 'cover.png', NULL, NULL, NULL, NULL, '2022-11-22 09:16:00', 1),
(4, 'test user', 'sabdskabfaksbf344dsfds', 'test33', 'test@gmail.com', 'testing', NULL, NULL, 'cover.png', NULL, NULL, NULL, NULL, '2022-11-22 18:42:12', 1);

-- --------------------------------------------------------

--
-- Table structure for table `fixedprice`
--

CREATE TABLE `fixedprice` (
  `saleId` int(11) NOT NULL,
  `tokenId` int(11) NOT NULL,
  `transactionHash` varchar(255) DEFAULT NULL,
  `owner` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `onSale` int(11) NOT NULL DEFAULT 1,
  `isSold` int(11) NOT NULL DEFAULT 0,
  `isCanceled` int(11) NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `nfts`
--

CREATE TABLE `nfts` (
  `nft_id` int(11) NOT NULL,
  `tokenId` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` longtext CHARACTER SET utf8 DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `creatorWallet` varchar(255) DEFAULT NULL,
  `ownerWallet` varchar(255) DEFAULT NULL,
  `sale` int(11) DEFAULT NULL,
  `auction` int(11) DEFAULT NULL,
  `fixedprice` int(11) DEFAULT NULL,
  `metadata` varchar(255) DEFAULT NULL,
  `transactionHash` varchar(255) DEFAULT NULL,
  `categoryId` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `nfts`
--

INSERT INTO `nfts` (`nft_id`, `tokenId`, `title`, `description`, `image`, `creatorWallet`, `ownerWallet`, `sale`, `auction`, `fixedprice`, `metadata`, `transactionHash`, `categoryId`, `created_at`) VALUES
(1, 1, 'test', 'test desc', NULL, '0x202185742aBf203f81462b6f53414BA776903dEb', '0x202185742aBf203f81462b6f53414BA776903dEb', NULL, NULL, NULL, NULL, NULL, 1, '2022-11-22 18:09:03'),
(2, 2, 'test 2', 'dessscfasf', NULL, '0x202185742aBf203f81462b6f53414BA776903dEb', 'sabdskabfaksbf344dsfds', NULL, NULL, NULL, NULL, NULL, 2, '2022-11-22 18:26:42');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transactonId` varchar(255) NOT NULL,
  `sendedFrom` varchar(255) NOT NULL,
  `recievedTo` varchar(255) NOT NULL,
  `amount` double NOT NULL,
  `tokenId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `transfernft`
--

CREATE TABLE `transfernft` (
  `transferId` int(11) NOT NULL,
  `transferFrom` varchar(255) NOT NULL,
  `transferTo` varchar(255) NOT NULL,
  `amount` float NOT NULL,
  `tokenId` int(11) NOT NULL,
  `transferType` varchar(255) NOT NULL,
  `tranferReferenceId` int(11) NOT NULL,
  `transferHash` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auctions`
--
ALTER TABLE `auctions`
  ADD PRIMARY KEY (`auctionId`);

--
-- Indexes for table `biddings`
--
ALTER TABLE `biddings`
  ADD PRIMARY KEY (`bidding_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`cat_id`);

--
-- Indexes for table `creators`
--
ALTER TABLE `creators`
  ADD PRIMARY KEY (`creatorID`);

--
-- Indexes for table `fixedprice`
--
ALTER TABLE `fixedprice`
  ADD PRIMARY KEY (`saleId`);

--
-- Indexes for table `nfts`
--
ALTER TABLE `nfts`
  ADD PRIMARY KEY (`nft_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transactonId`);

--
-- Indexes for table `transfernft`
--
ALTER TABLE `transfernft`
  ADD PRIMARY KEY (`transferId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `biddings`
--
ALTER TABLE `biddings`
  MODIFY `bidding_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `cat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `creators`
--
ALTER TABLE `creators`
  MODIFY `creatorID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `nfts`
--
ALTER TABLE `nfts`
  MODIFY `nft_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transfernft`
--
ALTER TABLE `transfernft`
  MODIFY `transferId` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
