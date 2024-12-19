"use server";

import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";

export async function createFriend(
  userId: string | null,
  name: string,
  username: string | null,
  model: string,
  personality: string,
  friendImage: File | null
) {
  const friendId = String(
    Math.floor(Math.random() * 9000000000000000000) + 1000000000000000000
  );

  //   await fetchMutation(api.friend.createFriend, {
  //     userId: userId!,
  //     friendId,
  //     name,
  //     username,
  //     model,
  //     personality,
  //     friendImageUrl,
  //   });
}
