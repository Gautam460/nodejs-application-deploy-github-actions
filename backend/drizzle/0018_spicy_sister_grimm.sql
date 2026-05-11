CREATE TABLE `manufacturing_requests` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`product_type` varchar(100) NOT NULL,
	`quantity` int NOT NULL,
	`specifications` text,
	`design_file_url` text,
	`target_price` decimal(10,2),
	`status` varchar(50) DEFAULT 'Requested',
	`vendor_id` int,
	`quoted_price` decimal(10,2),
	`admin_notes` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `manufacturing_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vendor_metrics` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`vendor_id` int NOT NULL,
	`total_orders` int DEFAULT 0,
	`completed_orders` int DEFAULT 0,
	`cancelled_orders` int DEFAULT 0,
	`average_rating` decimal(3,2) DEFAULT '0',
	`on_time_delivery_rate` decimal(5,2) DEFAULT '0',
	`performance_score` decimal(5,2) DEFAULT '100',
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `vendor_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `performance_score` decimal(5,2) DEFAULT '100';