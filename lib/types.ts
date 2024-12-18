import { Id } from "@/convex/_generated/dataModel";

export type UserData = {
  _id: Id<"users">;
  _creationTime: number;
  updatedAt?: number | undefined;
  userId: string;
  name: string;
  username: string;
  profileImageUrl: string;
} | null;
