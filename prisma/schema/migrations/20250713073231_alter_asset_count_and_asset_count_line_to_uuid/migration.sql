/*
  Warnings:

  - The primary key for the `asset_count` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `asset_count` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `Char(36)`.
  - The primary key for the `asset_count_line` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `asset_count_line` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `Char(36)`.
  - You are about to alter the column `asset_count_id` on the `asset_count_line` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `Char(36)`.

*/
-- DropForeignKey
ALTER TABLE `asset_count_line` DROP FOREIGN KEY `asset_count_line_asset_count_id_fkey`;

-- AlterTable
ALTER TABLE `asset_count` DROP PRIMARY KEY,
    MODIFY `id` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `asset_count_line` DROP PRIMARY KEY,
    MODIFY `id` CHAR(36) NOT NULL,
    MODIFY `asset_count_id` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `asset_count_line` ADD CONSTRAINT `asset_count_line_asset_count_id_fkey` FOREIGN KEY (`asset_count_id`) REFERENCES `asset_count`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
