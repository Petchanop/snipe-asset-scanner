/*
  Warnings:

  - You are about to alter the column `previous_loc_id` on the `asset_count_line` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `asset_count_line` MODIFY `previous_loc_id` INTEGER NULL;
