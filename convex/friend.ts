import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createFriend = mutation({
  args: {
    userId: v.string(),
    friendId: v.string(),
    name: v.string(),
    username: v.optional(v.string()),
    model: v.string(),
    personality: v.string(),
    friendImageUrl: v.optional(v.string()),
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

    await ctx.db.insert("friends", {
      creatorId: user._id,
      friendId: args.friendId,
      name: args.name,
      username: args.username,
      model: args.model,
      personality: args.personality,
      friendImageUrl: args.friendImageUrl,
    });
  },
});
