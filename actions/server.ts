"use server";

import { api } from "@/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";
import { fetchMutation } from "convex/nextjs";
import { uploadImage } from "./image";

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
      const { url, storageId } = await uploadImage(serverImage);

      if (url) {
        await fetchMutation(api.server.createServer, {
          serverName,
          serverId,
          userId,
          serverImageUrl: url,
          serverImageStorageId: storageId,
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

export async function addFriendToServer(serverId: string, friendId: string) {
  try {
    const result = await fetchMutation(api.server.addFriendToServer, {
      serverId,
      friendId,
    });

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }
}
