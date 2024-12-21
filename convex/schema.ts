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
    friendId: v.string(),
    creatorId: v.id("users"),
    name: v.string(),
    username: v.string(),
    model: v.string(),
    personality: v.string(),
    friendImageUrl: v.optional(v.string()),
    friendImageStorageId: v.optional(v.string()),
    updatedAt: v.optional(v.number()),
    profileColor: v.optional(v.string()),
  })
    .index("by_friendId", ["friendId"])
    .index("by_creatorId", ["creatorId"])
    .index("by_name", ["name"])
    .index("by_username", ["username"]),

  servers: defineTable({
    name: v.string(),
    serverId: v.string(),
    ownerId: v.id("users"),
    serverImageUrl: v.optional(v.string()),
    serverImageStorageId: v.optional(v.string()),
    updatedAt: v.optional(v.number()),
    defaultChannelId: v.string(),
  })
    .index("by_name", ["name"])
    .index("by_serverId", ["serverId"])
    .index("by_ownerId", ["ownerId"]),

  serverMembers: defineTable({
    name: v.string(),
    username: v.string(),
    memberId: v.union(v.id("users"), v.id("friends")),
    serverId: v.id("servers"),
    profileImageUrl: v.optional(v.string()),
    profileColor: v.optional(v.string()),
  })
    .index("by_memberId", ["memberId"])
    .index("by_serverId", ["serverId"]),

  channels: defineTable({
    name: v.string(),
    channelId: v.string(),
    serverId: v.id("servers"),
    updatedAt: v.optional(v.number()),
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

  directMessages: defineTable({
    participantOneId: v.id("users"),
    participantTwoId: v.id("friends"),
    updatedAt: v.optional(v.number()),
  })
    .index("by_participants", ["participantOneId", "participantTwoId"])
    .index("by_participantOne", ["participantOneId"])
    .index("by_participantTwo", ["participantTwoId"]),

  messagesInDm: defineTable({
    conversationId: v.id("directMessages"),
    senderId: v.union(v.id("users"), v.id("friends")),
    content: v.string(),
    replyTo: v.optional(v.id("messagesInDm")),
    isEdited: v.optional(v.boolean()),
    editedAt: v.optional(v.number()),
    deletedAt: v.optional(v.number()),
  })
    .index("by_conversationId", ["conversationId"])
    .index("by_senderId", ["senderId"]),
});
