import { Plus, Users } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import { UserData } from "@/lib/types";
import UserInfo from "./user-info";

export default function FriendsList({ userData }: { userData: UserData }) {
  return (
    <div className="w-60 bg-[#2B2D31] flex flex-col min-h-screen">
      <div className="p-2.5">
        <button className="w-full h-[28px] bg-[#1E1F22] text-[#949BA4] text-[13px] font-medium text-left px-1.5 py-1 rounded-[4px]">
          Find or start a conversation
        </button>
      </div>
      <Separator className="bg-[#1E1F22] h-[1px] w-full" />
      <ScrollArea className="flex-1">
        <div className="px-2 pt-2">
          <button className="flex items-center w-full px-3 py-[8px] rounded bg-[#404249] hover:bg-[#34353A] gap-4 text-white">
            <Users className="w-6 h-6" />
            <span className="text-[15px] font-medium">Friends</span>
          </button>
        </div>

        <div className="px-4 pt-6 pb-4 flex items-center justify-between text-[#949BA4] group">
          <div className="text-xs font-semibold group-hover:text-[#DBDEE1]">
            DIRECT MESSAGES
          </div>
          <Plus className="w-4 h-4 cursor-pointer hover:text-[#DBDEE1]" />
        </div>

        <div className="px-2 space-y-[2px]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center px-2 py-[6px] gap-3"
              style={{ opacity: 1 - i * 0.15 }}
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
