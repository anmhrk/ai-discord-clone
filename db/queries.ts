import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { usersTable } from "@/db/schema";

export async function getUser(userId: string) {
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.user_id, userId));
    return user;
  } catch (error) {
    throw new Error("Failed to get user");
  }
}
