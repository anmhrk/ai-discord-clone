import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createMessages = mutation({
  args: {
    id: v.string(),
    messages: v.any(),
  },
  handler: async (ctx, args) => {
    try {
      // right now only works for channels, need to add id check for dms
      // so messages can be saved for direct messages too
      const existingChat = await ctx.db
        .query("channels")
        .filter((q) => q.eq(q.field("channelId"), args.id))
        .first();

      if (!existingChat) {
        throw new Error("Chat not found");
      }

      await ctx.db.patch(existingChat._id, {
        messages: args.messages,
      });
    } catch (error) {
      throw new Error(error as string);
    }
  },
});

export const getMessages = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("channels")
      .filter((q) => q.eq(q.field("channelId"), args.id))
      .first();

    if (!messages) {
      return [];
    }

    return messages.messages;
  },
});
