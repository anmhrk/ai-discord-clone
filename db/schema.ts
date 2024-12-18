import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users_table", {
  user_id: text("user_id").notNull().unique().primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  profile_image_url: text("profile_image_url"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export type UserType = typeof usersTable.$inferSelect;
