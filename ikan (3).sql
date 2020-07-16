-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 16, 2020 at 04:46 AM
-- Server version: 10.4.6-MariaDB
-- PHP Version: 7.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ikan`
--

-- --------------------------------------------------------

--
-- Table structure for table `data_detail_pemesanan`
--

CREATE TABLE `data_detail_pemesanan` (
  `id_dp` int(11) NOT NULL,
  `harga` int(11) NOT NULL,
  `jml_produk` int(11) NOT NULL,
  `sub_total` int(11) NOT NULL,
  `id_pemesanan` int(11) NOT NULL,
  `id_produk` int(11) NOT NULL,
  `berat_akhir` int(11) DEFAULT NULL,
  `catatan` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `data_detail_pemesanan`
--

INSERT INTO `data_detail_pemesanan` (`id_dp`, `harga`, `jml_produk`, `sub_total`, `id_pemesanan`, `id_produk`, `berat_akhir`, `catatan`) VALUES
(1, 23000, 50, 1150000, 1, 18, 51, ''),
(2, 23000, 30, 69000, 2, 18, NULL, ''),
(3, 29000, 30, 87000, 3, 19, NULL, '');

-- --------------------------------------------------------

--
-- Table structure for table `data_detail_pengiriman`
--

CREATE TABLE `data_detail_pengiriman` (
  `id_detail_pengiriman` int(11) NOT NULL,
  `id_pengiriman` int(11) NOT NULL,
  `id_pemesanan` int(11) NOT NULL,
  `urutan` int(11) NOT NULL,
  `status` enum('menunggu','pengantaran','terkirim') NOT NULL,
  `penerima` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `data_detail_pengiriman`
--

INSERT INTO `data_detail_pengiriman` (`id_detail_pengiriman`, `id_pengiriman`, `id_pemesanan`, `urutan`, `status`, `penerima`) VALUES
(1, 1, 1, 1, 'pengantaran', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `data_jam_pengiriman`
--

CREATE TABLE `data_jam_pengiriman` (
  `id_jampengiriman` int(11) NOT NULL,
  `jam_pengiriman` time NOT NULL,
  `id_usaha` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `data_jam_pengiriman`
--

INSERT INTO `data_jam_pengiriman` (`id_jampengiriman`, `jam_pengiriman`, `id_usaha`) VALUES
(3, '09:00:00', 2),
(4, '16:00:00', 2),
(21, '08:00:00', 1),
(26, '16:00:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `data_kelompok_tani`
--

CREATE TABLE `data_kelompok_tani` (
  `id_kelompoktani` int(11) NOT NULL,
  `nama_kelompoktani` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `data_kelompok_tani`
--

INSERT INTO `data_kelompok_tani` (`id_kelompoktani`, `nama_kelompoktani`) VALUES
(1, 'Mina Jaya'),
(2, 'Mina Maju'),
(3, 'Dadi Mulyo'),
(4, 'Ngudi Makmur'),
(5, 'Nggrowong');

-- --------------------------------------------------------

--
-- Table structure for table `data_kelompok_tani_usaha`
--

CREATE TABLE `data_kelompok_tani_usaha` (
  `id_keltaniusaha` int(11) NOT NULL,
  `id_kelompoktani` int(11) NOT NULL,
  `id_usaha` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `data_kelompok_tani_usaha`
--

INSERT INTO `data_kelompok_tani_usaha` (`id_keltaniusaha`, `id_kelompoktani`, `id_usaha`) VALUES
(4, 3, 2),
(5, 4, 2),
(30, 1, 1),
(31, 4, 1),
(32, 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `data_kendaraan`
--

CREATE TABLE `data_kendaraan` (
  `id_kendaraan` int(11) NOT NULL,
  `jenis_kendaraan` varchar(10) NOT NULL,
  `plat_kendaraan` varchar(10) NOT NULL,
  `kapasitas_kendaraan` int(11) NOT NULL,
  `id_usaha` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `data_kendaraan`
--

INSERT INTO `data_kendaraan` (`id_kendaraan`, `jenis_kendaraan`, `plat_kendaraan`, `kapasitas_kendaraan`, `id_usaha`) VALUES
(1, 'Truk', 'AB', 1000, 1),
(8, '4', '4', 4, 2),
(12, 'Motor', 'AB', 500, 1),
(13, 'gui', '345678', 34567, 1);

-- --------------------------------------------------------

--
-- Table structure for table `data_kurir`
--

CREATE TABLE `data_kurir` (
  `id_kurir` int(11) NOT NULL,
  `nama_kurir` varchar(30) NOT NULL,
  `foto_kurir` text NOT NULL,
  `jk_kurir` enum('Laki-laki','Perempuan') NOT NULL,
  `telp_kurir` varchar(13) NOT NULL,
  `id_usaha` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `data_kurir`
--

INSERT INTO `data_kurir` (`id_kurir`, `nama_kurir`, `foto_kurir`, `jk_kurir`, `telp_kurir`, `id_usaha`) VALUES
(29, 'Aku', '13072020130922Capture.JPG', 'Laki-laki', '085209090909', 1);

-- --------------------------------------------------------

--
-- Table structure for table `data_master_bank`
--

CREATE TABLE `data_master_bank` (
  `kode_bank` int(11) NOT NULL,
  `nama_bank` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `data_master_bank`
--

INSERT INTO `data_master_bank` (`kode_bank`, `nama_bank`) VALUES
(1, 'Bank Republik Indonesia (BRI)'),
(2, 'Bank Central Asia (BCA)'),
(3, 'Bank Mandiri'),
(4, 'Bank Negara Indonesia (BNI)'),
(5, 'Bank Pembangunan Daerah (BPD) ');

-- --------------------------------------------------------

--
-- Table structure for table `data_pembayaran`
--

CREATE TABLE `data_pembayaran` (
  `id_pembayaran` int(11) NOT NULL,
  `metode_pembayaran` enum('Full Cash','Full Transfer','Transfer Cash') NOT NULL,
  `expiredDate` datetime NOT NULL,
  `waktu_pembayaran` datetime DEFAULT NULL,
  `kode_bank` int(11) DEFAULT NULL,
  `no_rekening_pb` varchar(13) DEFAULT NULL,
  `nama_rekening_pb` varchar(50) DEFAULT NULL,
  `struk_pembayaran` varchar(100) DEFAULT NULL,
  `status_pembayaran` enum('DP','Lunas') DEFAULT NULL,
  `id_pemesanan` int(11) NOT NULL,
  `verifikasi` enum('0','1') NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `data_pembayaran`
--

INSERT INTO `data_pembayaran` (`id_pembayaran`, `metode_pembayaran`, `expiredDate`, `waktu_pembayaran`, `kode_bank`, `no_rekening_pb`, `nama_rekening_pb`, `struk_pembayaran`, `status_pembayaran`, `id_pemesanan`, `verifikasi`) VALUES
(1, 'Full Transfer', '2020-07-07 19:55:24', '2020-07-07 19:56:03', 1, '222098789', 'DAno', '07072020135603kk.JPG', 'Lunas', 1, '1'),
(2, 'Full Transfer', '2020-07-12 18:05:51', NULL, NULL, NULL, NULL, NULL, NULL, 2, '0'),
(3, 'Transfer Cash', '2020-07-13 15:46:04', '2020-07-15 00:00:00', 2, '123213213', 'Isel', '07072020135603kk.JPG', 'DP', 3, '0');

-- --------------------------------------------------------

--
-- Table structure for table `data_pembeli`
--

CREATE TABLE `data_pembeli` (
  `id_pb` int(11) NOT NULL,
  `nama_pb` varchar(30) NOT NULL,
  `foto_pb` varchar(100) NOT NULL,
  `jk_pb` enum('Laki-laki','Perempuan') NOT NULL,
  `tgllahir_pb` date NOT NULL,
  `telp_pb` varchar(13) NOT NULL,
  `alamat_pb` text NOT NULL,
  `kab_pb` varchar(20) NOT NULL,
  `kec_pb` varchar(20) NOT NULL,
  `kel_pb` varchar(20) NOT NULL,
  `longitude_pb` double NOT NULL,
  `latitude_pb` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `data_pembeli`
--

INSERT INTO `data_pembeli` (`id_pb`, `nama_pb`, `foto_pb`, `jk_pb`, `tgllahir_pb`, `telp_pb`, `alamat_pb`, `kab_pb`, `kec_pb`, `kel_pb`, `longitude_pb`, `latitude_pb`) VALUES
(1, 'Danang', '', 'Laki-laki', '2019-04-17', 'HAHAHA', 'HAHAHA', 'HA', 'HA', 'HA', 0, 0),
(8, 'Lo', '18072019174612Screenshot_2019-07-18-22-25-29-594_com.iseld.png', 'Perempuan', '2019-07-27', '08526164', 'Lo', 'Lo', 'Lo', 'Lo', 0, 0),
(13, 'sad', '18072019175817IMG_20181119_110549_780.jpg', 'Perempuan', '2019-07-17', '12345678910', 'swx', 'sad', 'sad', 'sad', 0, 0),
(14, 'Riselda Lalusu', 'ndol.jpg', 'Laki-laki', '1996-07-07', '0812340759128', 'Jl. Sagan GK V/1028 Terban', 'Kota Yogyakarta', 'Gondokusuman', 'Terban', 110.3782822, -7.7792996),
(15, '', '', '', '0000-00-00', '', '', '', '', '', -7.765993040246785, 110.35743000274658),
(16, 'hoho', '', 'Perempuan', '0000-00-00', '', '', '', '', '', 110.35743000274658, -7.765993040246785),
(17, '', '', '', '0000-00-00', '', '', '', '', '', -7.765993040246785, 110.35743000274658),
(18, '', '', '', '0000-00-00', '', '', '', '', '', -7.765993040246785, 110.35743000274658),
(19, 'Suto Wijoyo Kusumo', '09092019221746foto.jpg', 'Laki-laki', '1995-05-09', '0813079128', 'JL. Madrim 15', 'Sleman', ' Kalasan', 'Purwomartani', 110.399534, -7.7541948),
(42, 'suto', '', 'Laki-laki', '2019-03-06', '', '', '', '', '', -7.7541948, 110.399534);

-- --------------------------------------------------------

--
-- Table structure for table `data_pemesanan`
--

CREATE TABLE `data_pemesanan` (
  `id_pemesanan` int(11) NOT NULL,
  `waktu_pemesanan` datetime NOT NULL,
  `tipe_pengiriman` enum('Biasa','Cepat','Ambil di Toko') NOT NULL,
  `tgl_pengiriman` date NOT NULL,
  `jarak` float DEFAULT NULL,
  `biaya_kirim` int(11) NOT NULL,
  `total_harga` int(11) NOT NULL,
  `status_pemesanan` enum('Baru','Terbayar','Siap Dikirim','Siap Diambil','Pengiriman','Terkirim') NOT NULL,
  `id_pb` int(11) NOT NULL,
  `id_usaha` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `data_pemesanan`
--

INSERT INTO `data_pemesanan` (`id_pemesanan`, `waktu_pemesanan`, `tipe_pengiriman`, `tgl_pengiriman`, `jarak`, `biaya_kirim`, `total_harga`, `status_pemesanan`, `id_pb`, `id_usaha`) VALUES
(1, '2020-07-07 18:55:24', 'Cepat', '2020-07-15', 6.9, 12000, 127000, 'Siap Dikirim', 14, 1),
(2, '2020-07-12 17:05:51', 'Biasa', '2020-07-13', 6.9, 12000, 81000, 'Baru', 14, 1),
(3, '2020-07-13 14:46:04', 'Ambil di Toko', '2020-07-17', 6.9, 12000, 99000, 'Baru', 14, 1);

-- --------------------------------------------------------

--
-- Table structure for table `data_pengguna`
--

CREATE TABLE `data_pengguna` (
  `id_pengguna` int(11) NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(100) NOT NULL,
  `id_akun` int(11) NOT NULL,
  `level_user` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `data_pengguna`
--

INSERT INTO `data_pengguna` (`id_pengguna`, `username`, `password`, `id_akun`, `level_user`) VALUES
(1, 'isel', 'isel', 1, 'admin'),
(19, 'hoho', 'hoho', 16, 'pembeli'),
(32, 'lalusu', 'lalusu', 20, 'penjual'),
(33, 'pembeli', 'pembeli', 14, 'pembeli'),
(40, 'penjual', 'penjual', 23, 'penjual'),
(42, 'suto', 'suto', 19, 'pembeli'),
(47, 'penjual123', 'penjual123', 34, 'penjual');

-- --------------------------------------------------------

--
-- Table structure for table `data_pengiriman`
--

CREATE TABLE `data_pengiriman` (
  `id_pengiriman` int(11) NOT NULL,
  `waktu_pengiriman` datetime NOT NULL,
  `id_jam_pengiriman` int(11) NOT NULL,
  `id_kurir` int(11) NOT NULL,
  `id_kendaraan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `data_pengiriman`
--

INSERT INTO `data_pengiriman` (`id_pengiriman`, `waktu_pengiriman`, `id_jam_pengiriman`, `id_kurir`, `id_kendaraan`) VALUES
(1, '2020-07-18 10:00:00', 3, 29, 1);

-- --------------------------------------------------------

--
-- Table structure for table `data_penjual`
--

CREATE TABLE `data_penjual` (
  `id_pj` int(11) NOT NULL,
  `nama_pj` varchar(30) NOT NULL,
  `foto_pj` varchar(100) NOT NULL,
  `noktp_pj` varchar(16) NOT NULL,
  `fotoktp_pj` varchar(300) NOT NULL,
  `jk_pj` enum('Perempuan','Laki-laki') NOT NULL,
  `tgllahir_pj` date NOT NULL,
  `alamat_pj` text NOT NULL,
  `telp_pj` varchar(13) NOT NULL,
  `jenis_petani` enum('Tawar','Laut') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `data_penjual`
--

INSERT INTO `data_penjual` (`id_pj`, `nama_pj`, `foto_pj`, `noktp_pj`, `fotoktp_pj`, `jk_pj`, `tgllahir_pj`, `alamat_pj`, `telp_pj`, `jenis_petani`) VALUES
(19, 'Danang Arif Rahmanda', 'fotoRisel.jpg', '1234123412341212', 'ktpdanang.jpg', 'Perempuan', '1995-05-03', 'Madrim 15 T Madrim 15 T Madrim 15 T Madrim 15 T Madrim 15 T', '081230750129', 'Tawar'),
(23, 'Dananggg', 'fotoDanang.jpg', '123123', 'ktpDanang.jpg', 'Perempuan', '1996-07-07', 'Terban okokok', '085261641500', 'Tawar'),
(33, 'Wagiman', 'wagiman.jpeg', '123123xxx', 'wagiman.jpeg', 'Perempuan', '2020-05-12', 'Jl. Permadi', '0812xxxxxxxx', 'Tawar'),
(34, 'Asmad', '14072020090035IMG_20200611_123943.jpg', '2132184924347329', '14072020090035image (6).png', 'Laki-laki', '1985-06-13', 'Jl. aaaa', '081257575757', 'Tawar');

-- --------------------------------------------------------

--
-- Table structure for table `data_produk`
--

CREATE TABLE `data_produk` (
  `id_produk` int(11) NOT NULL,
  `id_usaha` int(11) NOT NULL,
  `nama_produk` varchar(30) NOT NULL,
  `kategori` enum('tawar','laut') NOT NULL,
  `foto_produk` varchar(100) NOT NULL,
  `berat_produk` int(11) NOT NULL,
  `min_pemesanan` int(11) NOT NULL,
  `status_p` enum('aktif','tidak aktif') NOT NULL DEFAULT 'tidak aktif'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `data_produk`
--

INSERT INTO `data_produk` (`id_produk`, `id_usaha`, `nama_produk`, `kategori`, `foto_produk`, `berat_produk`, `min_pemesanan`, `status_p`) VALUES
(21, 1, 'Gurame', 'tawar', 'Gurame1.jpg', 7, 10, 'aktif'),
(27, 1, 'Lele', 'tawar', 'Lele1.jpg', 2, 10, 'aktif'),
(34, 1, 'Patin', 'tawar', 'Patin1.jpg', 5, 10, 'aktif'),
(35, 2, 'Nila ABC', 'tawar', 'Nila2.jpg', 3, 10, 'tidak aktif'),
(37, 6, 'Ikan Bawal', 'tawar', 'bawal-wagiman.jpeg', 3, 10, 'tidak aktif'),
(47, 1, 'Bawal', 'tawar', '13072020111658ikan-bawal.jpg', 3, 10, 'aktif'),
(48, 1, 'Ikan Mas', 'tawar', '13072020114710images_(1).jpeg', 6, 10, 'aktif'),
(61, 1, 'Nila Sedang', 'tawar', '130720201222132793683185_(1).jpg', 2, 10, 'aktif'),
(64, 1, 'Nila Super', 'tawar', '130720201223102793683185_(1).jpg', 5, 10, 'aktif');

-- --------------------------------------------------------

--
-- Table structure for table `data_rekening`
--

CREATE TABLE `data_rekening` (
  `id_rekening` int(11) NOT NULL,
  `kode_bank` int(11) NOT NULL,
  `id_akun` int(11) NOT NULL,
  `no_rekening` varchar(16) NOT NULL,
  `nama_rekening` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `data_rekening`
--

INSERT INTO `data_rekening` (`id_rekening`, `kode_bank`, `id_akun`, `no_rekening`, `nama_rekening`) VALUES
(1, 1, 1, '12345678', 'Riselda'),
(6, 2, 20, '', ''),
(7, 2, 20, '098765432', 'Annisa'),
(8, 2, 1, '0123120234', 'Riselda Rahma'),
(10, 4, 23, '0372413210', 'Riselda Rahma Annisa');

-- --------------------------------------------------------

--
-- Table structure for table `data_track_kurir`
--

CREATE TABLE `data_track_kurir` (
  `id_track` int(11) NOT NULL,
  `id_kurir` int(11) NOT NULL,
  `longitude` double NOT NULL,
  `latitude` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `data_usaha`
--

CREATE TABLE `data_usaha` (
  `id_usaha` int(11) NOT NULL,
  `nama_usaha` varchar(30) NOT NULL,
  `foto_usaha` varchar(100) NOT NULL,
  `alamat_usaha` text NOT NULL,
  `jamBuka` time NOT NULL,
  `jamTutup` time NOT NULL,
  `jml_kapal` int(11) NOT NULL,
  `kapasitas_kapal` int(11) NOT NULL,
  `jml_kolam` int(11) NOT NULL,
  `kab` varchar(30) NOT NULL,
  `kec` varchar(30) NOT NULL,
  `kel` varchar(30) NOT NULL,
  `longitude` double DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `id_pj` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `data_usaha`
--

INSERT INTO `data_usaha` (`id_usaha`, `nama_usaha`, `foto_usaha`, `alamat_usaha`, `jamBuka`, `jamTutup`, `jml_kapal`, `kapasitas_kapal`, `jml_kolam`, `kab`, `kec`, `kel`, `longitude`, `latitude`, `id_pj`) VALUES
(1, 'Pemancingan Moro Seneng', 'fotousaha.jpg', 'Jalan Selokan Mataram No.28', '08:00:00', '18:00:00', 0, 0, 11, 'Sleman', 'Depok', 'Maguwoharjo', 110.4195183, -7.7693867, 23),
(2, 'Pemancingan ABC', 'fotousahajendul.jpg', 'jalanin dulu aja', '08:00:00', '17:00:00', 0, 0, 5, 'A', 'B', 'C', 110.4012461, -7.7821344, 19),
(6, 'Kulakan Ikan Segar', 'usahaWagiman.jpg', 'Jl. Permadi Karangmojo', '08:00:00', '17:00:00', 0, 0, 5, 'Sleman', 'Kalasan', 'Purwomartani', 110.4511612, -7.7506239, 33);

-- --------------------------------------------------------

--
-- Table structure for table `data_variasi`
--

CREATE TABLE `data_variasi` (
  `id_variasi` int(11) NOT NULL,
  `nama_variasi` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `data_variasi`
--

INSERT INTO `data_variasi` (`id_variasi`, `nama_variasi`) VALUES
(1, 'Mentah utuh'),
(2, 'Mentah potong'),
(3, 'Hidup');

-- --------------------------------------------------------

--
-- Table structure for table `data_variasi_produk`
--

CREATE TABLE `data_variasi_produk` (
  `id_variasiproduk` int(11) NOT NULL,
  `id_produk` int(11) NOT NULL,
  `id_variasi` int(11) NOT NULL,
  `harga` int(11) NOT NULL,
  `stok` int(11) NOT NULL DEFAULT 0,
  `status_vp` enum('aktif','tidak aktif') NOT NULL DEFAULT 'tidak aktif'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `data_variasi_produk`
--

INSERT INTO `data_variasi_produk` (`id_variasiproduk`, `id_produk`, `id_variasi`, `harga`, `stok`, `status_vp`) VALUES
(8, 34, 3, 25000, 1000, 'aktif'),
(12, 27, 1, 25000, 1000, 'aktif'),
(16, 27, 2, 25000, 1000, 'aktif'),
(17, 21, 2, 50000, 1000, 'aktif'),
(18, 21, 1, 50000, 1000, 'aktif'),
(19, 34, 1, 25000, 1000, 'aktif'),
(20, 35, 2, 8800, 1000, 'tidak aktif'),
(22, 37, 1, 28000, 1000, 'tidak aktif'),
(50, 47, 1, 22000, 1000, 'aktif'),
(51, 47, 2, 22000, 1000, 'aktif'),
(52, 47, 3, 22000, 1000, 'aktif'),
(54, 21, 3, 50000, 1000, 'aktif'),
(55, 48, 1, 36000, 1000, 'aktif'),
(56, 48, 2, 36000, 1000, 'aktif'),
(57, 48, 3, 36000, 1000, 'aktif'),
(58, 34, 2, 25000, 1000, 'aktif'),
(59, 27, 3, 25000, 1000, 'aktif'),
(96, 61, 1, 34000, 500, 'aktif'),
(97, 61, 2, 34000, 500, 'aktif'),
(98, 61, 3, 34000, 500, 'aktif'),
(105, 64, 1, 36000, 500, 'aktif'),
(106, 64, 2, 36000, 500, 'aktif'),
(107, 64, 3, 36000, 500, 'aktif');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `data_detail_pemesanan`
--
ALTER TABLE `data_detail_pemesanan`
  ADD PRIMARY KEY (`id_dp`),
  ADD KEY `id_produk` (`id_produk`),
  ADD KEY `id_pemesanan` (`id_pemesanan`);

--
-- Indexes for table `data_detail_pengiriman`
--
ALTER TABLE `data_detail_pengiriman`
  ADD PRIMARY KEY (`id_detail_pengiriman`),
  ADD KEY `id_pengiriman` (`id_pengiriman`),
  ADD KEY `id_pemesanan` (`id_pemesanan`);

--
-- Indexes for table `data_jam_pengiriman`
--
ALTER TABLE `data_jam_pengiriman`
  ADD PRIMARY KEY (`id_jampengiriman`),
  ADD KEY `id_toko` (`id_usaha`);

--
-- Indexes for table `data_kelompok_tani`
--
ALTER TABLE `data_kelompok_tani`
  ADD PRIMARY KEY (`id_kelompoktani`);

--
-- Indexes for table `data_kelompok_tani_usaha`
--
ALTER TABLE `data_kelompok_tani_usaha`
  ADD PRIMARY KEY (`id_keltaniusaha`),
  ADD KEY `id_kelompoktani` (`id_kelompoktani`),
  ADD KEY `id_toko` (`id_usaha`);

--
-- Indexes for table `data_kendaraan`
--
ALTER TABLE `data_kendaraan`
  ADD PRIMARY KEY (`id_kendaraan`),
  ADD KEY `id_toko` (`id_usaha`);

--
-- Indexes for table `data_kurir`
--
ALTER TABLE `data_kurir`
  ADD PRIMARY KEY (`id_kurir`),
  ADD KEY `id_toko` (`id_usaha`);

--
-- Indexes for table `data_master_bank`
--
ALTER TABLE `data_master_bank`
  ADD PRIMARY KEY (`kode_bank`);

--
-- Indexes for table `data_pembayaran`
--
ALTER TABLE `data_pembayaran`
  ADD PRIMARY KEY (`id_pembayaran`),
  ADD KEY `id_pemesanan` (`id_pemesanan`),
  ADD KEY `kode_bank` (`kode_bank`);

--
-- Indexes for table `data_pembeli`
--
ALTER TABLE `data_pembeli`
  ADD PRIMARY KEY (`id_pb`);

--
-- Indexes for table `data_pemesanan`
--
ALTER TABLE `data_pemesanan`
  ADD PRIMARY KEY (`id_pemesanan`),
  ADD KEY `id_toko` (`id_usaha`),
  ADD KEY `id_pb` (`id_pb`);

--
-- Indexes for table `data_pengguna`
--
ALTER TABLE `data_pengguna`
  ADD PRIMARY KEY (`id_pengguna`),
  ADD UNIQUE KEY `id_akun` (`id_akun`);

--
-- Indexes for table `data_pengiriman`
--
ALTER TABLE `data_pengiriman`
  ADD PRIMARY KEY (`id_pengiriman`),
  ADD KEY `id_jam_pengiriman` (`id_jam_pengiriman`),
  ADD KEY `id_kurir` (`id_kurir`),
  ADD KEY `id_kendaraan` (`id_kendaraan`);

--
-- Indexes for table `data_penjual`
--
ALTER TABLE `data_penjual`
  ADD PRIMARY KEY (`id_pj`);

--
-- Indexes for table `data_produk`
--
ALTER TABLE `data_produk`
  ADD PRIMARY KEY (`id_produk`),
  ADD KEY `id_toko` (`id_usaha`);

--
-- Indexes for table `data_rekening`
--
ALTER TABLE `data_rekening`
  ADD PRIMARY KEY (`id_rekening`),
  ADD KEY `id_akun` (`id_akun`),
  ADD KEY `kode_bank` (`kode_bank`);

--
-- Indexes for table `data_track_kurir`
--
ALTER TABLE `data_track_kurir`
  ADD PRIMARY KEY (`id_track`),
  ADD KEY `id_kurir` (`id_kurir`);

--
-- Indexes for table `data_usaha`
--
ALTER TABLE `data_usaha`
  ADD PRIMARY KEY (`id_usaha`),
  ADD KEY `id_pj` (`id_pj`);

--
-- Indexes for table `data_variasi`
--
ALTER TABLE `data_variasi`
  ADD PRIMARY KEY (`id_variasi`);

--
-- Indexes for table `data_variasi_produk`
--
ALTER TABLE `data_variasi_produk`
  ADD PRIMARY KEY (`id_variasiproduk`),
  ADD KEY `id_produk` (`id_produk`),
  ADD KEY `id_variasi` (`id_variasi`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `data_detail_pemesanan`
--
ALTER TABLE `data_detail_pemesanan`
  MODIFY `id_dp` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `data_detail_pengiriman`
--
ALTER TABLE `data_detail_pengiriman`
  MODIFY `id_detail_pengiriman` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `data_jam_pengiriman`
--
ALTER TABLE `data_jam_pengiriman`
  MODIFY `id_jampengiriman` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `data_kelompok_tani`
--
ALTER TABLE `data_kelompok_tani`
  MODIFY `id_kelompoktani` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `data_kelompok_tani_usaha`
--
ALTER TABLE `data_kelompok_tani_usaha`
  MODIFY `id_keltaniusaha` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `data_kendaraan`
--
ALTER TABLE `data_kendaraan`
  MODIFY `id_kendaraan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `data_kurir`
--
ALTER TABLE `data_kurir`
  MODIFY `id_kurir` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `data_pembayaran`
--
ALTER TABLE `data_pembayaran`
  MODIFY `id_pembayaran` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `data_pembeli`
--
ALTER TABLE `data_pembeli`
  MODIFY `id_pb` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `data_pemesanan`
--
ALTER TABLE `data_pemesanan`
  MODIFY `id_pemesanan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `data_pengguna`
--
ALTER TABLE `data_pengguna`
  MODIFY `id_pengguna` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `data_pengiriman`
--
ALTER TABLE `data_pengiriman`
  MODIFY `id_pengiriman` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `data_penjual`
--
ALTER TABLE `data_penjual`
  MODIFY `id_pj` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `data_produk`
--
ALTER TABLE `data_produk`
  MODIFY `id_produk` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `data_rekening`
--
ALTER TABLE `data_rekening`
  MODIFY `id_rekening` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `data_track_kurir`
--
ALTER TABLE `data_track_kurir`
  MODIFY `id_track` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `data_usaha`
--
ALTER TABLE `data_usaha`
  MODIFY `id_usaha` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `data_variasi`
--
ALTER TABLE `data_variasi`
  MODIFY `id_variasi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `data_variasi_produk`
--
ALTER TABLE `data_variasi_produk`
  MODIFY `id_variasiproduk` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `data_detail_pemesanan`
--
ALTER TABLE `data_detail_pemesanan`
  ADD CONSTRAINT `data_detail_pemesanan_ibfk_3` FOREIGN KEY (`id_produk`) REFERENCES `data_variasi_produk` (`id_variasiproduk`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `data_detail_pemesanan_ibfk_4` FOREIGN KEY (`id_produk`) REFERENCES `data_variasi_produk` (`id_variasiproduk`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `data_detail_pengiriman`
--
ALTER TABLE `data_detail_pengiriman`
  ADD CONSTRAINT `data_detail_pengiriman_ibfk_1` FOREIGN KEY (`id_pengiriman`) REFERENCES `data_pengiriman` (`id_pengiriman`),
  ADD CONSTRAINT `data_detail_pengiriman_ibfk_2` FOREIGN KEY (`id_pemesanan`) REFERENCES `data_pemesanan` (`id_pemesanan`);

--
-- Constraints for table `data_jam_pengiriman`
--
ALTER TABLE `data_jam_pengiriman`
  ADD CONSTRAINT `data_jam_pengiriman_ibfk_1` FOREIGN KEY (`id_usaha`) REFERENCES `data_usaha` (`id_usaha`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `data_kelompok_tani_usaha`
--
ALTER TABLE `data_kelompok_tani_usaha`
  ADD CONSTRAINT `data_kelompok_tani_usaha_ibfk_1` FOREIGN KEY (`id_kelompoktani`) REFERENCES `data_kelompok_tani` (`id_kelompoktani`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `data_kelompok_tani_usaha_ibfk_2` FOREIGN KEY (`id_usaha`) REFERENCES `data_usaha` (`id_usaha`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `data_kendaraan`
--
ALTER TABLE `data_kendaraan`
  ADD CONSTRAINT `data_kendaraan_ibfk_1` FOREIGN KEY (`id_usaha`) REFERENCES `data_usaha` (`id_usaha`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `data_kurir`
--
ALTER TABLE `data_kurir`
  ADD CONSTRAINT `data_kurir_ibfk_1` FOREIGN KEY (`id_usaha`) REFERENCES `data_usaha` (`id_usaha`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `data_pembayaran`
--
ALTER TABLE `data_pembayaran`
  ADD CONSTRAINT `data_pembayaran_ibfk_1` FOREIGN KEY (`kode_bank`) REFERENCES `data_master_bank` (`kode_bank`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `data_pemesanan`
--
ALTER TABLE `data_pemesanan`
  ADD CONSTRAINT `data_pemesanan_ibfk_1` FOREIGN KEY (`id_pb`) REFERENCES `data_pembeli` (`id_pb`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `data_pemesanan_ibfk_2` FOREIGN KEY (`id_usaha`) REFERENCES `data_usaha` (`id_usaha`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `data_pengiriman`
--
ALTER TABLE `data_pengiriman`
  ADD CONSTRAINT `data_pengiriman_ibfk_2` FOREIGN KEY (`id_jam_pengiriman`) REFERENCES `data_jam_pengiriman` (`id_jampengiriman`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `data_pengiriman_ibfk_3` FOREIGN KEY (`id_kurir`) REFERENCES `data_kurir` (`id_kurir`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `data_pengiriman_ibfk_4` FOREIGN KEY (`id_kendaraan`) REFERENCES `data_kendaraan` (`id_kendaraan`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `data_produk`
--
ALTER TABLE `data_produk`
  ADD CONSTRAINT `data_produk_ibfk_2` FOREIGN KEY (`id_usaha`) REFERENCES `data_usaha` (`id_usaha`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `data_rekening`
--
ALTER TABLE `data_rekening`
  ADD CONSTRAINT `data_rekening_ibfk_2` FOREIGN KEY (`id_akun`) REFERENCES `data_pengguna` (`id_akun`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `data_rekening_ibfk_3` FOREIGN KEY (`kode_bank`) REFERENCES `data_master_bank` (`kode_bank`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `data_track_kurir`
--
ALTER TABLE `data_track_kurir`
  ADD CONSTRAINT `data_track_kurir_ibfk_1` FOREIGN KEY (`id_kurir`) REFERENCES `data_kurir` (`id_kurir`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `data_usaha`
--
ALTER TABLE `data_usaha`
  ADD CONSTRAINT `data_usaha_ibfk_1` FOREIGN KEY (`id_pj`) REFERENCES `data_penjual` (`id_pj`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `data_variasi_produk`
--
ALTER TABLE `data_variasi_produk`
  ADD CONSTRAINT `data_variasi_produk_ibfk_1` FOREIGN KEY (`id_produk`) REFERENCES `data_produk` (`id_produk`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `data_variasi_produk_ibfk_2` FOREIGN KEY (`id_variasi`) REFERENCES `data_variasi` (`id_variasi`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
