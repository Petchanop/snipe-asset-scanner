/*
  Warnings:

  - A unique constraint covering the columns `[asset_count_id,location_id]` on the table `asset_count_location` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `asset_count_location_asset_count_id_location_id_key` ON `asset_count_location`(`asset_count_id`, `location_id`);
