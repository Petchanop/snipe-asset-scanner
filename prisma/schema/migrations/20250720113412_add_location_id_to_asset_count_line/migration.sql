/*
  Warnings:

  - Added the required column `asset_count_line_location_id` to the `asset_count_line` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `asset_count_line` ADD COLUMN `asset_count_line_location_id` CHAR(36) NOT NULL;

-- CreateIndex
CREATE INDEX `asset_count_line_asset_count_location_index` ON `asset_count_line`(`asset_count_line_location_id`);

-- AddForeignKey
ALTER TABLE `asset_count_line` ADD CONSTRAINT `asset_count_line_asset_count_line_location_id_fkey` FOREIGN KEY (`asset_count_line_location_id`) REFERENCES `asset_count_location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
