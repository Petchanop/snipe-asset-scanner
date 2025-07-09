/*
  Warnings:

  - A unique constraint covering the columns `[asset_code]` on the table `asset_count_line` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `asset_count_line_asset_code_key` ON `asset_count_line`(`asset_code`);
