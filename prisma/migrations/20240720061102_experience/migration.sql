/*
  Warnings:

  - Added the required column `reviewerId` to the `Experience` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `experience` ADD COLUMN `reviewerId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Experience` ADD CONSTRAINT `Experience_reviewerId_fkey` FOREIGN KEY (`reviewerId`) REFERENCES `Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
