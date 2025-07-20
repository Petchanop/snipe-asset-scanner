/*
  Warnings:

  - You are about to alter the column `document_number` on the `asset_count` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `asset_count_line` DROP FOREIGN KEY `asset_count_line_asset_count_id_fkey`;

-- AlterTable
ALTER TABLE `asset_count` MODIFY `document_number` INTEGER NOT NULL AUTO_INCREMENT;

-- AlterTable
ALTER TABLE `asset_count_line` MODIFY `asset_count_line_status_id` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `asset_count_location` (
    `id` CHAR(36) NOT NULL,
    `asset_count_id` CHAR(36) NOT NULL,
    `rtd_location_id` INTEGER NULL,
    `location_id` INTEGER NOT NULL,

    INDEX `asset_count_location_asset_count_id_index`(`asset_count_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `asset_count_location` ADD CONSTRAINT `asset_count_location_asset_count_id_fkey` FOREIGN KEY (`asset_count_id`) REFERENCES `asset_count`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
