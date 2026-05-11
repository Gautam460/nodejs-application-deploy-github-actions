ALTER TABLE `orders` ADD `delivery_charge` decimal(10,2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE `orders` ADD `estimated_delivery_date` timestamp;