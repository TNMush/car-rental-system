/*
  Warnings:

  - You are about to drop the column `status` on the `identityverification` table. All the data in the column will be lost.
  - Added the required column `profileId` to the `IdentityVerification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `identityverification` DROP FOREIGN KEY `IdentityVerification_id_fkey`;

-- AlterTable
ALTER TABLE `identityverification` DROP COLUMN `status`,
    ADD COLUMN `profileId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `IdentityVerification` ADD CONSTRAINT `IdentityVerification_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
