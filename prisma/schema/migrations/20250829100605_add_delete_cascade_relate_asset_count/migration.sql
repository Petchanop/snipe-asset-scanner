-- DropForeignKey
ALTER TABLE `asset_count_line` DROP FOREIGN KEY `asset_count_line_asset_count_id_fkey`;

-- DropForeignKey
ALTER TABLE `asset_count_location` DROP FOREIGN KEY `asset_count_location_asset_count_id_fkey`;

-- AddForeignKey
ALTER TABLE `asset_count_line` ADD CONSTRAINT `asset_count_line_asset_count_id_fkey` FOREIGN KEY (`asset_count_id`) REFERENCES `asset_count`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asset_count_location` ADD CONSTRAINT `asset_count_location_asset_count_id_fkey` FOREIGN KEY (`asset_count_id`) REFERENCES `asset_count`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
