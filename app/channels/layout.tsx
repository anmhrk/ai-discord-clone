import ChannelSidebar from "@/components/channel-sidebar";
import ServerSidebar from "@/components/server-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServerSidebar />
      <ChannelSidebar />
      {children}
    </>
  );
}
