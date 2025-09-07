/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS `asdas_crp_assessments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asdas_crp_assessments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` bigint unsigned NOT NULL,
  `doctor_id` bigint unsigned NOT NULL,
  `assessed_at` timestamp NOT NULL,
  `back_pain` decimal(5,2) NOT NULL DEFAULT '0.00',
  `morning_stiffness_duration` decimal(5,2) NOT NULL DEFAULT '0.00',
  `peripheral_pain_swelling` decimal(5,2) NOT NULL DEFAULT '0.00',
  `pt_global` decimal(5,2) NOT NULL DEFAULT '0.00',
  `crp` decimal(6,2) DEFAULT NULL,
  `score` decimal(6,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `asdas_crp_assessments_patient_id_foreign` (`patient_id`),
  KEY `asdas_crp_assessments_doctor_id_foreign` (`doctor_id`),
  KEY `asdas_crp_assessments_assessed_at_index` (`assessed_at`),
  KEY `asdas_crp_assessments_score_index` (`score`),
  CONSTRAINT `asdas_crp_assessments_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `asdas_crp_assessments_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `basdai_assessments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `basdai_assessments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` bigint unsigned NOT NULL,
  `doctor_id` bigint unsigned NOT NULL,
  `assessed_at` timestamp NOT NULL,
  `q1` decimal(5,2) NOT NULL DEFAULT '0.00',
  `q2` decimal(5,2) NOT NULL DEFAULT '0.00',
  `q3` decimal(5,2) NOT NULL DEFAULT '0.00',
  `q4` decimal(5,2) NOT NULL DEFAULT '0.00',
  `q5` decimal(5,2) NOT NULL DEFAULT '0.00',
  `q6` decimal(5,2) NOT NULL DEFAULT '0.00',
  `score` decimal(6,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `basdai_assessments_patient_id_foreign` (`patient_id`),
  KEY `basdai_assessments_doctor_id_foreign` (`doctor_id`),
  KEY `basdai_assessments_assessed_at_index` (`assessed_at`),
  KEY `basdai_assessments_score_index` (`score`),
  CONSTRAINT `basdai_assessments_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `basdai_assessments_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `bmi_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bmi_entries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` bigint unsigned NOT NULL,
  `doctor_id` bigint unsigned NOT NULL,
  `assessed_at` timestamp NOT NULL,
  `weight_kg` decimal(6,2) DEFAULT NULL,
  `height_m` decimal(4,3) DEFAULT NULL,
  `bmi` decimal(4,1) DEFAULT NULL,
  `band` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bmi_entries_patient_id_foreign` (`patient_id`),
  KEY `bmi_entries_doctor_id_foreign` (`doctor_id`),
  KEY `bmi_entries_assessed_at_index` (`assessed_at`),
  KEY `bmi_entries_bmi_index` (`bmi`),
  CONSTRAINT `bmi_entries_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bmi_entries_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `cdai_assessments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cdai_assessments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` bigint unsigned NOT NULL,
  `doctor_id` bigint unsigned NOT NULL,
  `assessed_at` timestamp NOT NULL,
  `tjc28` tinyint unsigned NOT NULL DEFAULT '0',
  `sjc28` tinyint unsigned NOT NULL DEFAULT '0',
  `ptg` decimal(4,1) NOT NULL DEFAULT '0.0',
  `phg` decimal(4,1) NOT NULL DEFAULT '0.0',
  `score` decimal(5,1) NOT NULL DEFAULT '0.0',
  `category` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tender_joints` json DEFAULT NULL,
  `swollen_joints` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cdai_assessments_patient_id_foreign` (`patient_id`),
  KEY `cdai_assessments_doctor_id_foreign` (`doctor_id`),
  CONSTRAINT `cdai_assessments_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cdai_assessments_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `dapsa_assessments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dapsa_assessments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` bigint unsigned NOT NULL,
  `doctor_id` bigint unsigned NOT NULL,
  `assessed_at` timestamp NOT NULL,
  `tjc68` tinyint unsigned NOT NULL DEFAULT '0',
  `sjc66` tinyint unsigned NOT NULL DEFAULT '0',
  `pain` decimal(5,2) NOT NULL DEFAULT '0.00',
  `pt_global` decimal(5,2) NOT NULL DEFAULT '0.00',
  `crp` decimal(6,2) DEFAULT NULL,
  `score` decimal(6,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `dapsa_assessments_patient_id_foreign` (`patient_id`),
  KEY `dapsa_assessments_doctor_id_foreign` (`doctor_id`),
  KEY `dapsa_assessments_assessed_at_index` (`assessed_at`),
  KEY `dapsa_assessments_score_index` (`score`),
  CONSTRAINT `dapsa_assessments_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `dapsa_assessments_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `das28_assessments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `das28_assessments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` bigint unsigned NOT NULL,
  `doctor_id` bigint unsigned NOT NULL,
  `variant` enum('ESR','CRP') COLLATE utf8mb4_unicode_ci NOT NULL,
  `esr` decimal(6,2) DEFAULT NULL,
  `crp` decimal(6,2) DEFAULT NULL,
  `gh` decimal(6,2) DEFAULT NULL,
  `sjc28` tinyint unsigned NOT NULL DEFAULT '0',
  `tjc28` tinyint unsigned NOT NULL DEFAULT '0',
  `score` decimal(4,2) NOT NULL,
  `category` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `swollen_joints` json DEFAULT NULL,
  `tender_joints` json DEFAULT NULL,
  `assessed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `das28_assessments_patient_id_foreign` (`patient_id`),
  KEY `das28_assessments_doctor_id_foreign` (`doctor_id`),
  CONSTRAINT `das28_assessments_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `das28_assessments_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `eular_responses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eular_responses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` bigint unsigned NOT NULL,
  `doctor_id` bigint unsigned NOT NULL,
  `assessed_at` timestamp NOT NULL,
  `baseline_das28` decimal(4,2) DEFAULT NULL,
  `current_das28` decimal(4,2) DEFAULT NULL,
  `delta` decimal(4,2) DEFAULT NULL,
  `response` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `eular_responses_patient_id_foreign` (`patient_id`),
  KEY `eular_responses_doctor_id_foreign` (`doctor_id`),
  KEY `eular_responses_assessed_at_index` (`assessed_at`),
  CONSTRAINT `eular_responses_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `eular_responses_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `haqdi_assessments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `haqdi_assessments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` bigint unsigned NOT NULL,
  `doctor_id` bigint unsigned NOT NULL,
  `assessed_at` timestamp NOT NULL,
  `items` json NOT NULL,
  `score` decimal(4,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `haqdi_assessments_patient_id_foreign` (`patient_id`),
  KEY `haqdi_assessments_doctor_id_foreign` (`doctor_id`),
  KEY `haqdi_assessments_assessed_at_index` (`assessed_at`),
  KEY `haqdi_assessments_score_index` (`score`),
  CONSTRAINT `haqdi_assessments_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `haqdi_assessments_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `icd_terms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `icd_terms` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'complaint',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `icd_terms_code_unique` (`code`),
  KEY `icd_terms_category_is_active_index` (`category`,`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `lab_order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lab_order_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `lab_order_id` bigint unsigned NOT NULL,
  `lab_test_id` bigint unsigned NOT NULL,
  `status` enum('ordered','result_entered','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ordered',
  `due_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lab_order_items_lab_order_id_lab_test_id_unique` (`lab_order_id`,`lab_test_id`),
  KEY `lab_order_items_lab_test_id_foreign` (`lab_test_id`),
  CONSTRAINT `lab_order_items_lab_order_id_foreign` FOREIGN KEY (`lab_order_id`) REFERENCES `lab_orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lab_order_items_lab_test_id_foreign` FOREIGN KEY (`lab_test_id`) REFERENCES `lab_tests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `lab_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lab_orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` bigint unsigned NOT NULL,
  `ordered_by_user_id` bigint unsigned NOT NULL,
  `visit_id` bigint unsigned DEFAULT NULL,
  `ordered_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','partially_reported','completed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lab_orders_patient_id_foreign` (`patient_id`),
  KEY `lab_orders_ordered_by_user_id_foreign` (`ordered_by_user_id`),
  KEY `lab_orders_visit_id_foreign` (`visit_id`),
  CONSTRAINT `lab_orders_ordered_by_user_id_foreign` FOREIGN KEY (`ordered_by_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `lab_orders_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lab_orders_visit_id_foreign` FOREIGN KEY (`visit_id`) REFERENCES `visits` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `lab_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lab_results` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `lab_order_item_id` bigint unsigned NOT NULL,
  `entered_by_user_id` bigint unsigned NOT NULL,
  `verified_by_user_id` bigint unsigned DEFAULT NULL,
  `result_value` decimal(10,2) DEFAULT NULL,
  `unit` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `result_json` json DEFAULT NULL,
  `flag` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `collected_at` timestamp NULL DEFAULT NULL,
  `result_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comments` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lab_results_lab_order_item_id_unique` (`lab_order_item_id`),
  KEY `lab_results_entered_by_user_id_foreign` (`entered_by_user_id`),
  KEY `lab_results_verified_by_user_id_foreign` (`verified_by_user_id`),
  CONSTRAINT `lab_results_entered_by_user_id_foreign` FOREIGN KEY (`entered_by_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `lab_results_lab_order_item_id_foreign` FOREIGN KEY (`lab_order_item_id`) REFERENCES `lab_order_items` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lab_results_verified_by_user_id_foreign` FOREIGN KEY (`verified_by_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `lab_tests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lab_tests` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `specimen_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `units` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_ranges` json DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lab_tests_code_unique` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `national_id` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `other_names` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` enum('M','F','Other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `civil_status` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `marital_status` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ethnicity` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `blood_group` enum('A+','A-','B+','B-','AB+','AB-','O+','O-') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `age` smallint unsigned DEFAULT NULL,
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_line1` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_line2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `village` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `province` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guardian_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guardian_relationship` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_contact_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_contact_phone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `religion` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `occupation` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `health_scheme` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `chronic_conditions` text COLLATE utf8mb4_unicode_ci,
  `disability_status` text COLLATE utf8mb4_unicode_ci,
  `allergies` text COLLATE utf8mb4_unicode_ci,
  `photo_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `patients_national_id_unique` (`national_id`),
  KEY `patients_name_index` (`name`),
  KEY `patients_district_province_index` (`district`,`province`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sdai_assessments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sdai_assessments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` bigint unsigned NOT NULL,
  `doctor_id` bigint unsigned NOT NULL,
  `assessed_at` timestamp NOT NULL,
  `tjc28` tinyint unsigned NOT NULL DEFAULT '0',
  `sjc28` tinyint unsigned NOT NULL DEFAULT '0',
  `pt_global` decimal(5,2) NOT NULL DEFAULT '0.00',
  `ph_global` decimal(5,2) NOT NULL DEFAULT '0.00',
  `crp` decimal(6,2) DEFAULT NULL,
  `score` decimal(6,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sdai_assessments_patient_id_foreign` (`patient_id`),
  KEY `sdai_assessments_doctor_id_foreign` (`doctor_id`),
  KEY `sdai_assessments_assessed_at_index` (`assessed_at`),
  KEY `sdai_assessments_score_index` (`score`),
  CONSTRAINT `sdai_assessments_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sdai_assessments_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'doctor',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `vas_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vas_entries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` bigint unsigned NOT NULL,
  `doctor_id` bigint unsigned NOT NULL,
  `assessed_at` timestamp NOT NULL,
  `label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` smallint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `vas_entries_patient_id_foreign` (`patient_id`),
  KEY `vas_entries_doctor_id_foreign` (`doctor_id`),
  KEY `vas_entries_assessed_at_index` (`assessed_at`),
  CONSTRAINT `vas_entries_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `vas_entries_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `visits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visits` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` bigint unsigned NOT NULL,
  `visit_date` date NOT NULL,
  `complaints` json DEFAULT NULL,
  `history` longtext COLLATE utf8mb4_unicode_ci,
  `vitals` json DEFAULT NULL,
  `provisional_diagnoses` json DEFAULT NULL,
  `provisional_diagnosis` text COLLATE utf8mb4_unicode_ci,
  `plan` longtext COLLATE utf8mb4_unicode_ci,
  `notes` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `visits_patient_id_foreign` (`patient_id`),
  CONSTRAINT `visits_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (1,'0001_01_01_000000_create_users_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (2,'0001_01_01_000001_create_cache_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (3,'0001_01_01_000002_create_jobs_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (4,'2025_06_20_094545_add_role_to_users_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (5,'2025_08_08_143524_create_patients_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (6,'2025_08_16_000000_create_visits_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (7,'2025_08_24_013002_create_icd_terms_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (8,'2025_08_24_013213_add_complaints_to_visits_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (9,'2025_08_24_025100_drop_chief_complaint_from_visits_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (10,'2025_08_24_044019_add_category_to_icd_terms',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (11,'2025_08_24_060000_add_provisional_diagnoses_to_visits_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (12,'2025_08_27_000001_create_lab_tests_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (13,'2025_08_27_000002_create_lab_orders_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (14,'2025_08_27_000003_create_lab_order_items_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (15,'2025_08_27_000004_create_lab_results_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (16,'2025_08_28_000001_create_das28_assessments_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (17,'2025_08_29_000102_create_sdai_assessments_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (18,'2025_08_29_000103_create_basdai_assessments_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (19,'2025_08_29_000104_create_asdas_crp_assessments_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (20,'2025_08_29_000105_create_haqdi_assessments_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (21,'2025_08_29_000106_create_dapsa_assessments_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (22,'2025_08_29_000107_create_vas_entries_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (23,'2025_08_29_000108_create_bmi_entries_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (24,'2025_08_29_000109_create_eular_responses_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (25,'2025_08_29_200101_create_cdai_assessments_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (26,'2025_08_29_210131_add_fields_to_cdai_assessments_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (27,'2025_08_29_221239_add_ptg_phg_and_joint_json_to_cdai_assessments',1);
