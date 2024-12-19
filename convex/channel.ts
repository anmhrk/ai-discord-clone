import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createChannel = mutation({
  args: {
    name: v.string(),
    channelId: v.string(),
    serverId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const server = await ctx.db
        .query("servers")
        .filter((q) => {
          return q.eq(q.field("serverId"), args.serverId);
        })
        .first();

      if (!server) {
        throw new Error("Server not found");
      }

      await ctx.db.insert("channels", {
        name: args.name,
        channelId: args.channelId,
        serverId: server._id,
      });

      if (server.defaultChannelId === "") {
        await ctx.db.patch(server._id, {
          defaultChannelId: args.channelId,
        });
      }
    } catch (error) {
      throw new Error(error as string);
    }
  },
});

export const getChannelsForServer = query({
  args: {
    serverId: v.string(),
  },
  handler: async (ctx, args) => {
    const server = await ctx.db
      .query("servers")
      .filter((q) => {
        return q.eq(q.field("serverId"), args.serverId);
      })
      .first();

    if (!server) {
      return false;
    }

    const channels = await ctx.db
      .query("channels")
      .filter((q) => q.eq(q.field("serverId"), server._id))
      .collect();

    return channels;
  },
});
