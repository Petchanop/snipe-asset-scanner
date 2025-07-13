-- CreateTable
CREATE TABLE `AssetCount` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `document_number` VARCHAR(191) NOT NULL,
    `document_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `rtd_location_id` INTEGER NULL,
    `location_id` INTEGER NULL,
    `state` VARCHAR(191) NOT NULL,
    `created_by` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AssetCount_document_number_key`(`document_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AssetCountLine` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `asset_count_id` INTEGER UNSIGNED NOT NULL,
    `asset_id` INTEGER NOT NULL,
    `asset_code` VARCHAR(191) NOT NULL,
    `asset_name` VARCHAR(191) NOT NULL,
    `assigned_to` INTEGER NULL,
    `asset_check` BOOLEAN NOT NULL,
    `checked_by` INTEGER NULL,
    `checked_on` TIMESTAMP(0) NOT NULL,
    `is_not_asset_loc` BOOLEAN NOT NULL,
    `asset_name_not_correct` BOOLEAN NOT NULL,

    INDEX `asset_count_line_asset_count_id_index`(`asset_count_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accessories` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `category_id` INTEGER NULL,
    `created_by` INTEGER NULL,
    `qty` INTEGER NOT NULL DEFAULT 0,
    `requestable` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,
    `location_id` INTEGER NULL,
    `purchase_date` DATE NULL,
    `purchase_cost` DECIMAL(20, 2) NULL,
    `order_number` VARCHAR(191) NULL,
    `company_id` INTEGER UNSIGNED NULL,
    `min_amt` INTEGER NULL,
    `manufacturer_id` INTEGER NULL,
    `model_number` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `supplier_id` INTEGER NULL,
    `notes` TEXT NULL,

    INDEX `accessories_company_id_index`(`company_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accessories_checkout` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `created_by` INTEGER NULL,
    `accessory_id` INTEGER NULL,
    `assigned_to` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `note` VARCHAR(191) NULL,
    `assigned_type` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `action_logs` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `created_by` INTEGER NULL,
    `action_type` VARCHAR(191) NOT NULL,
    `target_id` INTEGER NULL,
    `target_type` VARCHAR(191) NULL,
    `location_id` INTEGER NULL,
    `note` TEXT NULL,
    `filename` TEXT NULL,
    `item_type` VARCHAR(191) NOT NULL,
    `item_id` INTEGER NOT NULL,
    `expected_checkin` DATE NULL,
    `accepted_id` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,
    `thread_id` INTEGER NULL,
    `company_id` INTEGER NULL,
    `accept_signature` VARCHAR(100) NULL,
    `log_meta` TEXT NULL,
    `action_date` DATETIME(0) NULL,
    `stored_eula` TEXT NULL,
    `action_source` VARCHAR(191) NULL,
    `remote_ip` VARCHAR(45) NULL,
    `user_agent` VARCHAR(191) NULL,

    INDEX `action_logs_action_type_index`(`action_type`),
    INDEX `action_logs_company_id_index`(`company_id`),
    INDEX `action_logs_created_at_index`(`created_at`),
    INDEX `action_logs_item_type_item_id_action_type_index`(`item_type`, `item_id`, `action_type`),
    INDEX `action_logs_remote_ip_index`(`remote_ip`),
    INDEX `action_logs_target_type_target_id_action_type_index`(`target_type`, `target_id`, `action_type`),
    INDEX `action_logs_target_type_target_id_index`(`target_type`, `target_id`),
    INDEX `action_logs_thread_id_index`(`thread_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asset_logs` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `action_type` VARCHAR(191) NOT NULL,
    `asset_id` INTEGER NOT NULL,
    `checkedout_to` INTEGER NULL,
    `location_id` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,
    `asset_type` VARCHAR(100) NULL,
    `note` TEXT NULL,
    `filename` TEXT NULL,
    `requested_at` DATETIME(0) NULL,
    `accepted_at` DATETIME(0) NULL,
    `accessory_id` INTEGER NULL,
    `accepted_id` INTEGER NULL,
    `consumable_id` INTEGER NULL,
    `expected_checkin` DATE NULL,
    `component_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asset_maintenances` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `asset_id` INTEGER UNSIGNED NOT NULL,
    `supplier_id` INTEGER UNSIGNED NOT NULL,
    `asset_maintenance_type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `is_warranty` BOOLEAN NOT NULL,
    `start_date` DATE NOT NULL,
    `completion_date` DATE NULL,
    `asset_maintenance_time` INTEGER NULL,
    `notes` LONGTEXT NULL,
    `cost` DECIMAL(20, 2) NULL,
    `deleted_at` DATETIME(0) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `created_by` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asset_uploads` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `filename` VARCHAR(191) NOT NULL,
    `asset_id` INTEGER NOT NULL,
    `filenotes` VARCHAR(191) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assets` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `asset_tag` VARCHAR(191) NULL,
    `model_id` INTEGER NULL,
    `serial` VARCHAR(191) NULL,
    `purchase_date` DATE NULL,
    `asset_eol_date` DATE NULL,
    `eol_explicit` BOOLEAN NOT NULL DEFAULT false,
    `purchase_cost` DECIMAL(20, 2) NULL,
    `order_number` VARCHAR(191) NULL,
    `assigned_to` INTEGER NULL,
    `notes` TEXT NULL,
    `image` TEXT NULL,
    `created_by` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `physical` BOOLEAN NOT NULL DEFAULT true,
    `deleted_at` TIMESTAMP(0) NULL,
    `status_id` INTEGER NULL,
    `archived` BOOLEAN NULL DEFAULT false,
    `warranty_months` INTEGER NULL,
    `depreciate` BOOLEAN NULL,
    `supplier_id` INTEGER NULL,
    `requestable` TINYINT NOT NULL DEFAULT 0,
    `rtd_location_id` INTEGER NULL,
    `_snipeit_mac_address_1` VARCHAR(191) NULL,
    `accepted` VARCHAR(191) NULL,
    `last_checkout` DATETIME(0) NULL,
    `last_checkin` DATETIME(0) NULL,
    `expected_checkin` DATE NULL,
    `company_id` INTEGER UNSIGNED NULL,
    `assigned_type` VARCHAR(191) NULL,
    `last_audit_date` DATETIME(0) NULL,
    `next_audit_date` DATE NULL,
    `location_id` INTEGER NULL,
    `checkin_counter` INTEGER NOT NULL DEFAULT 0,
    `checkout_counter` INTEGER NOT NULL DEFAULT 0,
    `requests_counter` INTEGER NOT NULL DEFAULT 0,
    `byod` BOOLEAN NULL DEFAULT false,
    `_snipeit_ip_address_2` TEXT NULL,
    `_snipeit_computer_name_3` TEXT NULL,
    `_snipeit_ram_4` TEXT NULL,
    `_snipeit_hddssd_5` TEXT NULL,
    `_snipeit_vga_6` TEXT NULL,
    `_snipeit_cpu_7` TEXT NULL,
    `_snipeit_display_size_8` TEXT NULL,
    `_snipeit_raid_card_9` TEXT NULL,
    `_snipeit_department_10` TEXT NULL,
    `_snipeit_wifi_mac_address_11` TEXT NULL,
    `_snipeit_history_12` TEXT NULL,
    `_snipeit_installation_location_13` TEXT NULL,
    `_snipeit_ative_resolution_14` TEXT NULL,
    `_snipeit_brightness_15` TEXT NULL,
    `_snipeit_contrast_ratio_16` TEXT NULL,
    `_snipeit_projector_technology_17` TEXT NULL,
    `_snipeit_aspect_ratio_18` TEXT NULL,
    `_snipeit_lamp_life_19` TEXT NULL,
    `_snipeit_input_20` TEXT NULL,
    `_snipeit_output_21` TEXT NULL,
    `_snipeit_size_2` TEXT NULL,
    `_snipeit_color_3` TEXT NULL,
    `_snipeit_material_4` TEXT NULL,
    `_snipeit_department_6` TEXT NULL,
    `_snipeit_type_car_7` TEXT NULL,
    `_snipeit_brand_car_8` TEXT NULL,
    `_snipeit_generation_9` TEXT NULL,
    `_snipeit_a1aaaa0a1asauaaaa_10` TEXT NULL,
    `_snipeit_aa0asasa1aauaaa1oe_11` TEXT NULL,
    `_snipeit_aaaa2aaaua1aaaaaa1a_12` TEXT NULL,
    `_snipeit_aaa0aaaaaa1aa_13` TEXT NULL,
    `_snipeit_aaa_14` TEXT NULL,
    `_snipeit_installation_location_15` TEXT NULL,
    `_snipeit_support_by_36` TEXT NULL,
    `_snipeit_possessioner_37` TEXT NULL,
    `_snipeit_support_by_1` TEXT NULL,
    `_snipeit_possessor_2` TEXT NULL,
    `_snipeit_installation_location_3` TEXT NULL,
    `_snipeit_department_4` TEXT NULL,
    `_snipeit_type_asset_5` TEXT NULL,
    `_snipeit_aaa0a1a_aa1aaaa1aa_7` TEXT NULL,
    `_snipeit_aaaa2aaaua1aaaa1aa1asaaaazaa1oeaaaaasa3aa_9` TEXT NULL,

    INDEX `assets_assigned_type_assigned_to_index`(`assigned_type`, `assigned_to`),
    INDEX `assets_company_id_index`(`company_id`),
    INDEX `assets_created_at_index`(`created_at`),
    INDEX `assets_deleted_at_asset_tag_index`(`deleted_at`, `asset_tag`),
    INDEX `assets_deleted_at_assigned_type_assigned_to_index`(`deleted_at`, `assigned_type`, `assigned_to`),
    INDEX `assets_deleted_at_location_id_index`(`deleted_at`, `location_id`),
    INDEX `assets_deleted_at_model_id_index`(`deleted_at`, `model_id`),
    INDEX `assets_deleted_at_name_index`(`deleted_at`, `name`),
    INDEX `assets_deleted_at_rtd_location_id_index`(`deleted_at`, `rtd_location_id`),
    INDEX `assets_deleted_at_status_id_index`(`deleted_at`, `status_id`),
    INDEX `assets_deleted_at_supplier_id_index`(`deleted_at`, `supplier_id`),
    INDEX `assets_rtd_location_id_index`(`rtd_location_id`),
    INDEX `assets_serial_index`(`serial`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `created_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(0) NULL,
    `eula_text` LONGTEXT NULL,
    `use_default_eula` BOOLEAN NOT NULL DEFAULT false,
    `require_acceptance` BOOLEAN NOT NULL DEFAULT false,
    `category_type` VARCHAR(191) NULL DEFAULT 'asset',
    `checkin_email` BOOLEAN NOT NULL DEFAULT false,
    `image` VARCHAR(191) NULL,
    `notes` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `checkout_acceptances` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `checkoutable_type` VARCHAR(191) NOT NULL,
    `checkoutable_id` BIGINT UNSIGNED NOT NULL,
    `assigned_to_id` INTEGER NULL,
    `signature_filename` VARCHAR(191) NULL,
    `note` TEXT NULL,
    `accepted_at` TIMESTAMP(0) NULL,
    `declined_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,
    `stored_eula` TEXT NULL,
    `stored_eula_file` VARCHAR(191) NULL,

    INDEX `checkout_acceptances_checkoutable_type_checkoutable_id_index`(`checkoutable_type`, `checkoutable_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `checkout_requests` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `requestable_id` INTEGER NOT NULL,
    `requestable_type` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `canceled_at` DATETIME(0) NULL,
    `fulfilled_at` DATETIME(0) NULL,
    `deleted_at` DATETIME(0) NULL,

    INDEX `checkout_requests_user_id_requestable_id_requestable_type`(`user_id`, `requestable_id`, `requestable_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `companies` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `fax` VARCHAR(20) NULL,
    `email` VARCHAR(150) NULL,
    `phone` VARCHAR(20) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `image` VARCHAR(191) NULL,
    `created_by` BIGINT UNSIGNED NULL,
    `notes` TEXT NULL,

    UNIQUE INDEX `companies_name_unique`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `components` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `category_id` INTEGER NULL,
    `location_id` INTEGER NULL,
    `company_id` INTEGER NULL,
    `created_by` INTEGER NULL,
    `supplier_id` INTEGER NULL,
    `qty` INTEGER NOT NULL DEFAULT 1,
    `order_number` VARCHAR(191) NULL,
    `purchase_date` DATE NULL,
    `purchase_cost` DECIMAL(20, 2) NULL,
    `model_number` VARCHAR(191) NULL,
    `manufacturer_id` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,
    `min_amt` INTEGER NULL,
    `serial` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `notes` TEXT NULL,

    INDEX `components_company_id_index`(`company_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `components_assets` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `created_by` INTEGER NULL,
    `assigned_qty` INTEGER NULL DEFAULT 1,
    `component_id` INTEGER NULL,
    `asset_id` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `note` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `consumables` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `category_id` INTEGER NULL,
    `location_id` INTEGER NULL,
    `created_by` INTEGER NULL,
    `supplier_id` INTEGER NULL,
    `qty` INTEGER NOT NULL DEFAULT 0,
    `requestable` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,
    `purchase_date` DATE NULL,
    `purchase_cost` DECIMAL(20, 2) NULL,
    `order_number` VARCHAR(191) NULL,
    `company_id` INTEGER UNSIGNED NULL,
    `min_amt` INTEGER NULL,
    `model_number` VARCHAR(191) NULL,
    `manufacturer_id` INTEGER NULL,
    `item_no` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `notes` TEXT NULL,

    INDEX `consumables_company_id_index`(`company_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `consumables_users` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `created_by` INTEGER NULL,
    `consumable_id` INTEGER NULL,
    `assigned_to` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `note` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `custom_field_custom_fieldset` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `custom_field_id` INTEGER NOT NULL,
    `custom_fieldset_id` INTEGER NOT NULL,
    `order` INTEGER NOT NULL,
    `required` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `custom_fields` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `format` VARCHAR(191) NOT NULL,
    `element` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `created_by` INTEGER NULL,
    `field_values` TEXT NULL,
    `field_encrypted` BOOLEAN NOT NULL DEFAULT false,
    `db_column` VARCHAR(191) NULL,
    `help_text` TEXT NULL,
    `show_in_email` BOOLEAN NOT NULL DEFAULT false,
    `show_in_requestable_list` BOOLEAN NULL DEFAULT false,
    `is_unique` BOOLEAN NULL DEFAULT false,
    `display_in_user_view` BOOLEAN NULL DEFAULT false,
    `auto_add_to_fieldsets` BOOLEAN NULL DEFAULT false,
    `show_in_listview` BOOLEAN NULL DEFAULT false,
    `display_checkin` BOOLEAN NOT NULL DEFAULT false,
    `display_checkout` BOOLEAN NOT NULL DEFAULT false,
    `display_audit` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `custom_fieldsets` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `created_by` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `departments` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `fax` VARCHAR(20) NULL,
    `phone` VARCHAR(20) NULL,
    `created_by` INTEGER NOT NULL,
    `company_id` INTEGER NULL,
    `location_id` INTEGER NULL,
    `manager_id` INTEGER NULL,
    `notes` VARCHAR(191) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,
    `image` VARCHAR(191) NULL,

    INDEX `departments_company_id_index`(`company_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `depreciations` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `months` INTEGER NOT NULL,
    `depreciation_min` DECIMAL(8, 2) NULL,
    `depreciation_type` VARCHAR(191) NOT NULL DEFAULT 'amount',
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `created_by` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `imports` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `file_path` VARCHAR(191) NOT NULL,
    `filesize` INTEGER NOT NULL,
    `import_type` VARCHAR(191) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `header_row` TEXT NULL,
    `first_row` TEXT NULL,
    `field_map` TEXT NULL,
    `created_by` BIGINT UNSIGNED NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kits` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `created_by` BIGINT UNSIGNED NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kits_accessories` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `kit_id` INTEGER NULL,
    `accessory_id` INTEGER NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `created_by` BIGINT UNSIGNED NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kits_consumables` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `kit_id` INTEGER NULL,
    `consumable_id` INTEGER NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `created_by` BIGINT UNSIGNED NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kits_licenses` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `kit_id` INTEGER NULL,
    `license_id` INTEGER NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `created_by` BIGINT UNSIGNED NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kits_models` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `kit_id` INTEGER NULL,
    `model_id` INTEGER NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `created_by` BIGINT UNSIGNED NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `license_seats` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `license_id` INTEGER NULL,
    `assigned_to` INTEGER NULL,
    `notes` TEXT NULL,
    `created_by` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,
    `asset_id` INTEGER NULL,

    INDEX `license_seats_asset_id_license_id_index`(`asset_id`, `license_id`),
    INDEX `license_seats_assigned_to_license_id_index`(`assigned_to`, `license_id`),
    INDEX `license_seats_license_id_index`(`license_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `licenses` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `serial` TEXT NULL,
    `purchase_date` DATE NULL,
    `purchase_cost` DECIMAL(20, 2) NULL,
    `order_number` VARCHAR(50) NULL,
    `seats` INTEGER NOT NULL DEFAULT 1,
    `notes` TEXT NULL,
    `created_by` INTEGER NULL,
    `depreciation_id` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,
    `license_name` VARCHAR(120) NULL,
    `license_email` VARCHAR(191) NULL,
    `depreciate` BOOLEAN NULL,
    `supplier_id` INTEGER NULL,
    `expiration_date` DATE NULL,
    `purchase_order` VARCHAR(191) NULL,
    `termination_date` DATE NULL,
    `maintained` BOOLEAN NULL,
    `reassignable` BOOLEAN NOT NULL DEFAULT true,
    `company_id` INTEGER UNSIGNED NULL,
    `manufacturer_id` INTEGER NULL,
    `category_id` INTEGER NULL,
    `min_amt` INTEGER NULL,

    INDEX `licenses_company_id_index`(`company_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `locations` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `created_by` INTEGER NULL,
    `address` VARCHAR(191) NULL,
    `address2` VARCHAR(191) NULL,
    `zip` VARCHAR(10) NULL,
    `fax` VARCHAR(20) NULL,
    `phone` VARCHAR(20) NULL,
    `deleted_at` TIMESTAMP(0) NULL,
    `parent_id` INTEGER NULL,
    `currency` VARCHAR(10) NULL,
    `ldap_ou` VARCHAR(191) NULL,
    `manager_id` INTEGER NULL,
    `image` VARCHAR(191) NULL,
    `company_id` INTEGER UNSIGNED NULL,
    `notes` TEXT NULL,

    INDEX `locations_company_id_index`(`company_id`),
    INDEX `locations_manager_id_deleted_at_index`(`manager_id`, `deleted_at`),
    INDEX `locations_parent_id_index`(`parent_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `login_attempts` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NULL,
    `remote_ip` VARCHAR(45) NULL,
    `user_agent` VARCHAR(191) NULL,
    `successful` BOOLEAN NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `manufacturers` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `created_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(0) NULL,
    `url` VARCHAR(191) NULL,
    `support_url` VARCHAR(191) NULL,
    `warranty_lookup_url` VARCHAR(191) NULL,
    `support_phone` VARCHAR(191) NULL,
    `support_email` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `notes` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `migrations` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `migration` VARCHAR(191) NOT NULL,
    `batch` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `models` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `model_number` VARCHAR(191) NULL,
    `min_amt` INTEGER NULL,
    `manufacturer_id` INTEGER NULL,
    `category_id` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `depreciation_id` INTEGER NULL,
    `created_by` INTEGER NULL,
    `eol` INTEGER NULL,
    `image` VARCHAR(191) NULL,
    `deprecated_mac_address` BOOLEAN NOT NULL DEFAULT false,
    `deleted_at` TIMESTAMP(0) NULL,
    `fieldset_id` INTEGER NULL,
    `notes` TEXT NULL,
    `requestable` TINYINT NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `models_custom_fields` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `asset_model_id` INTEGER NOT NULL,
    `custom_field_id` INTEGER NOT NULL,
    `default_value` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_access_tokens` (
    `id` VARCHAR(100) NOT NULL,
    `user_id` BIGINT UNSIGNED NULL,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(191) NULL,
    `scopes` TEXT NULL,
    `revoked` BOOLEAN NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `expires_at` DATETIME(0) NULL,

    INDEX `oauth_access_tokens_user_id_index`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_auth_codes` (
    `id` VARCHAR(100) NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `scopes` TEXT NULL,
    `revoked` BOOLEAN NOT NULL,
    `expires_at` DATETIME(0) NULL,

    INDEX `oauth_auth_codes_user_id_index`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_clients` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NULL,
    `name` VARCHAR(191) NOT NULL,
    `secret` VARCHAR(100) NULL,
    `provider` VARCHAR(191) NULL,
    `redirect` TEXT NOT NULL,
    `personal_access_client` BOOLEAN NOT NULL,
    `password_client` BOOLEAN NOT NULL,
    `revoked` BOOLEAN NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `oauth_clients_user_id_index`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_personal_access_clients` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_refresh_tokens` (
    `id` VARCHAR(100) NOT NULL,
    `access_token_id` VARCHAR(100) NOT NULL,
    `revoked` BOOLEAN NOT NULL,
    `expires_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_resets` (
    `email` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL,
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,

    INDEX `password_resets_email_index`(`email`),
    INDEX `password_resets_token_index`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permission_groups` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `permissions` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `created_by` INTEGER NULL,
    `notes` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `report_templates` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `created_by` INTEGER NULL,
    `name` VARCHAR(191) NOT NULL,
    `options` TEXT NOT NULL,
    `deleted_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `report_templates_created_by_index`(`created_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `requested_assets` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `asset_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `accepted_at` DATETIME(0) NULL,
    `denied_at` DATETIME(0) NULL,
    `notes` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `requests` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `asset_id` INTEGER NOT NULL,
    `user_id` INTEGER NULL,
    `request_code` TEXT NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `saml_nonces` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nonce` VARCHAR(191) NOT NULL,
    `not_valid_after` DATETIME(0) NOT NULL,

    INDEX `saml_nonces_nonce_index`(`nonce`),
    INDEX `saml_nonces_not_valid_after_index`(`not_valid_after`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settings` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `created_by` INTEGER NULL,
    `per_page` INTEGER NOT NULL DEFAULT 20,
    `site_name` VARCHAR(100) NOT NULL DEFAULT 'Snipe IT Asset Management',
    `qr_code` INTEGER NULL,
    `qr_text` VARCHAR(32) NULL,
    `display_asset_name` INTEGER NULL,
    `display_checkout_date` INTEGER NULL,
    `display_eol` INTEGER NULL,
    `auto_increment_assets` INTEGER NOT NULL DEFAULT 0,
    `auto_increment_prefix` VARCHAR(191) NULL,
    `load_remote` BOOLEAN NOT NULL DEFAULT true,
    `logo` VARCHAR(191) NULL,
    `header_color` VARCHAR(191) NULL,
    `alert_email` VARCHAR(191) NULL,
    `alerts_enabled` BOOLEAN NOT NULL DEFAULT true,
    `default_eula_text` LONGTEXT NULL,
    `webhook_endpoint` TEXT NULL,
    `webhook_channel` VARCHAR(191) NULL,
    `webhook_botname` VARCHAR(191) NULL,
    `webhook_selected` VARCHAR(191) NULL DEFAULT 'slack',
    `default_currency` VARCHAR(10) NULL,
    `custom_css` TEXT NULL,
    `brand` TINYINT NOT NULL DEFAULT 1,
    `ldap_enabled` VARCHAR(191) NULL,
    `ldap_server` VARCHAR(191) NULL,
    `ldap_uname` VARCHAR(191) NULL,
    `ldap_pword` LONGTEXT NULL,
    `ldap_basedn` VARCHAR(191) NULL,
    `ldap_default_group` VARCHAR(191) NULL,
    `ldap_filter` TEXT NULL,
    `ldap_username_field` VARCHAR(191) NULL DEFAULT 'samaccountname',
    `ldap_lname_field` VARCHAR(191) NULL DEFAULT 'sn',
    `ldap_fname_field` VARCHAR(191) NULL DEFAULT 'givenname',
    `ldap_auth_filter_query` VARCHAR(191) NULL DEFAULT 'uid=',
    `ldap_version` INTEGER NULL DEFAULT 3,
    `ldap_active_flag` VARCHAR(191) NULL,
    `ldap_dept` VARCHAR(191) NULL,
    `ldap_emp_num` VARCHAR(191) NULL,
    `ldap_email` VARCHAR(191) NULL,
    `ldap_phone_field` VARCHAR(191) NULL,
    `ldap_jobtitle` VARCHAR(191) NULL,
    `ldap_manager` VARCHAR(191) NULL,
    `ldap_country` VARCHAR(191) NULL,
    `ldap_location` VARCHAR(191) NULL,
    `full_multiple_companies_support` BOOLEAN NOT NULL DEFAULT false,
    `scope_locations_fmcs` BOOLEAN NOT NULL DEFAULT false,
    `ldap_server_cert_ignore` BOOLEAN NOT NULL DEFAULT false,
    `locale` VARCHAR(10) NULL DEFAULT 'en-US',
    `labels_per_page` TINYINT NOT NULL DEFAULT 30,
    `labels_width` DECIMAL(6, 5) NOT NULL DEFAULT 2.62500,
    `labels_height` DECIMAL(6, 5) NOT NULL DEFAULT 1.00000,
    `labels_pmargin_left` DECIMAL(6, 5) NOT NULL DEFAULT 0.21975,
    `labels_pmargin_right` DECIMAL(6, 5) NOT NULL DEFAULT 0.21975,
    `labels_pmargin_top` DECIMAL(6, 5) NOT NULL DEFAULT 0.50000,
    `labels_pmargin_bottom` DECIMAL(6, 5) NOT NULL DEFAULT 0.50000,
    `labels_display_bgutter` DECIMAL(6, 5) NOT NULL DEFAULT 0.07000,
    `labels_display_sgutter` DECIMAL(6, 5) NOT NULL DEFAULT 0.05000,
    `labels_fontsize` TINYINT NOT NULL DEFAULT 9,
    `labels_pagewidth` DECIMAL(7, 5) NOT NULL DEFAULT 8.50000,
    `labels_pageheight` DECIMAL(7, 5) NOT NULL DEFAULT 11.00000,
    `labels_display_name` TINYINT NOT NULL DEFAULT 0,
    `labels_display_serial` TINYINT NOT NULL DEFAULT 1,
    `labels_display_tag` TINYINT NOT NULL DEFAULT 1,
    `alt_barcode_enabled` BOOLEAN NULL DEFAULT true,
    `alert_interval` INTEGER NULL DEFAULT 30,
    `alert_threshold` INTEGER NULL DEFAULT 5,
    `name_display_format` VARCHAR(10) NULL DEFAULT 'first_last',
    `email_domain` VARCHAR(191) NULL,
    `email_format` VARCHAR(191) NULL DEFAULT 'filastname',
    `username_format` VARCHAR(191) NULL DEFAULT 'filastname',
    `is_ad` BOOLEAN NOT NULL DEFAULT false,
    `ad_domain` VARCHAR(191) NULL,
    `ldap_port` VARCHAR(5) NOT NULL DEFAULT '389',
    `ldap_tls` BOOLEAN NOT NULL DEFAULT false,
    `zerofill_count` INTEGER NOT NULL DEFAULT 5,
    `ldap_pw_sync` BOOLEAN NOT NULL DEFAULT true,
    `two_factor_enabled` TINYINT NULL,
    `require_accept_signature` BOOLEAN NOT NULL DEFAULT false,
    `date_display_format` VARCHAR(191) NOT NULL DEFAULT 'Y-m-d',
    `time_display_format` VARCHAR(191) NOT NULL DEFAULT 'h:i A',
    `next_auto_tag_base` BIGINT NOT NULL DEFAULT 1,
    `login_note` TEXT NULL,
    `thumbnail_max_h` INTEGER NULL DEFAULT 50,
    `pwd_secure_uncommon` BOOLEAN NOT NULL DEFAULT false,
    `pwd_secure_complexity` VARCHAR(191) NULL,
    `pwd_secure_min` INTEGER NOT NULL DEFAULT 8,
    `audit_interval` INTEGER NULL,
    `audit_warning_days` INTEGER NULL,
    `show_url_in_emails` BOOLEAN NOT NULL DEFAULT false,
    `custom_forgot_pass_url` VARCHAR(191) NULL,
    `show_alerts_in_menu` BOOLEAN NOT NULL DEFAULT true,
    `labels_display_company_name` BOOLEAN NOT NULL DEFAULT false,
    `show_archived_in_list` BOOLEAN NOT NULL DEFAULT false,
    `dashboard_message` TEXT NULL,
    `support_footer` CHAR(5) NULL DEFAULT 'on',
    `footer_text` TEXT NULL,
    `modellist_displays` CHAR(191) NULL DEFAULT 'image,category,manufacturer,model_number',
    `login_remote_user_enabled` BOOLEAN NOT NULL DEFAULT false,
    `login_common_disabled` BOOLEAN NOT NULL DEFAULT false,
    `login_remote_user_custom_logout_url` VARCHAR(191) NOT NULL DEFAULT '',
    `skin` CHAR(191) NULL,
    `show_images_in_email` BOOLEAN NOT NULL DEFAULT true,
    `admin_cc_email` CHAR(191) NULL,
    `labels_display_model` BOOLEAN NOT NULL DEFAULT false,
    `privacy_policy_link` CHAR(191) NULL,
    `version_footer` CHAR(5) NULL DEFAULT 'on',
    `unique_serial` BOOLEAN NOT NULL DEFAULT false,
    `logo_print_assets` BOOLEAN NOT NULL DEFAULT false,
    `depreciation_method` CHAR(10) NULL DEFAULT 'default',
    `favicon` CHAR(191) NULL,
    `default_avatar` VARCHAR(191) NULL DEFAULT 'default.png',
    `email_logo` CHAR(191) NULL,
    `label_logo` CHAR(191) NULL,
    `acceptance_pdf_logo` CHAR(191) NULL,
    `allow_user_skin` BOOLEAN NOT NULL DEFAULT false,
    `show_assigned_assets` BOOLEAN NOT NULL DEFAULT false,
    `login_remote_user_header_name` VARCHAR(191) NOT NULL DEFAULT '',
    `ad_append_domain` BOOLEAN NOT NULL DEFAULT false,
    `saml_enabled` BOOLEAN NOT NULL DEFAULT false,
    `saml_idp_metadata` MEDIUMTEXT NULL,
    `saml_attr_mapping_username` VARCHAR(191) NULL,
    `saml_forcelogin` BOOLEAN NOT NULL DEFAULT false,
    `saml_slo` BOOLEAN NOT NULL DEFAULT false,
    `saml_sp_x509cert` TEXT NULL,
    `saml_sp_privatekey` TEXT NULL,
    `saml_custom_settings` TEXT NULL,
    `saml_sp_x509certNew` TEXT NULL,
    `digit_separator` CHAR(191) NULL DEFAULT '1,234.56',
    `ldap_client_tls_cert` TEXT NULL,
    `ldap_client_tls_key` TEXT NULL,
    `dash_chart_type` VARCHAR(191) NULL DEFAULT 'name',
    `label2_enable` BOOLEAN NOT NULL DEFAULT false,
    `label2_template` VARCHAR(191) NULL DEFAULT 'DefaultLabel',
    `label2_title` VARCHAR(191) NULL,
    `label2_asset_logo` BOOLEAN NOT NULL DEFAULT false,
    `label2_1d_type` VARCHAR(191) NOT NULL DEFAULT 'C128',
    `label2_2d_type` VARCHAR(191) NOT NULL DEFAULT 'QRCODE',
    `label2_2d_target` VARCHAR(191) NOT NULL DEFAULT 'hardware_id',
    `label2_fields` VARCHAR(191) NOT NULL DEFAULT 'name=name;serial=serial;model=model.name;',
    `label2_empty_row_count` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `google_login` BOOLEAN NULL DEFAULT false,
    `google_client_id` VARCHAR(191) NULL,
    `google_client_secret` VARCHAR(191) NULL,
    `profile_edit` BOOLEAN NULL DEFAULT true,
    `require_checkinout_notes` BOOLEAN NULL DEFAULT false,
    `shortcuts_enabled` BOOLEAN NOT NULL DEFAULT false,
    `due_checkin_days` INTEGER NULL,
    `ldap_invert_active_flag` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `status_labels` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NULL,
    `created_by` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,
    `deployable` BOOLEAN NOT NULL DEFAULT false,
    `pending` BOOLEAN NOT NULL DEFAULT false,
    `archived` BOOLEAN NOT NULL DEFAULT false,
    `notes` TEXT NULL,
    `color` VARCHAR(10) NULL,
    `show_in_nav` BOOLEAN NULL DEFAULT false,
    `default_label` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `suppliers` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(250) NULL,
    `address2` VARCHAR(250) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `country` VARCHAR(2) NULL,
    `phone` VARCHAR(35) NULL,
    `fax` VARCHAR(35) NULL,
    `email` VARCHAR(150) NULL,
    `contact` VARCHAR(100) NULL,
    `notes` VARCHAR(191) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `created_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(0) NULL,
    `zip` VARCHAR(10) NULL,
    `url` VARCHAR(250) NULL,
    `image` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `throttle` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NULL,
    `ip_address` VARCHAR(191) NULL,
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `suspended` BOOLEAN NOT NULL DEFAULT false,
    `banned` BOOLEAN NOT NULL DEFAULT false,
    `last_attempt_at` TIMESTAMP(0) NULL,
    `suspended_at` TIMESTAMP(0) NULL,
    `banned_at` TIMESTAMP(0) NULL,

    INDEX `throttle_user_id_index`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `permissions` TEXT NULL,
    `activated` BOOLEAN NOT NULL DEFAULT false,
    `created_by` INTEGER NULL,
    `activation_code` VARCHAR(191) NULL,
    `activated_at` TIMESTAMP(0) NULL,
    `last_login` TIMESTAMP(0) NULL,
    `persist_code` VARCHAR(191) NULL,
    `reset_password_code` VARCHAR(191) NULL,
    `first_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,
    `website` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `gravatar` VARCHAR(191) NULL,
    `location_id` INTEGER NULL,
    `phone` VARCHAR(191) NULL,
    `jobtitle` VARCHAR(191) NULL,
    `manager_id` INTEGER NULL,
    `employee_num` TEXT NULL,
    `avatar` VARCHAR(191) NULL,
    `username` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `company_id` INTEGER UNSIGNED NULL,
    `remember_token` TEXT NULL,
    `ldap_import` BOOLEAN NOT NULL DEFAULT false,
    `locale` VARCHAR(10) NULL DEFAULT 'en-US',
    `show_in_list` BOOLEAN NOT NULL DEFAULT true,
    `two_factor_secret` VARCHAR(32) NULL,
    `two_factor_enrolled` BOOLEAN NOT NULL DEFAULT false,
    `two_factor_optin` BOOLEAN NOT NULL DEFAULT false,
    `department_id` INTEGER NULL,
    `address` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `zip` VARCHAR(10) NULL,
    `skin` VARCHAR(191) NULL,
    `remote` BOOLEAN NULL DEFAULT false,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `scim_externalid` VARCHAR(191) NULL,
    `autoassign_licenses` BOOLEAN NOT NULL DEFAULT true,
    `vip` BOOLEAN NULL DEFAULT false,
    `enable_sounds` BOOLEAN NOT NULL DEFAULT false,
    `enable_confetti` BOOLEAN NOT NULL DEFAULT false,

    INDEX `users_activation_code_index`(`activation_code`),
    INDEX `users_company_id_index`(`company_id`),
    INDEX `users_manager_id_deleted_at_index`(`manager_id`, `deleted_at`),
    INDEX `users_reset_password_code_index`(`reset_password_code`),
    INDEX `users_username_deleted_at_index`(`username`, `deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_groups` (
    `user_id` INTEGER UNSIGNED NOT NULL,
    `group_id` INTEGER UNSIGNED NOT NULL,
    `created_by` BIGINT UNSIGNED NULL,

    PRIMARY KEY (`user_id`, `group_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AssetCountLine` ADD CONSTRAINT `AssetCountLine_asset_count_id_fkey` FOREIGN KEY (`asset_count_id`) REFERENCES `AssetCount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
