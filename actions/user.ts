"use server";

import { db } from "@/db/drizzle";
import { usersTable } from "@/db/schema";
import { UserType } from "@/db/schema";

export async function insertUser(user: UserType) {
  try {
    await db.insert(usersTable).values(user);
  } catch (error) {
    throw new Error("Failed to insert user");
  }
}
