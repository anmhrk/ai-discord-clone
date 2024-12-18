import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createChannel = mutation({
  args: {
    name: v.string(),
    channelId: v.string(),
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
      throw new Error("User not found");
    }
    // await ctx.db.insert("channels", {
    //   name: args.name,
    //   channelId: args.channelId,
    //   serverId: server._id,
    // });
  },
});
