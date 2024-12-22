"use client";

import { UserData } from "@/lib/types";
import { useClerk } from "@clerk/nextjs";
import { Headphones, Mic, Settings } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function UserInfo({ userData }: { userData: UserData }) {
  const { openUserProfile } = useClerk();

  return (
    <div className="px-1 py-[6px] bg-[#232428] flex items-center justify-between gap-2 min-h-[52px] group">
      <div className="px-1 flex items-center gap-2 hover:bg-[#35373C] w-full rounded-[4px] cursor-pointer">
        <div className="relative">
          {/* <Image
            src={userData?.profileImageUrl || ""}
            alt={userData?.name || ""}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          /> */}
          <UserButton appearance={{ elements: { rootBox: "w-8 h-8" } }} />
          <div className="w-3.5 h-3.5 bg-green-500 rounded-full absolute bottom-[2px] right-0 border-[2px] border-[#232428]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate text-[#DBDEE1]">
            {userData?.name}
          </div>
          <div className="relative overflow-hidden h-[16px]">
            <div className="text-xs text-[#949BA4] absolute top-0 left-0 transform group-hover:-translate-y-full transition-all duration-200">
              Online
            </div>
            <div className="text-xs text-[#949BA4] truncate absolute top-0 left-0 transform translate-y-full group-hover:translate-y-0 transition-all duration-200">
              {userData?.username}
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-[2px]">
        <button className="p-[6px] rounded-[4px] hover:bg-[#35373C] text-[#B5BAC1] hover:text-[#DBDEE1]">
          <Mic className="w-5 h-5" />
        </button>
        <button className="p-[6px] rounded-[4px] hover:bg-[#35373C] text-[#B5BAC1] hover:text-[#DBDEE1]">
          <Headphones className="w-5 h-5" />
        </button>
        <button
          className="p-[6px] rounded-[4px] hover:bg-[#35373C] text-[#B5BAC1] hover:text-[#DBDEE1]"
          onClick={() => openUserProfile()}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
