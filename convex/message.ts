import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createMessages = mutation({
  args: {
    id: v.string(),
    messages: v.array(v.any()),
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

      const friend = await ctx.db
        .query("friends")
        .filter((q) => q.eq(q.field("friendId"), args.id))
        .first();

      const existingDm = friend
        ? await ctx.db
            .query("directMessages")
            .filter((q) =>
              q.and(
                q.eq(q.field("participantOneId"), user._id),
                q.eq(q.field("participantTwoId"), friend._id)
              )
            )
            .first()
        : null;

      const existingChannel = await ctx.db
        .query("channels")
        .filter((q) => q.eq(q.field("channelId"), args.id))
        .first();

      if (!existingDm && !existingChannel) {
        throw new Error("Chat not found");
      }

      if (existingDm) {
        await ctx.db.patch(existingDm._id, {
          messages: args.messages,
        });
      } else if (existingChannel) {
        await ctx.db.patch(existingChannel._id, {
          messages: args.messages,
        });
      }

      return true;
    } catch (error) {
      console.error("Error in createMessages:", error);
      throw new Error(String(error));
    }
  },
});

export const getMessages = query({
  args: {
    id: v.string(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    const friend = await ctx.db
      .query("friends")
      .filter((q) => q.eq(q.field("friendId"), args.id))
      .first();

    const directMessage =
      friend && user
        ? await ctx.db
            .query("directMessages")
            .filter((q) =>
              q.and(
                q.eq(q.field("participantTwoId"), friend._id),
                q.eq(q.field("participantOneId"), user._id)
              )
            )
            .first()
        : null;

    const channel = await ctx.db
      .query("channels")
      .filter((q) => q.eq(q.field("channelId"), args.id))
      .first();

    if (!directMessage && !channel) {
      return [];
    }

    if (directMessage) {
      return directMessage.messages;
    } else if (channel) {
      return channel.messages;
    }
  },
});
