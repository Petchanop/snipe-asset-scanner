/*
  Warnings:

  - You are about to drop the `AssetCount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AssetCountLine` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `AssetCountLine` DROP FOREIGN KEY `AssetCountLine_asset_count_id_fkey`;

-- DropTable
DROP TABLE `AssetCount`;

-- DropTable
DROP TABLE `AssetCountLine`;

-- CreateTable
CREATE TABLE `asset_count` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `document_number` VARCHAR(191) NOT NULL,
    `document_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `rtd_location_id` INTEGER NULL,
    `location_id` INTEGER NULL,
    `state` VARCHAR(191) NOT NULL,
    `created_by` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `asset_count_document_number_key`(`document_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asset_count_line` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `asset_count_id` INTEGER UNSIGNED NOT NULL,
    `asset_id` INTEGER NOT NULL,
    `asset_code` VARCHAR(191) NOT NULL,
    `asset_name` VARCHAR(191) NOT NULL,
    `assigned_to` INTEGER NULL,
    `asset_check` BOOLEAN NOT NULL,
    `checked_by` INTEGER NULL,
    `checked_on` TIMESTAMP(0) NOT NULL,
    `is_not_asset_loc` BOOLEAN NOT NULL,
    `asset_name_not_correct` BOOLEAN NOT NULL,

    INDEX `asset_count_line_asset_count_id_index`(`asset_count_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `asset_count_line` ADD CONSTRAINT `asset_count_line_asset_count_id_fkey` FOREIGN KEY (`asset_count_id`) REFERENCES `asset_count`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
