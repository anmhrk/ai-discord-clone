"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import MemberList from "./member-list";
import { FaSmile } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { usePathname } from "next/navigation";
import { useChat } from "ai/react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "convex/react";
import { Loader } from "../common/loader";
import { toast } from "sonner";
import Messages from "../common/messages";

export default function ChannelContent({
  preloadedServerData,
  preloadedChannels,
  preloadedFriends,
  preloadedUserData,
}: {
  preloadedServerData: Preloaded<typeof api.server.getServerData>;
  preloadedChannels: Preloaded<typeof api.channel.getChannelsForServer>;
  preloadedFriends: Preloaded<typeof api.friend.getFriendsForUser>;
  preloadedUserData: Preloaded<typeof api.user.getUserData>;
}) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const serverData = usePreloadedQuery(preloadedServerData);
  const channels = usePreloadedQuery(preloadedChannels);
  const friends = preloadedFriends ? usePreloadedQuery(preloadedFriends) : [];
  const userData = usePreloadedQuery(preloadedUserData);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingMessages, setExistingMessages] = useState<any[]>([]);

  const channelId =
    pathSegments.length >= 3
      ? pathSegments[pathSegments.length - 1]
      : serverData?.server.defaultChannelId;
  const channelName =
    channels &&
    (channels?.find((channel) => channel.channelId === channelId)?.name || "");

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    body: {
      friends: friends
        .map((friend) => ({
          id: friend?.friendId,
          name:
            serverData?.serverMembers.find(
              (member) => member.memberId === friend?._id
            )?.name ?? "",
          personality: friend?.personality,
        }))
        .filter((friend) => friend.name),
      id: channelId,
    },
    initialMessages: existingMessages,
  });

  const storedMessages = useQuery(api.message.getMessages, {
    id: channelId || "",
  });

  useEffect(() => {
    if (storedMessages) {
      setExistingMessages(storedMessages);
      setIsLoading(false);
    }
  }, [storedMessages]);

  const messagesEndRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "auto",
        block: "end",
      });
    }
  }, [messages]);

  const handleEmojiClick = (emojiData: any) => {
    handleInputChange({
      target: { value: input + emojiData.emoji },
    } as React.ChangeEvent<HTMLInputElement>);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex-1 flex flex-row">
      <div className="flex-1 flex flex-col h-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <Loader />
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 relative overflow-hidden min-h-0">
              <div className="absolute inset-0 overflow-y-auto">
                <div className="flex flex-col justify-end min-h-full">
                  <div className="flex flex-col">
                    <div className="max-w-sm mx-auto py-8 text-center">
                      <p className="text-3xl font-bold text-[#DCDEE1] mb-1">
                        Welcome to
                      </p>
                      <p className="text-3xl font-bold text-[#DCDEE1] mb-3">
                        {serverData?.server.name}
                      </p>
                      <p className="text-[#B5BAC1] text-sm">
                        This is your brand new, shiny server. Have fun chatting
                        with your AI friends!
                      </p>
                    </div>
                    <Messages
                      messages={messages}
                      userData={userData}
                      friends={friends}
                      serverData={serverData}
                      messagesEndRef={messagesEndRef}
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>
          </>
        )}
        <div className="flex-shrink-0 px-4 pb-6 mt-2">
          <div className="flex items-center gap-4 bg-[#383A40] rounded-lg px-3 py-0.5 min-h-[44px]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (serverData.serverMembers.length === 1) {
                  toast.error("Please add a friend first.");
                  return;
                }
                handleSubmit(e);
              }}
              className="flex items-center w-full gap-4"
            >
              <input
                name="prompt"
                value={input}
                onChange={handleInputChange}
                placeholder={`Message #${channelName}`}
                className="text-[15px] flex-1 bg-[#383A40] font-medium border-none text-[#DCDEE1] placeholder:text-[#6D6F78] focus:outline-none w-full"
              />
              <DropdownMenu
                open={showEmojiPicker}
                onOpenChange={setShowEmojiPicker}
              >
                <DropdownMenuTrigger asChild>
                  <FaSmile className="w-6 h-6 text-[#B3B7BE] hover:text-[#FCC145] cursor-pointer flex-shrink-0" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  align="end"
                  className="p-0 border-none bg-transparent"
                >
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    lazyLoadEmojis={true}
                    theme={Theme.DARK}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </form>
          </div>
        </div>
      </div>
      <MemberList serverMembers={serverData?.serverMembers} />
    </div>
  );
}
