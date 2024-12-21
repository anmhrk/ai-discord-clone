import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";

export async function createChannel(serverId: string, channelName: string) {
  const channelId = String(
    Math.floor(Math.random() * 9000000000000000000) + 1000000000000000000
  );

  try {
    await fetchMutation(api.channel.createChannel, {
      name: channelName,
      channelId,
      serverId,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }

  return {
    channelId,
  };
}

export async function deleteChannel(serverId: string, channelId: string) {
  try {
    const result = await fetchMutation(api.channel.deleteChannel, {
      channelId,
      serverId,
    });

    if (result === false) {
      throw new Error("Cannot delete last channel");
    } else {
      console.log(result);
      return result;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }
}
