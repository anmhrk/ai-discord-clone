import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const insertUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    username: v.string(),
    profileImageUrl: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    try {
      await ctx.db.insert("users", {
        userId: args.userId,
        name: args.name,
        username: args.username,
        profileImageUrl: args.profileImageUrl,
        createdAt: args.createdAt,
        updatedAt: args.updatedAt,
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
