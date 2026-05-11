CREATE TABLE `canceled_orders` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`order_id` int NOT NULL,
	`reason` text,
	`penalty_amount` decimal(10,2) DEFAULT '0',
	`refund_amount` decimal(10,2) DEFAULT '0',
	`status` varchar(50) DEFAULT 'Pending',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `canceled_orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `orders` ADD `cancel_limit_date` timestamp;