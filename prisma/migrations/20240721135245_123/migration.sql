/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Listing` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[carId]` on the table `Listing` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `carId` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `listing` ADD COLUMN `carId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Listing_id_key` ON `Listing`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Listing_carId_key` ON `Listing`(`carId`);

-- AddForeignKey
ALTER TABLE `Listing` ADD CONSTRAINT `Listing_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `Car`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
