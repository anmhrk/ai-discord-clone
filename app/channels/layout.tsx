import ServerSidebar from "@/components/server/server-sidebar";
import { api } from "@/convex/_generated/api";
import { SignedIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/channels/@me");
  }

  try {
    const preloadedUserData = await preloadQuery(api.user.getUserData, {
      userId: userId!,
    });

    const preloadedServers = await preloadQuery(api.server.getServersForUser, {
      userId: userId!,
    });

    return (
      <div className="flex h-screen">
        <ServerSidebar
          preloadedUserData={preloadedUserData}
          preloadedServers={preloadedServers}
        />
        <SignedIn>{children}</SignedIn>
      </div>
    );
  } catch (error) {
    return redirect("/channels/@me");
  }
}
