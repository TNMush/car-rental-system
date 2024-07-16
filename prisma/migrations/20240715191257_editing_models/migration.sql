/*
  Warnings:

  - You are about to drop the column `proofOfInsurance` on the `car` table. All the data in the column will be lost.
  - You are about to drop the column `proofOfRadioLicense` on the `car` table. All the data in the column will be lost.
  - You are about to drop the column `verificationStatus` on the `car` table. All the data in the column will be lost.
  - You are about to drop the column `proofOfIdentity` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `proofOfResidence` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `verificationStatus` on the `profile` table. All the data in the column will be lost.
  - Added the required column `interiorView1` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Made the column `sideView` on table `car` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `car` DROP COLUMN `proofOfInsurance`,
    DROP COLUMN `proofOfRadioLicense`,
    DROP COLUMN `verificationStatus`,
    ADD COLUMN `interiorView1` VARCHAR(191) NOT NULL,
    ADD COLUMN `interiorView2` VARCHAR(191) NULL,
    ADD COLUMN `interiorView3` VARCHAR(191) NULL,
    MODIFY `sideView` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `profile` DROP COLUMN `proofOfIdentity`,
    DROP COLUMN `proofOfResidence`,
    DROP COLUMN `verificationStatus`;

-- CreateTable
CREATE TABLE `IdentityVerification` (
    `id` VARCHAR(191) NOT NULL,
    `cameraImage` VARCHAR(191) NOT NULL,
    `identityDocument` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `IdentityVerification_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResidenceVerification` (
    `id` VARCHAR(191) NOT NULL,
    `utilityBill` VARCHAR(191) NOT NULL,
    `affidavity` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'PENDING',

    UNIQUE INDEX `ResidenceVerification_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CarVerification` (
    `id` VARCHAR(191) NOT NULL,
    `proofOfRadioLicense` VARCHAR(191) NOT NULL,
    `proofOfInsurance` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'PENDING',

    UNIQUE INDEX `CarVerification_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `IdentityVerification` ADD CONSTRAINT `IdentityVerification_id_fkey` FOREIGN KEY (`id`) REFERENCES `Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResidenceVerification` ADD CONSTRAINT `ResidenceVerification_id_fkey` FOREIGN KEY (`id`) REFERENCES `Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CarVerification` ADD CONSTRAINT `CarVerification_id_fkey` FOREIGN KEY (`id`) REFERENCES `Car`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
