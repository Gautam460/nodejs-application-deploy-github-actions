CREATE TABLE `categories` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`parent_id` int DEFAULT 0,
	`image` mediumtext,
	`order` int DEFAULT 0,
	`active` int DEFAULT 1,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatbot_faqs` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`question` varchar(500) NOT NULL,
	`keywords` text NOT NULL,
	`answer` text NOT NULL,
	`category` varchar(100) DEFAULT 'General',
	`order` int DEFAULT 0,
	`active` int DEFAULT 1,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `chatbot_faqs_id` PRIMARY KEY(`id`)
);
