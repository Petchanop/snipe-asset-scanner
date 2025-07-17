/*
  Warnings:

  - Added the required column `status` to the `asset_count_line` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `asset_count_line` ADD COLUMN `status` VARCHAR(191) NOT NULL;
