"use server";

import { api } from "@/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";
import { fetchMutation } from "convex/nextjs";

export async function checkIfUserIsInServer(serverId: string) {
  // server can exist but if user is not a member, then return false

  const { userId } = await auth();

  const isUserInServer = await fetchMutation(api.server.checkIfUserIsInServer, {
    serverId,
    userId: userId!,
  });

  return isUserInServer;
}

export async function createServer(
  serverName: string,
  serverImage: File | null,
  userId: string | null
) {
  const serverId = String(
    Math.floor(Math.random() * 9000000000000000000) + 1000000000000000000
  );

  const generalChannelId = String(
    Math.floor(Math.random() * 9000000000000000000) + 1000000000000000000
  );

  try {
    if (!userId) {
      throw new Error("User not found");
    }

    if (serverName.length < 2 || serverName.length > 100) {
      throw new Error("Must be between 2 and 100 in length.");
    }

    if (serverImage) {
      const serverImageUrl = await fetchMutation(api.storage.generateUploadUrl);

      const result = await fetch(serverImageUrl, {
        method: "POST",
        headers: {
          "Content-Type": serverImage.type,
        },
        body: serverImage,
      });

      if (!result.ok) {
        throw new Error("Image upload failed:" + result.statusText);
      }

      const { storageId } = await result.json();

      const url = await fetchMutation(api.storage.getUploadUrl, {
        storageId,
      });

      if (url) {
        await fetchMutation(api.server.createServer, {
          serverName,
          serverId,
          userId,
          serverImageUrl: url,
        });

        await fetchMutation(api.channel.createChannel, {
          name: "general",
          channelId: generalChannelId,
          serverId,
        });
      } else {
        throw new Error("Image upload failed");
      }
    } else {
      await fetchMutation(api.server.createServer, {
        serverName,
        serverId,
        userId,
      });

      await fetchMutation(api.channel.createChannel, {
        name: "general",
        channelId: generalChannelId,
        serverId,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }

  return {
    serverId,
    generalChannelId,
  };
}

export async function deleteServer(serverId: string) {
  try {
    await fetchMutation(api.server.deleteServer, {
      serverId,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }
}

export async function updateServer(
  serverId: string,
  userId: string,
  newServerName?: string,
  newServerImage?: File
) {}

export async function inviteNewMember(serverId: string, newMemberId: string) {}
