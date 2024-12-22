"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import UserInfo from "@/components/common/user-info";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { ChevronDown, Hash, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
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
import { useState } from "react";
import { CreateChannelDialog } from "./create-channel-dialog";
import { deleteChannel } from "@/actions/channel";
import AddFriendsDialog from "../server/add-friends-dialog";

export default function ChannelsList({
  preloadedUserData,
  preloadedChannels,
  preloadedServerData,
  preloadedFriends,
}: {
  preloadedUserData: Preloaded<typeof api.user.getUserData>;
  preloadedChannels: Preloaded<typeof api.channel.getChannelsForServer>;
  preloadedServerData: Preloaded<typeof api.server.getServerData>;
  preloadedFriends: Preloaded<typeof api.friend.getFriendsForUser>;
}) {
  const userData = usePreloadedQuery(preloadedUserData);
  const channels = usePreloadedQuery(preloadedChannels);
  const serverData = usePreloadedQuery(preloadedServerData);
  const friends = preloadedFriends ? usePreloadedQuery(preloadedFriends) : [];

  const router = useRouter();
  const [openCreateChannelDialog, setOpenCreateChannelDialog] = useState(false);
  const [openAddFriendsDialog, setOpenAddFriendsDialog] = useState(false);

  // const params = useParams<{ serverId: string; channelId: string }>(); params.channelId is undefined for some reason
  // so using pathname
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const channelId =
    pathSegments.length >= 3
      ? pathSegments[pathSegments.length - 1]
      : serverData?.server.defaultChannelId;
  const channelName =
    channels &&
    (channels?.find((channel) => channel.channelId === channelId)?.name || "");

  const dropdownItems = [
    {
      label: "Add Friends",
      icon: FaUserPlus,
      onClick: () => setOpenAddFriendsDialog(true),
    },
    {
      label: "Create Channel",
      icon: FaCirclePlus,
      onClick: () => setOpenCreateChannelDialog(true),
    },
    {
      label: "Delete Server",
      icon: X,
      onClick: async () => {
        try {
          router.push("/channels/@me");
          await deleteServer(serverData?.server.serverId);
          toast.success("Your server has been deleted");
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
          </div>

          <div className="mt-1.5 px-2.5 space-y-[2px]">
            {channels &&
              channels.map((channel) => {
                return (
                  <button
                    key={channel._id}
                    className={cn(
                      "flex items-center w-full px-2 h-8 rounded gap-2 justify-between",
                      channelName &&
                        channelName === channel.name &&
                        "bg-[#404249]"
                    )}
                    onClick={() => {
                      router.push(
                        `/channels/${serverData?.server.serverId}/${channel.channelId}`
                      );
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="w-5 h-5 text-[#949BA4]" />
                      <span
                        className={cn(
                          "text-[#949BA4] text-[15px] font-semibold",
                          channelName &&
                            channelName === channel.name &&
                            "text-[#FFF]"
                        )}
                      >
                        {channel.name}
                      </span>
                    </div>
                    <X
                      className="w-4 h-4 text-[#949BA4] hover:text-[#DCDEE1]"
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          const result = await deleteChannel(
                            serverData?.server.serverId,
                            channel.channelId
                          );
                          if (result) {
                            router.push(
                              `/channels/${serverData?.server.serverId}/${result}`
                            );
                          } else {
                            router.push(
                              `/channels/${serverData?.server.serverId}/${serverData?.server.defaultChannelId}`
                            );
                          }
                          toast.success("Channel deleted");
                        } catch (error) {
                          toast.error(
                            error instanceof Error
                              ? error.message
                              : "Failed to delete channel"
                          );
                        }
                      }}
                    />
                  </button>
                );
              })}
          </div>
        </div>
      </ScrollArea>

      <UserInfo userData={userData} />
      <AddFriendsDialog
        open={openAddFriendsDialog}
        onOpenChange={setOpenAddFriendsDialog}
        friends={friends}
        serverData={serverData?.server}
        serverMembers={serverData?.serverMembers}
      />
      <CreateChannelDialog
        open={openCreateChannelDialog}
        onOpenChange={setOpenCreateChannelDialog}
        serverId={serverData?.server.serverId}
      />
    </div>
  );
}
