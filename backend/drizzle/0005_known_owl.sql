CREATE TABLE `announcements` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`message` text NOT NULL,
	`link` varchar(255),
	`background_color` varchar(50) DEFAULT '#000000',
	`text_color` varchar(50) DEFAULT '#ffffff',
	`active` int DEFAULT 1,
	`start_date` timestamp,
	`end_date` timestamp,
	CONSTRAINT `announcements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `banners` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255),
	`subtitle` varchar(255),
	`image` text NOT NULL,
	`link` varchar(255),
	`position` varchar(50) DEFAULT 'home',
	`order` int DEFAULT 0,
	`active` int DEFAULT 1,
	`start_date` timestamp,
	`end_date` timestamp,
	CONSTRAINT `banners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `featured_categories` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`image` text,
	`order` int DEFAULT 0,
	`active` int DEFAULT 1,
	CONSTRAINT `featured_categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `footer_links` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`section_id` int NOT NULL,
	`label` varchar(255) NOT NULL,
	`url` varchar(255) NOT NULL,
	`order` int DEFAULT 0,
	`active` int DEFAULT 1,
	CONSTRAINT `footer_links_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `footer_sections` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text,
	`order` int DEFAULT 0,
	`active` int DEFAULT 1,
	CONSTRAINT `footer_sections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `home_sections` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`type` varchar(50) NOT NULL,
	`title` varchar(255),
	`subtitle` varchar(255),
	`content` text,
	`image` text,
	`order` int DEFAULT 0,
	`active` int DEFAULT 1,
	CONSTRAINT `home_sections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `menu_items` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`label` varchar(100) NOT NULL,
	`url` varchar(255) NOT NULL,
	`parent_id` int DEFAULT 0,
	`order` int DEFAULT 0,
	`active` int DEFAULT 1,
	`icon` varchar(50),
	CONSTRAINT `menu_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`site_name` varchar(255) DEFAULT 'Prince Garments',
	`site_tagline` varchar(255) DEFAULT 'Premium Style',
	`logo` text,
	`favicon` text,
	`phone` varchar(50),
	`email` varchar(255),
	`address` text,
	`facebook_url` varchar(255),
	`instagram_url` varchar(255),
	`twitter_url` varchar(255),
	`whatsapp_number` varchar(50),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `site_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`designation` varchar(255),
	`message` text NOT NULL,
	`image` text,
	`rating` int DEFAULT 5,
	`active` int DEFAULT 1,
	`order` int DEFAULT 0,
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `hero_slides` ADD `button_text` varchar(100) DEFAULT 'Shop Now';--> statement-breakpoint
ALTER TABLE `hero_slides` ADD `button_link` varchar(255) DEFAULT '/product';--> statement-breakpoint
ALTER TABLE `hero_slides` ADD `order` int DEFAULT 0;