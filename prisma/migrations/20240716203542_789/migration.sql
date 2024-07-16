/*
  Warnings:

  - You are about to drop the column `residenceId` on the `residenceverification` table. All the data in the column will be lost.
  - Added the required column `profileId` to the `ResidenceVerification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `residenceverification` DROP FOREIGN KEY `ResidenceVerification_residenceId_fkey`;

-- AlterTable
ALTER TABLE `residenceverification` DROP COLUMN `residenceId`,
    ADD COLUMN `profileId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `ResidenceVerification` ADD CONSTRAINT `ResidenceVerification_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
