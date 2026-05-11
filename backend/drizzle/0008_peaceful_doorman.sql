CREATE TABLE `about_sections` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`type` varchar(50) DEFAULT 'content',
	`title` varchar(255) NOT NULL,
	`subtitle` varchar(255),
	`content` text,
	`image` text,
	`order` int DEFAULT 0,
	`active` int DEFAULT 1,
	CONSTRAINT `about_sections_id` PRIMARY KEY(`id`)
);
