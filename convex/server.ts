import { mutation } from "./_generated/server";
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
      });
    } catch (error) {
      throw new Error(error as string);
    }
  },
});
