/*
  Warnings:

  - You are about to drop the column `status` on the `asset_count_line` table. All the data in the column will be lost.
  - Added the required column `asset_count_line_status_id` to the `asset_count_line` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `asset_count_line` DROP COLUMN `status`,
    ADD COLUMN `asset_count_line_status_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `asset_status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` CHAR(36) NOT NULL,
    `label` CHAR(36) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `asset_count_line_status_id_index` ON `asset_count_line`(`asset_count_line_status_id`);

-- AddForeignKey
ALTER TABLE `asset_count_line` ADD CONSTRAINT `asset_count_line_asset_count_line_status_id_fkey` FOREIGN KEY (`asset_count_line_status_id`) REFERENCES `asset_status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
