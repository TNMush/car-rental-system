-- AlterTable
ALTER TABLE `identityverification` ADD COLUMN `status` ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'PENDING';
