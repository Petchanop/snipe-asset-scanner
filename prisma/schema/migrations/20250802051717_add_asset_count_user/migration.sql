/*
  Warnings:

  - You are about to drop the column `user_id` on the `asset_count_line` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `asset_count_line` DROP FOREIGN KEY `fk_asset_count_line_user`;

-- DropIndex
DROP INDEX `fk_asset_count_line_user` ON `asset_count_line`;

-- AlterTable
ALTER TABLE `asset_count_line` DROP COLUMN `user_id`;
