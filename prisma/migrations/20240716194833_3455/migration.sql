/*
  Warnings:

  - Added the required column `residenceId` to the `ResidenceVerification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `residenceverification` DROP FOREIGN KEY `ResidenceVerification_id_fkey`;

-- AlterTable
ALTER TABLE `residenceverification` ADD COLUMN `residenceId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `ResidenceVerification` ADD CONSTRAINT `ResidenceVerification_residenceId_fkey` FOREIGN KEY (`residenceId`) REFERENCES `Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
