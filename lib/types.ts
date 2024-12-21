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

export type Friend = {
  updatedAt?: number | undefined;
  friendImageUrl?: string | undefined;
  friendImageStorageId?: string | undefined;
  profileColor?: string | undefined;
  name: string;
  username: string;
  friendId: string;
  creatorId: Id<"users">;
  personality: string;
} | null;

export type ServerData = {
  _id: Id<"servers">;
  _creationTime: number;
  updatedAt?: number | undefined;
  serverImageUrl?: string | undefined;
  serverImageStorageId?: string | undefined;
  name: string;
  serverId: string;
  ownerId: Id<"users">;
  defaultChannelId: string;
};
