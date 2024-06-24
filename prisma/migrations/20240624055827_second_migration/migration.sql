/*
  Warnings:

  - You are about to drop the column `location` on the `listing` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `profile` table. All the data in the column will be lost.
  - Added the required column `locationId` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `listing` DROP COLUMN `location`,
    ADD COLUMN `locationId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `profile` DROP COLUMN `location`,
    ADD COLUMN `locationId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `city` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Listing` ADD CONSTRAINT `Listing_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
