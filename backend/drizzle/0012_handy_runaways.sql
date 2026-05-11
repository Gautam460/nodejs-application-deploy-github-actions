CREATE TABLE `commissions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`reseller_id` int NOT NULL,
	`order_id` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`status` varchar(50) DEFAULT 'Pending',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `commissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payouts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`reseller_id` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`status` varchar(50) DEFAULT 'Pending',
	`method` varchar(50) DEFAULT 'Bank Transfer',
	`transaction_reference` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `payouts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reseller_network` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`uplink_id` int NOT NULL,
	`downlink_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `reseller_network_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `referral_code` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `referred_by` int;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_referral_code_unique` UNIQUE(`referral_code`);