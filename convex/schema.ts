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
    .index("by_name", ["name"])
    .index("by_username", ["username"]),

  friends: defineTable({
    name: v.string(),
    creatorId: v.id("users"),
    model: v.string(), // should be v.union with model names
    personality: v.string(),
    friendImageUrl: v.optional(v.string()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_name", ["name"])
    .index("by_creatorId", ["creatorId"]),

  servers: defineTable({
    name: v.string(),
    serverId: v.string(),
    ownerId: v.id("users"),
    serverImageUrl: v.optional(v.string()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_serverId", ["serverId"])
    .index("by_name", ["name"]),

  serverMembers: defineTable({
    userId: v.union(v.id("users"), v.id("friends")),
    serverId: v.id("servers"),
    joinedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_serverId", ["serverId"]),

  channels: defineTable({
    name: v.string(),
    channelId: v.string(),
    serverId: v.id("servers"),
    updatedAt: v.optional(v.number()),
    categoryId: v.optional(v.id("categories")),
  })
    .index("by_channelId", ["channelId"])
    .index("by_serverId", ["serverId"])
    .index("by_name", ["name"]),

  channelMessages: defineTable({
    channelId: v.id("channels"),
    senderId: v.id("users"),
    content: v.string(),
    replyTo: v.optional(v.id("channelMessages")),
    isEdited: v.optional(v.boolean()),
    editedAt: v.optional(v.number()),
    deletedAt: v.optional(v.number()),
  })
    .index("by_channelId", ["channelId"])
    .index("by_senderId", ["senderId"]),

  categories: defineTable({
    name: v.string(),
    serverId: v.id("servers"),
    updatedAt: v.optional(v.number()),
  })
    .index("by_serverId", ["serverId"])
    .index("by_name", ["name"]),

  directMessages: defineTable({
    participantOne: v.id("users"),
    participantTwo: v.id("users"),
    updatedAt: v.optional(v.number()),
  })
    .index("by_participants", ["participantOne", "participantTwo"])
    .index("by_participantOne", ["participantOne"])
    .index("by_participantTwo", ["participantTwo"]),

  messages: defineTable({
    directMessageId: v.id("directMessages"),
    senderId: v.id("users"),
    content: v.string(),
    replyTo: v.optional(v.id("messages")),
    isEdited: v.optional(v.boolean()),
    editedAt: v.optional(v.number()),
    deletedAt: v.optional(v.number()),
  })
    .index("by_directMessageId", ["directMessageId"])
    .index("by_senderId", ["senderId"]),
});
