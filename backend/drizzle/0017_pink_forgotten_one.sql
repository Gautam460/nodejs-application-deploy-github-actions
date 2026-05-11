CREATE TABLE `product_bulk_pricing` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`product_id` int NOT NULL,
	`min_qty` int NOT NULL,
	`max_qty` int,
	`price` decimal(10,2) NOT NULL,
	CONSTRAINT `product_bulk_pricing_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reseller_links` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`reseller_id` int NOT NULL,
	`product_id` int NOT NULL,
	`margin` decimal(10,2) DEFAULT '0',
	`code` varchar(50) NOT NULL,
	`views` int DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `reseller_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `reseller_links_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `wallet_transactions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`wallet_id` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`type` varchar(20) NOT NULL,
	`description` text,
	`reference_id` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `wallet_transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wallets` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`balance` decimal(10,2) DEFAULT '0.00',
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `wallets_id` PRIMARY KEY(`id`),
	CONSTRAINT `wallets_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
ALTER TABLE `orders` ADD `production_status` varchar(50);--> statement-breakpoint
ALTER TABLE `orders` ADD `pickup_date` timestamp;--> statement-breakpoint
ALTER TABLE `products` ADD `stock` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `users` ADD `subscription_plan` varchar(50) DEFAULT 'free';--> statement-breakpoint
ALTER TABLE `users` ADD `subscription_expiry` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `credit_limit` decimal(10,2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE `users` ADD `is_trusted` int DEFAULT 0;