CREATE TABLE "users_table" (
	"user_id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"username" text NOT NULL,
	"profile_image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_table_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "users_table_username_unique" UNIQUE("username")
);
