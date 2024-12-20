"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import UserInfo from "@/components/common/user-info";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { ChevronDown, Hash, Plus, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaEdit, FaUserPlus } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { deleteServer } from "@/actions/server";
import { toast } from "sonner";

export default function ChannelsList({
  preloadedUserData,
  preloadedChannels,
  preloadedServerData,
}: {
  preloadedUserData: Preloaded<typeof api.user.getUserData>;
  preloadedChannels: Preloaded<typeof api.channel.getChannelsForServer>;
  preloadedServerData: Preloaded<typeof api.server.getServerData>;
}) {
  const userData = usePreloadedQuery(preloadedUserData);
  const channels = usePreloadedQuery(preloadedChannels);
  const serverData = usePreloadedQuery(preloadedServerData);

  const router = useRouter();
  const params = useParams<{ serverId: string; channelId: string }>();
  const noChannelSelected = params.channelId === undefined;

  const dropdownItems = [
    {
      label: "Invite Friends",
      icon: FaUserPlus,
      onClick: () => {},
    },
    {
      label: "Edit Server",
      icon: FaEdit,
      onClick: () => {},
    },
    {
      label: "Create Channel",
      icon: FaCirclePlus,
      onClick: () => {},
    },
    {
      label: "Delete Server",
      icon: X,
      onClick: async () => {
        try {
          router.push("/channels/@me");
          await deleteServer(serverData?.server.serverId);
          toast.success("YourServer deleted");
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Failed to delete server"
          );
        }
      },
    },
  ];

  return (
    <div className="w-60 bg-[#2B2D31] flex flex-col min-h-screen">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-12 px-4 flex items-center justify-between bg-[#2B2D31] hover:bg-[#36373C] transition-colors">
            <span className="font-semibold text-[15px] text-[#DCDEE1]">
              {serverData?.server.name}
            </span>
            <ChevronDown className="w-5 h-5 text-[#B5BAC1]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-[#111214] w-52 mt-1 border-none flex flex-col gap-2">
          {dropdownItems.map((item) => {
            return (
              <DropdownMenuItem
                key={item.label}
                className="flex items-center hover:cursor-pointer justify-between text-[#B5BAC1] p-2 hover:bg-[#5865F2] hover:text-white focus:bg-[#5865F2] focus:text-white data-[highlighted]:bg-[#5865F2] data-[highlighted]:text-white outline-none transition-none"
                onClick={item.onClick}
              >
                <span className="text-[13px] font-semibold">{item.label}</span>
                <item.icon className="w-4 h-4" />
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator className="bg-[#1E1F22] h-[1px] w-full" />
      <ScrollArea className="flex-1">
        <div className="pt-6">
          <div className="flex items-center justify-between w-full group px-1 text-[#949BA4] group hover:cursor-pointer">
            <button className="flex items-center group-hover:text-[#DCDEE1]">
              <ChevronDown className="w-3 h-3 mr-1" />
              <span className="text-[12px] font-bold uppercase">
                Text Channels
              </span>
            </button>
            <button className="flex items-center hover:text-[#DCDEE1]">
              <Plus className="w-4 h-4 mr-3" />
            </button>
          </div>

          <div className="mt-1.5 px-2.5 space-y-[2px]">
            {channels &&
              channels.map((channel, idx) => {
                return (
                  <button
                    key={channel._id}
                    className={cn(
                      "flex items-center w-full px-2 h-8 rounded gap-2",
                      noChannelSelected && idx === 0 && "bg-[#404249]"
                    )}
                    onClick={() => {
                      router.push(
                        `/channels/${serverData?.server.serverId}/${channel.channelId}`
                      );
                    }}
                  >
                    <Hash className="w-5 h-5 text-[#949BA4]" />
                    <span className="text-[#FFF] text-[15px] font-semibold">
                      {channel.name}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      </ScrollArea>

      <UserInfo userData={userData} />
    </div>
  );
}
