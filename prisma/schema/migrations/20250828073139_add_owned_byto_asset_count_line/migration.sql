/*
  Warnings:

  - You are about to drop the column `_snipeit_aaa0a1a_aa1aaaa1aa_7` on the `assets` table. All the data in the column will be lost.
  - You are about to drop the column `_snipeit_aaaa2aaaua1aaaa1aa1asaaaazaa1oeaaaaasa3aa_9` on the `assets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `asset_count_line` MODIFY `image` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `assets` DROP COLUMN `_snipeit_aaa0a1a_aa1aaaa1aa_7`,
    DROP COLUMN `_snipeit_aaaa2aaaua1aaaa1aa1asaaaazaa1oeaaaaasa3aa_9`,
    ADD COLUMN `_snipeit_branch_10` TEXT NULL,
    ADD COLUMN `_snipeit_location_cititex_11` TEXT NULL;
