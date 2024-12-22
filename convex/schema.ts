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
    messages: v.array(
      v.object({
        role: v.string(),
        content: v.union(
          v.string(),
          v.array(
            v.object({
              type: v.string(),
              text: v.string(),
            })
          )
        ),
        timestamp: v.number(),
      })
    ),
  })
    .index("by_channelId", ["channelId"])
    .index("by_serverId", ["serverId"])
    .index("by_name", ["name"]),

  directMessages: defineTable({
    participantOneId: v.id("users"),
    participantTwoId: v.id("friends"),
    messages: v.array(
      v.object({
        role: v.string(),
        content: v.union(
          v.string(),
          v.array(
            v.object({
              type: v.string(),
              text: v.string(),
            })
          )
        ),
        timestamp: v.number(),
      })
    ),
  })
    .index("by_participants", ["participantOneId", "participantTwoId"])
    .index("by_participantOne", ["participantOneId"])
    .index("by_participantTwo", ["participantTwoId"]),
});
