CREATE TABLE `ai_faqs` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`question` varchar(500) NOT NULL,
	`answer` text NOT NULL,
	`category` varchar(100),
	`order` int DEFAULT 0,
	`active` int DEFAULT 1,
	CONSTRAINT `ai_faqs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ai_features` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`icon` varchar(50),
	`image` text,
	`demo_url` varchar(255),
	`order` int DEFAULT 0,
	`active` int DEFAULT 1,
	CONSTRAINT `ai_features_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cart_custom_fields` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`field_name` varchar(255) NOT NULL,
	`field_type` varchar(50) NOT NULL,
	`field_label` varchar(255) NOT NULL,
	`field_placeholder` varchar(255),
	`field_options` text,
	`required` int DEFAULT 0,
	`order` int DEFAULT 0,
	`active` int DEFAULT 1,
	CONSTRAINT `cart_custom_fields_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `return_requests` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`order_id` int NOT NULL,
	`customer_name` varchar(255) NOT NULL,
	`customer_email` varchar(255) NOT NULL,
	`reason` text NOT NULL,
	`status` varchar(50) DEFAULT 'Pending',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `return_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `returns_policies` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`icon` varchar(50),
	`order` int DEFAULT 0,
	`active` int DEFAULT 1,
	CONSTRAINT `returns_policies_id` PRIMARY KEY(`id`)
);
