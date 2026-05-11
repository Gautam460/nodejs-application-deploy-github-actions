CREATE TABLE `deliveries` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`order_id` int NOT NULL,
	`delivery_partner_id` int NOT NULL,
	`status` varchar(50) DEFAULT 'Assigned',
	`tracking_code` varchar(100),
	`proof_image` text,
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `deliveries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `system_rules` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`value` text NOT NULL,
	`type` varchar(50) DEFAULT 'json',
	`description` text,
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `system_rules_id` PRIMARY KEY(`id`),
	CONSTRAINT `system_rules_name_unique` UNIQUE(`name`)
);
