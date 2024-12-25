import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const insertUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    username: v.string(),
    profileImageUrl: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      await ctx.db.insert("users", {
        userId: args.userId,
        name: args.name,
        username: args.username,
        profileImageUrl: args.profileImageUrl,
        email: args.email,
        hasNitro: false,
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

        const members = await ctx.db
          .query("serverMembers")
          .filter((q) => q.eq(q.field("memberId"), friend._id))
          .collect();

        for (const member of members) {
          await ctx.db.delete(member._id);
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

export const subscribeToNitro = mutation({
  args: {
    email: v.optional(v.string()),
    customerId: v.string(),
    event: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      if (args.event === "subscribe") {
        const user = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("email"), args.email))
          .first();

        if (!user) {
          throw new Error("User not found");
        }

        if (args.event === "subscribe") {
          await ctx.db.patch(user._id, {
            hasNitro: true,
            stripeCustomerId: args.customerId,
            updatedAt: Date.now(),
          });
        }
      }

      if (args.event === "unsubscribe") {
        const customer = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("stripeCustomerId"), args.customerId))
          .first();

        if (!customer) {
          throw new Error("Customer not found");
        }

        await ctx.db.patch(customer._id, {
          hasNitro: false,
          stripeCustomerId: undefined,
          updatedAt: Date.now(),
        });
      }
    } catch (error) {
      throw new Error("Something went wrong");
    }
  },
});
