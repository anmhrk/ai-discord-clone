"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { Hash } from "lucide-react";
import { usePathname } from "next/navigation";

export default function ChannelTopNav({
  preloadedServerData,
  preloadedChannels,
}: {
  preloadedServerData: Preloaded<typeof api.server.getServerData>;
  preloadedChannels: Preloaded<typeof api.channel.getChannelsForServer>;
}) {
  const serverData = usePreloadedQuery(preloadedServerData);
  const channels = usePreloadedQuery(preloadedChannels);

  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const channelId =
    pathSegments.length >= 3
      ? pathSegments[pathSegments.length - 1]
      : serverData?.server.defaultChannelId;
  const channelName =
    channels &&
    (channels?.find((channel) => channel.channelId === channelId)?.name || "");

  return (
    <div className="flex flex-col text-zinc-400 min-h-[49px]">
      <div className="h-full border-b border-[#202225] flex items-center px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-default">
            <Hash className="w-6 h-6 text-[#80848E]" />
            <span className="font-semibold text-[15px] text-[#DCDEE1]">
              {channelName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
