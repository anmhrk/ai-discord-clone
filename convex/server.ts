import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createServer = mutation({
  args: {
    serverName: v.string(),
    serverId: v.string(),
    userId: v.string(),
    serverImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const user = await ctx.db
        .query("users")
        .filter((q) => {
          return q.eq(q.field("userId"), args.userId);
        })
        .first();

      if (!user) {
        throw new Error("User not found");
      }

      await ctx.db.insert("servers", {
        name: args.serverName,
        serverId: args.serverId,
        ownerId: user._id,
        serverImageUrl: args.serverImageUrl,
        defaultChannelId: "",
      });

      const server = await ctx.db
        .query("servers")
        .filter((q) => {
          return q.eq(q.field("serverId"), args.serverId);
        })
        .first();

      if (!server) {
        throw new Error("Server not found");
      }

      await ctx.db.insert("serverMembers", {
        memberId: user._id,
        serverId: server._id,
      });
    } catch (error) {
      throw new Error(error as string);
    }
  },
});

export const getServersForUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => {
        return q.eq(q.field("userId"), args.userId);
      })
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const serverIds = await ctx.db
      .query("serverMembers")
      .filter((q) => {
        return q.eq(q.field("memberId"), user._id);
      })
      .order("desc")
      .collect();

    return Promise.all(
      serverIds.map(async (serverId) => {
        const servers = await ctx.db.get(serverId.serverId);
        return servers;
      })
    );
  },
});
