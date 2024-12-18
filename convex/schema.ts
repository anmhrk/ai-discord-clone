import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    name: v.string(),
    username: v.string(),
    profileImageUrl: v.string(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_username", ["username"]),

  servers: defineTable({
    name: v.string(),
    serverId: v.string(),
    ownerId: v.id("users"),
    serverImageUrl: v.optional(v.string()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_serverId", ["serverId"])
    .index("by_name", ["name"]),

  channels: defineTable({
    name: v.string(),
    channelId: v.string(),
    serverId: v.id("servers"),
    updatedAt: v.optional(v.number()),
  })
    .index("by_channelId", ["channelId"])
    .index("by_serverId", ["serverId"])
    .index("by_name", ["name"]),
});
