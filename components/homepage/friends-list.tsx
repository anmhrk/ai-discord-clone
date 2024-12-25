"use client";

import { Plus, Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import UserInfo from "@/components/common/user-info";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { LuSparkles } from "react-icons/lu";
import { toast } from "sonner";

export default function FriendsList({
  preloadedUserData,
  preloadedFriends,
}: {
  preloadedUserData: Preloaded<typeof api.user.getUserData>;
  preloadedFriends: Preloaded<typeof api.friend.getFriendsForUser>;
}) {
  const userData = usePreloadedQuery(preloadedUserData);
  const friends = usePreloadedQuery(preloadedFriends);
  const router = useRouter();
  const params = useParams<{ id: string }>();

  return (
    <div className="w-60 bg-[#2B2D31] flex flex-col min-h-screen">
      <div className="p-2.5">
        <button className="w-full h-[28px] bg-[#1E1F22] text-[#949BA4] text-[13px] font-medium text-left px-1.5 py-1 rounded-[4px]">
          Find or start a conversation
        </button>
      </div>
      <Separator className="bg-[#1E1F22] h-[1px] w-full" />
      <div className="px-2 pt-2 space-y-0.5">
        <button className="flex items-center w-full px-3 py-[8px] rounded bg-[#404249] hover:bg-[#34353A] gap-4 text-white">
          <Users className="w-6 h-6" />
          <span className="text-[15px] font-medium">Friends</span>
        </button>
        <button
          className="flex items-center w-full px-3 py-[8px] rounded hover:bg-[#34353A] gap-4 text-[#949BA4] hover:text-white"
          onClick={() => {
            if (userData?.hasNitro) {
              toast.success("You already have Nitro!");
            } else {
              router.push(
                `${process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_URL}?prefilled_email=${userData?.email}`
              );
            }
          }}
        >
          <LuSparkles className="w-5 h-5 mr-1" />
          <span className="text-[15px] font-medium">Nitro</span>
        </button>
      </div>

      <div className="px-4 pt-6 pb-4 flex items-center justify-between text-[#949BA4] group">
        <div className="text-xs font-semibold group-hover:text-[#DBDEE1]">
          DIRECT MESSAGES
        </div>
        <Plus className="w-4 h-4 cursor-pointer hover:text-[#DBDEE1]" />
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2 space-y-[2px]">
          {friends && friends.length > 0
            ? friends.map((friend) => (
                <button
                  key={friend?._id || ""}
                  className={`flex items-center px-2 py-[4px] gap-3 w-full hover:bg-[#36373C] rounded-sm group ${
                    params.id === friend?.friendId ? "bg-[#36373C]" : ""
                  }`}
                  onClick={() => {
                    router.push(`/channels/@me/${friend?.friendId}`);
                  }}
                >
                  {friend?.friendImageUrl ? (
                    <>
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
                      <div className="text-[14.5px] font-semibold text-[#949BA4] group-hover:text-[#DBDEE1] truncate">
                        {friend?.name}
                      </div>
                    </>
                  ) : (
                    <>
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
                      <div className="text-[14.5px] font-semibold text-[#949BA4] group-hover:text-[#DBDEE1] truncate">
                        {friend?.name}
                      </div>
                    </>
                  )}
                </button>
              ))
            : Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center px-2 py-[6px] gap-3"
                  style={{ opacity: 1 - idx * 0.15 }}
                >
                  <Skeleton className="w-8 h-8 rounded-full bg-[#313338]" />
                  <Skeleton className="h-5 rounded-lg w-[65%] bg-[#313338]" />
                </div>
              ))}
        </div>
      </ScrollArea>

      <UserInfo userData={userData} />
    </div>
  );
}
