import ChannelSidebar from "@/components/channel-sidebar";
import ServerSidebar from "@/components/server-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <ServerSidebar />
      <ChannelSidebar />
      {children}
    </div>
  );
}
