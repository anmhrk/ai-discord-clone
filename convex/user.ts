import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const insertUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    username: v.string(),
    profileImageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      await ctx.db.insert("users", {
        userId: args.userId,
        name: args.name,
        username: args.username,
        profileImageUrl: args.profileImageUrl,
      });
    } catch (error) {
      throw new Error("Failed to create user");
    }
  },
});

export const getUserData = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const userInfo = await ctx.db
        .query("users")
        .filter((q) => {
          return q.eq(q.field("userId"), args.userId);
        })
        .first();

      return userInfo;
    } catch (error) {
      throw new Error("Failed to get user");
    }
  },
});

export const deleteUser = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .first();

      if (!user) {
        throw new Error("User not found");
      }

      await ctx.db.delete(user._id);

      const friends = await ctx.db
        .query("friends")
        .filter((q) => q.eq(q.field("creatorId"), user._id))
        .collect();

      for (const friend of friends) {
        await ctx.db.delete(friend._id);

        if (friend.friendImageStorageId) {
          await ctx.storage.delete(
            friend.friendImageStorageId as Id<"_storage">
          );
        }
      }

      const servers = await ctx.db
        .query("servers")
        .filter((q) => q.eq(q.field("ownerId"), user._id))
        .collect();

      for (const server of servers) {
        await ctx.db.delete(server._id);

        if (server.serverImageStorageId) {
          await ctx.storage.delete(
            server.serverImageStorageId as Id<"_storage">
          );
        }

        const channels = await ctx.db
          .query("channels")
          .filter((q) => {
            return q.eq(q.field("serverId"), server._id);
          })
          .collect();

        for (const channel of channels) {
          await ctx.db.delete(channel._id);
          const channelMessages = await ctx.db
            .query("channelMessages")
            .filter((q) => {
              return q.eq(q.field("channelId"), channel._id);
            })
            .collect();

          for (const message of channelMessages) {
            await ctx.db.delete(message._id);
          }
        }
      }

      const serverMembers = await ctx.db
        .query("serverMembers")
        .filter((q) => q.eq(q.field("memberId"), user._id))
        .collect();

      for (const serverMember of serverMembers) {
        await ctx.db.delete(serverMember._id);
      }

      const directMessages = await ctx.db
        .query("directMessages")
        .filter((q) => q.eq(q.field("participantOneId"), user._id))
        .collect();

      for (const directMessage of directMessages) {
        await ctx.db.delete(directMessage._id);

        const messagesInDm = await ctx.db
          .query("messagesInDm")
          .filter((q) => q.eq(q.field("conversationId"), directMessage._id))
          .collect();

        for (const message of messagesInDm) {
          await ctx.db.delete(message._id);
        }
      }
    } catch (error) {
      throw new Error("Failed to delete user");
    }
  },
});

export const updateUser = mutation({
  args: {
    userId: v.string(),
    profileImageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .first();

      if (!user) {
        throw new Error("User not found");
      }

      await ctx.db.patch(user._id, {
        profileImageUrl: args.profileImageUrl,
      });
    } catch (error) {
      throw new Error("Failed to update user");
    }
  },
});
