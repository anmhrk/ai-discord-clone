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

export type ServerMember = {
  _id: Id<"serverMembers">;
  _creationTime: number;
  profileImageUrl?: string | undefined;
  profileColor?: string | undefined;
  name: string;
  serverId: Id<"servers">;
  username: string;
  memberId: Id<"users"> | Id<"friends">;
};
