"use client";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Preloaded } from "convex/react";
import { Search, X } from "lucide-react";
import { TbMessageCircleFilled } from "react-icons/tb";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { deleteFriend } from "@/actions/friend";
import DirectMessage from "./direct-message";

export default function Content({
  preloadedFriends,
  preloadedUserData,
}: {
  preloadedFriends: Preloaded<typeof api.friend.getFriendsForUser>;
  preloadedUserData: Preloaded<typeof api.user.getUserData>;
}) {
  const friends = usePreloadedQuery(preloadedFriends);
  const userData = usePreloadedQuery(preloadedUserData);
  const [search, setSearch] = useState("");
  const [filteredFriends, setFilteredFriends] = useState<typeof friends>([]);
  const router = useRouter();
  const params = useParams<{ slug: string; id: string }>();

  if (params.id) {
    return (
      <DirectMessage
        userData={userData}
        friends={friends}
        friendId={params.id}
      />
    );
  }

  useEffect(() => {
    setFilteredFriends(friends);
  }, [friends]);

  return (
    <div className="flex-1 flex">
      <div className="flex-1 flex flex-col py-4 px-7">
        <div className="relative">
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setFilteredFriends(
                friends.filter((friend) =>
                  friend?.name
                    ?.toLowerCase()
                    .includes(e.target.value.toLowerCase())
                )
              );
            }}
            className="bg-[#1E1F22] p-2 pl-2 pr-8 border-none text-zinc-200 text-md mb-5 font-medium placeholder:text-[#949BA4]"
          />
          <Search className="absolute right-3 top-[50%] -translate-y-[90%] h-5 w-5 text-[#B5BAC1]" />
        </div>
        <div className="text-[#B5BAC1] text-xs font-semibold mb-5">
          ALL FRIENDS — {filteredFriends.length}
        </div>
        {filteredFriends.length > 0 && (
          <Separator className="bg-zinc-700 h-[1px] w-full" />
        )}
        <ScrollArea className="flex-1">
          {filteredFriends &&
            filteredFriends.map((friend) => (
              <div
                key={friend?._id || ""}
                className="flex items-center w-full justify-between py-2.5 px-2 hover:bg-[#3A3B42] rounded-xl cursor-pointer group"
                onClick={() => {
                  router.push(`/channels/@me/${friend?.friendId}`);
                }}
              >
                <div className="flex items-center gap-3">
                  {friend?.friendImageUrl ? (
                    <div className="relative">
                      <Image
                        src={friend?.friendImageUrl}
                        alt={friend?.name || ""}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="w-3.5 h-3.5 bg-green-500 rounded-full absolute bottom-[-2px] right-0 border-[2px] border-[#232428]" />
                    </div>
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: friend?.profileColor }}
                    >
                      <div className="relative">
                        <Image
                          src="/logo-white.svg"
                          alt="Logo"
                          width={32}
                          height={32}
                          className="w-5 h-5 rounded-full"
                        />
                        <div className="w-3.5 h-3.5 bg-green-500 rounded-full absolute bottom-[-10px] left-[14px] border-[2px] border-[#232428]" />
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col justify-start">
                    <div className="text-[#F2F3F5] truncate text-left flex items-center gap-1">
                      <span className="text-[15px] font-semibold">
                        {friend?.name}
                      </span>
                      <span className="text-[#B7BCC3] text-[13.5px] font-medium hidden group-hover:inline">
                        {friend?.username}
                      </span>
                    </div>
                    <div className="text-[14px] font-medium text-[#B5BAC1] text-left">
                      Online
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full bg-[#2B2D31] group-hover:bg-[#1E1F22] text-[#B5BAC1]">
                    <TbMessageCircleFilled className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 rounded-full bg-[#2B2D31] group-hover:bg-[#1E1F22] text-red-500"
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        await deleteFriend(friend?.friendId || "");
                        toast.success("Your friend has been deleted!");
                      } catch (error) {
                        toast.error(
                          error instanceof Error
                            ? error.message
                            : "Failed to delete friend"
                        );
                      }
                    }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
        </ScrollArea>
      </div>

      <div className="w-[360px] border-l border-zinc-700 px-4 py-6">
        <h2 className="text-xl font-extrabold mb-5 text-[#DCDEE1]">
          Active Now
        </h2>
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-[15px] font-semibold text-[#DCDEE1] mb-1">
            It's quiet for now...
          </div>
          <div className="text-[13px] font-medium text-[#B5BAC1] max-w-[320px]">
            When a friend starts an activity—like playing a game or hanging out
            on voice—we'll show it here!
          </div>
        </div>
      </div>
    </div>
  );
}
