-- CreateTable
CREATE TABLE `asset_count_user` (
    `id` INTEGER NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `asset_count_user` ADD CONSTRAINT `asset_count_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `asset_count_location` MODIFY COLUMN location_id INT UNSIGNED NOT NULL;

-- AddForeignKey
ALTER TABLE `asset_count_location` ADD CONSTRAINT `asset_count_location_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
