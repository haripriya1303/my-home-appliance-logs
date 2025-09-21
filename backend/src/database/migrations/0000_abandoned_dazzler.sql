CREATE TYPE "public"."appliance_status" AS ENUM('under-warranty', 'warranty-expired', 'expiring-soon');--> statement-breakpoint
CREATE TABLE "appliances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"brand" varchar(100) NOT NULL,
	"model" varchar(100) NOT NULL,
	"serial_number" varchar(100) NOT NULL,
	"category" varchar(50) NOT NULL,
	"location" varchar(100) NOT NULL,
	"purchase_date" date NOT NULL,
	"warranty_expiration" date NOT NULL,
	"next_maintenance_date" date,
	"status" "appliance_status" NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "appliances_serial_number_unique" UNIQUE("serial_number")
);
