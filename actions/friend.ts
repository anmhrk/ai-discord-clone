"use server";

import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";

export async function createFriend(
  userId: string | null,
  friendName: string,
  model: string,
  personality: string,
  friendImage: File | null
) {
  const friendId = String(
    Math.floor(Math.random() * 9000000000000000000) + 1000000000000000000
  );

  const friendUsername = friendName?.toLowerCase().replace(/\s+/g, "");

  const profileColors = [
    "#FAA619",
    "#5765F2",
    "#3AA55C",
    "#757E8A",
    "#ED4245",
    "#EB459F",
  ];

  const randomProfileColor =
    profileColors[Math.floor(Math.random() * profileColors.length)];

  try {
    if (!userId) {
      throw new Error("User not found");
    }

    if (friendImage) {
      const friendImageUrl = await fetchMutation(api.storage.generateUploadUrl);

      const result = await fetch(friendImageUrl, {
        method: "POST",
        headers: {
          "Content-Type": friendImage.type,
        },
        body: friendImage,
      });

      if (!result.ok) {
        throw new Error("Image upload failed:" + result.statusText);
      }

      const { storageId } = await result.json();

      const url = await fetchMutation(api.storage.getUploadUrl, {
        storageId,
      });

      if (url) {
        await fetchMutation(api.friend.createFriend, {
          userId: userId!,
          friendId,
          name: friendName,
          username: friendUsername,
          model,
          personality,
          friendImageUrl: url,
        });
      } else {
        throw new Error("Image upload failed");
      }
    } else {
      await fetchMutation(api.friend.createFriend, {
        userId: userId!,
        friendId,
        name: friendName,
        username: friendUsername,
        model,
        personality,
        profileColor: randomProfileColor,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }
}

export async function deleteFriend(friendId: string, userId: string) {}

export async function updateFriend(
  friendId: string,
  userId: string,
  newFriendName?: string,
  newModel?: string,
  newPersonality?: string,
  newFriendImage?: File
) {}
