"use client";

import { Separator } from "@/components/ui/separator";
import { Users } from "lucide-react";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import CreateFriendDialog from "./create-friend-dialog";
import { useParams } from "next/navigation";
import Image from "next/image";
export default function TopNav({
  preloadedUserData,
  preloadedFriends,
}: {
  preloadedUserData: Preloaded<typeof api.user.getUserData>;
  preloadedFriends: Preloaded<typeof api.friend.getFriendsForUser>;
}) {
  const userData = usePreloadedQuery(preloadedUserData);
  const friends = usePreloadedQuery(preloadedFriends);
  const params = useParams<{ slug: string; id: string }>();
  const [open, setOpen] = useState(false);
  const activeFriend = friends?.find(
    (friend) => friend?.friendId === params.id
  );

  return (
    <div className="flex flex-col text-zinc-400 min-h-[49px]">
      <div className="h-full border-b border-[#202225] flex items-center px-4">
        {params.id ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-default">
              {activeFriend?.friendImageUrl ? (
                <Image
                  src={activeFriend?.friendImageUrl || ""}
                  alt={activeFriend?.name || ""}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center ml-2"
                  style={{ backgroundColor: activeFriend?.profileColor }}
                >
                  <Image
                    src="/logo-white.svg"
                    alt="Logo"
                    width={32}
                    height={32}
                    className="w-5 h-5 rounded-full"
                  />
                </div>
              )}
              <span className="font-semibold text-[15px] text-[#DCDEE1]">
                {activeFriend?.name}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-default">
              <Users className="w-6 h-6" />
              <span className="font-semibold text-zinc-100">Friends</span>
            </div>
            <Separator orientation="vertical" className="h-6 bg-zinc-600" />
            <nav className="flex items-center h-12 gap-4 text-white font-medium">
              <button className="px-2.5 h-fit bg-[#43444B] hover:bg-[#3A3C42] rounded-sm cursor-default">
                All
              </button>
              <button
                className="bg-[#248045] h-fit px-2 rounded-sm"
                onClick={() => setOpen(true)}
              >
                Create Friend
              </button>
            </nav>
          </div>
        )}
      </div>
      <CreateFriendDialog
        open={open}
        onOpenChange={setOpen}
        userData={userData}
      />
    </div>
  );
}
