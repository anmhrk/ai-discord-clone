"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { useParams } from "next/navigation";
import FriendsList from "./friends-list";

export default function SidePanel({
  preloadedUserData,
}: {
  preloadedUserData: Preloaded<typeof api.user.getUserData>;
}) {
  const userData = usePreloadedQuery(preloadedUserData);
  const params = useParams<{ slug: string }>();

  if (decodeURIComponent(params.slug) === "@me") {
    return <FriendsList userData={userData} />;
  }

  return null;
}
