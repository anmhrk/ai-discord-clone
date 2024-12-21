import { Friend, ServerData, ServerMember } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { SearchIcon } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { addFriendToServer } from "@/actions/server";
import { toast } from "sonner";

export default function AddFriendsDialog({
  open,
  onOpenChange,
  friends,
  serverData,
  serverMembers,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  friends: Friend[];
  serverData: ServerData;
  serverMembers: ServerMember[];
}) {
  const [search, setSearch] = useState("");
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>(friends);

  useEffect(() => {
    const nonMemberFriends = friends.filter(
      (friend) => !serverMembers.some((member) => member.name === friend?.name)
    );
    setFilteredFriends(nonMemberFriends);
  }, [friends, serverMembers]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          setSearch("");
        }
      }}
    >
      <DialogContent className="max-w-[440px] bg-[#313338] border-none rounded-xl text-white p-0 gap-0">
        <VisuallyHidden.Root>
          <DialogTitle></DialogTitle>
        </VisuallyHidden.Root>
        <DialogHeader className="p-4 pb-2 pt-4 text-md truncate text-[#DBDEE1] font-semibold">
          Add friends to {serverData?.name}
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="relative p-4">
              <Input
                className="bg-[#1E1F22] font-medium text-[#DCDEE1] placeholder:text-[#87898C] h-8 pr-9"
                value={search}
                placeholder="Search for friends"
                onChange={(e) => {
                  setSearch(e.target.value);
                  const nonMemberFriends = friends.filter(
                    (friend) =>
                      !serverMembers.some(
                        (member) => member.name === friend?.name
                      ) &&
                      friend?.name
                        ?.toLowerCase()
                        .includes(e.target.value.toLowerCase())
                  );
                  setFilteredFriends(nonMemberFriends);
                }}
              />
              <SearchIcon className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#DCDEE1]" />
            </div>
            <Separator className="bg-[#23262A] h-[1px] w-full" />
          </div>

          <div className="flex flex-col px-4 pb-4">
            {filteredFriends.length === 0 && (
              <div className="flex items-center justify-center w-full py-4">
                <p className="text-[#87898C] text-[13px] font-medium">
                  Either no friends found or all friends are already in the
                  server
                </p>
              </div>
            )}
            {filteredFriends.map((friend) => (
              <div
                key={friend?.friendId || ""}
                className="flex items-center w-full justify-between py-2 px-2 hover:bg-[#3A3B42] rounded-sm group"
              >
                <div className="flex items-center gap-3">
                  {friend?.friendImageUrl ? (
                    <Image
                      src={friend?.friendImageUrl}
                      alt={friend?.name || ""}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: friend?.profileColor }}
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
                  <div className="flex flex-col justify-start">
                    <div className="text-[#B5BAC1] truncate text-left flex items-center gap-1">
                      <span className="text-[15px] font-medium">
                        {friend?.name}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  className="px-4 py-1.5 min-w-[75px] rounded-sm text-sm bg-[#313338] font-medium group-hover:bg-[#247F46] ring-1 ring-[#247F46] hover:bg-[#1A6335] text-[#FFF]"
                  onClick={async () => {
                    try {
                      const result = await addFriendToServer(
                        serverData.serverId,
                        friend?.friendId!
                      );
                      if (result) {
                        toast.success("Friend added");
                      }
                    } catch (error) {
                      toast.error(
                        error instanceof Error
                          ? error.message
                          : "Failed to add friend"
                      );
                    }
                  }}
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
