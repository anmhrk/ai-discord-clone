import EmojiPicker from "emoji-picker-react";
import { Theme } from "emoji-picker-react";
import { Loader } from "../common/loader";
import Messages from "../common/messages";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import { FaSmile } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { useChat } from "ai/react";
import { Friend, UserData } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";
import { deleteImage, uploadImage } from "@/actions/image";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DirectMessage({
  friends,
  friendId,
  userData,
}: {
  friends: Friend[];
  friendId: string;
  userData: UserData;
}) {
  const [existingMessages, setExistingMessages] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const friendName = friends.find(
    (friend) => friend?.friendId === friendId
  )?.name;

  const storedMessages = useQuery(api.message.getMessages, {
    id: friendId || "",
    userId: userData?.userId || "",
  });

  useEffect(() => {
    if (storedMessages) {
      setExistingMessages(storedMessages);
      setPageLoading(false);
    }
  }, [storedMessages]);

  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(
    null
  );
  const [isImageLoading, setIsImageLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      body: {
        friends: {
          id: friendId,
          name: friendName,
          personality: friends.find((friend) => friend?.friendId === friendId)
            ?.personality,
        },
        id: friendId,
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
    });

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

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  return (
    <div className="flex-1 flex flex-col h-full">
      {pageLoading ? (
        <div className="flex flex-col items-center justify-center h-full">
          <Loader />
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1 relative overflow-hidden min-h-0">
            <div className="absolute inset-0 overflow-y-auto">
              <div className="flex flex-col justify-end min-h-full">
                <div className="flex flex-col">
                  <Messages
                    messages={messages}
                    userData={userData}
                    friends={friends}
                    friendId={friendId}
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
            onSubmit={handleSubmit}
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
                            userData?.hasNitro && fileInputRef.current?.click()
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
                placeholder={isLoading ? "" : `Message @${friendName}`}
                className="text-[15px] w-full bg-[#383A40] font-medium border-none text-[#DCDEE1] placeholder:text-[#6D6F78] focus:outline-none"
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
  );
}
