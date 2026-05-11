ALTER TABLE `orders` ADD `order_type` varchar(50) DEFAULT 'retail';--> statement-breakpoint
ALTER TABLE `orders` ADD `is_pickup` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `orders` ADD `pickup_location` varchar(255);--> statement-breakpoint
ALTER TABLE `orders` ADD `advance_payment` decimal(10,2) DEFAULT '0';