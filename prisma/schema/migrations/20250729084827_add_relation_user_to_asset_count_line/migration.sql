ALTER TABLE asset_count_line
ADD COLUMN user_id INT UNSIGNED NULL;

ALTER TABLE asset_count_line
ADD CONSTRAINT fk_asset_count_line_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE SET NULL
ON UPDATE CASCADE;