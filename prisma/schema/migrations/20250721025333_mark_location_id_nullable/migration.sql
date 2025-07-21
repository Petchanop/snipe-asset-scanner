-- DropForeignKey
ALTER TABLE `asset_count_line` DROP FOREIGN KEY `asset_count_line_asset_count_line_location_id_fkey`;

-- AlterTable
ALTER TABLE `asset_count_line` MODIFY `asset_count_line_location_id` CHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `asset_count_line` ADD CONSTRAINT `asset_count_line_asset_count_line_location_id_fkey` FOREIGN KEY (`asset_count_line_location_id`) REFERENCES `asset_count_location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
