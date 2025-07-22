-- AddForeignKey
ALTER TABLE `asset_count_line` ADD CONSTRAINT `asset_count_line_asset_count_id_fkey` FOREIGN KEY (`asset_count_id`) REFERENCES `asset_count`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
