"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import MemberList from "./member-list";
import { FaSmile } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

export default function ChannelContent({
  preloadedServerData,
  preloadedChannels,
}: {
  preloadedServerData: Preloaded<typeof api.server.getServerData>;
  preloadedChannels: Preloaded<typeof api.channel.getChannelsForServer>;
}) {
  const params = useParams<{ serverId: string; channelId: string }>();
  const serverData = usePreloadedQuery(preloadedServerData);
  const channels = usePreloadedQuery(preloadedChannels);
  const noChannelSelected = params.channelId === undefined;

  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const channelName =
    channels && noChannelSelected
      ? channels?.find(
          (channel) => channel.channelId === serverData?.server.defaultChannelId
        )?.name
      : channels && params.channelId
        ? channels?.find((channel) => channel.channelId === params.channelId)
            ?.name
        : "";

  // const messagesEndRef = useRef<HTMLDivElement>(null);

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  // const scrollToBottomInstant = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  // };

  // // Initial scroll on mount - instant
  // useEffect(() => {
  //   scrollToBottomInstant();
  // }, []);

  // // Smooth scroll when messages change
  // useEffect(() => {
  //   if (messages.length > 0) {
  //     scrollToBottom();
  //   }
  // }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [message]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // call send message server action
    }
  };

  return (
    <div className="flex-1 flex flex-row">
      <div className="flex-1 flex flex-col h-full">
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
                    This is your brand new, shiny server. Have fun chatting with
                    your AI friends!
                  </p>
                </div>
                <div className="flex flex-col gap-2 px-4 pb-4">
                  {/* map messages here */}
                  {/* <div ref={messagesEndRef} /> */}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="flex-shrink-0 px-4 pb-6 mt-2">
          <div className="flex items-center gap-4 bg-[#383A40] rounded-lg px-3 py-0.5 min-h-[44px]">
            <Textarea
              ref={textareaRef}
              placeholder={`Message #${channelName}`}
              className="resize-none max-h-[420px] flex-1 bg-[#383A40] font-medium border-none text-[#DCDEE1] placeholder:text-[#6D6F78]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <FaSmile className="w-6 h-6 text-[#B3B7BE] hover:text-[#FCC145] cursor-pointer flex-shrink-0" />
          </div>
        </div>
      </div>
      <MemberList serverMembers={serverData?.serverMembers} />
    </div>
  );
}
