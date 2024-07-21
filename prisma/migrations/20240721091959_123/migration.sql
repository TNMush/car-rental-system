/*
  Warnings:

  - The primary key for the `residenceverification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `residenceverification` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[profileId]` on the table `ResidenceVerification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `ResidenceVerification_id_key` ON `residenceverification`;

-- AlterTable
ALTER TABLE `residenceverification` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`profileId`);

-- CreateIndex
CREATE UNIQUE INDEX `ResidenceVerification_profileId_key` ON `ResidenceVerification`(`profileId`);
