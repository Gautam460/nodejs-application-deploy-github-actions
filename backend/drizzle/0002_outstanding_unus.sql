CREATE TABLE `hero_slides` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`subtitle` varchar(255),
	`text` text,
	`image` text NOT NULL,
	`active` int DEFAULT 1,
	CONSTRAINT `hero_slides_id` PRIMARY KEY(`id`)
);
