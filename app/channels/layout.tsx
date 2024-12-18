import ChannelSidebar from "@/components/layout/channel-sidebar";
import ServerSidebar from "@/components/layout/server-sidebar";
import { api } from "@/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  const preloadedUserData = await preloadQuery(api.user.getUserData, {
    userId: userId!,
  });

  return (
    <div className="flex h-screen">
      <ServerSidebar preloadedUserData={preloadedUserData} />
      <ChannelSidebar preloadedUserData={preloadedUserData} />
      {children}
    </div>
  );
}
