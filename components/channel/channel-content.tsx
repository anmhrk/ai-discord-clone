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
import { FaCirclePlus } from "react-icons/fa6";
import Image from "next/image";
import { deleteImage, uploadImage } from "@/actions/image";
import { Id } from "@/convex/_generated/dataModel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [pageLoading, setPageLoading] = useState(true);
  const [existingMessages, setExistingMessages] = useState<any[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(
    null
  );
  const [isImageLoading, setIsImageLoading] = useState(false);

  const channelId =
    pathSegments.length >= 3
      ? pathSegments[pathSegments.length - 1]
      : serverData?.server.defaultChannelId;
  const channelName =
    channels &&
    (channels?.find((channel) => channel.channelId === channelId)?.name || "");

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
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
        data: imageUrl ? { imageUrl } : undefined,
      },
      initialMessages: existingMessages,
      onFinish: async () => {
        setImage(null);
        setImageUrl(null);
        setImageStorageId(null);
        if (imageStorageId) {
          await deleteImage(imageStorageId as Id<"_storage">);
        }
      },
      onError: (error) => {
        toast.error(JSON.parse(error.message).error);
      },
    });

  const storedMessages = useQuery(api.message.getMessages, {
    id: channelId || "",
  });

  useEffect(() => {
    if (storedMessages) {
      setExistingMessages(storedMessages);
      setPageLoading(false);
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

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        setImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiClick = (emojiData: any) => {
    handleInputChange({
      target: { value: input + emojiData.emoji },
    } as React.ChangeEvent<HTMLInputElement>);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    if (image) {
      setIsImageLoading(true);
      const uploadFile = async () => {
        try {
          const { url, storageId } = await uploadImage(image);
          setImageUrl(url);
          setImageStorageId(storageId);
        } catch (error) {
          toast.error("Image upload failed");
        } finally {
          setIsImageLoading(false);
        }
      };

      uploadFile();
    }
  }, [image]);

  return (
    <div className="flex-1 flex flex-row">
      <div className="flex-1 flex flex-col h-full">
        {pageLoading ? (
          <div className="flex-1 flex items-center justify-center">
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
              <div className="relative flex-1 flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />

                {isImageLoading ? (
                  <div className="w-6 h-6 rounded bg-[#4A4D55] animate-pulse flex-shrink-0" />
                ) : imageUrl ? (
                  <div className="relative">
                    <Image
                      src={imageUrl}
                      alt="Upload"
                      className="w-6 h-6 object-cover cursor-pointer rounded-md"
                      onClick={() => fileInputRef.current?.click()}
                      width={24}
                      height={24}
                    />
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.preventDefault();
                        setImage(null);
                        setImageUrl(null);
                        try {
                          await deleteImage(imageStorageId as Id<"_storage">);
                        } catch (error) {
                          toast.error("Failed to delete image");
                        }
                        setImageStorageId(null);
                      }}
                      className="absolute -top-1 -right-1 bg-white text-black rounded-full w-3 h-3 flex items-center justify-center text-[10px] hover:bg-[#DBDEE1]"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <div>
                          <FaCirclePlus
                            className={`w-6 h-6 ${
                              userData?.hasNitro
                                ? "text-[#B3B7BE] hover:text-[#DBDEE1] cursor-pointer"
                                : "text-[#6D6F78] cursor-not-allowed"
                            } flex-shrink-0`}
                            onClick={() =>
                              userData?.hasNitro &&
                              fileInputRef.current?.click()
                            }
                          />
                        </div>
                      </TooltipTrigger>
                      {!userData?.hasNitro && (
                        <TooltipContent>
                          <p>Subscribe to Nitro to send images</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                )}

                <input
                  ref={inputRef}
                  name="prompt"
                  value={input}
                  onChange={handleInputChange}
                  placeholder={isLoading ? "" : `Message #${channelName}`}
                  className={`text-[15px] w-full bg-[#383A40] font-medium text-[#DCDEE1] border-none placeholder:text-[#6D6F78] focus:outline-none ${
                    isLoading ? "caret-transparent" : ""
                  }`}
                  disabled={isLoading}
                />
                {isLoading && (
                  <div className="absolute left-9 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-[#B5BAC1] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
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
