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
import { useChat } from "ai/react";
import { Friend, UserData } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

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
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(false);
    }
  }, [storedMessages]);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    body: {
      friends: {
        id: friendId,
        name: friendName,
        personality: friends.find((friend) => friend?.friendId === friendId)
          ?.personality,
      },
      id: friendId,
    },
    initialMessages: existingMessages,
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

  return (
    <div className="flex-1 flex flex-col h-full">
      {isLoading ? (
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
            <input
              name="prompt"
              value={input}
              onChange={handleInputChange}
              placeholder={`Message @${friendName}`}
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
  );
}
