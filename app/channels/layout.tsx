import ServerSidebar from "@/components/server-sidebar";
import SidePanel from "@/components/side-panel";
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
      <SidePanel preloadedUserData={preloadedUserData} />
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
