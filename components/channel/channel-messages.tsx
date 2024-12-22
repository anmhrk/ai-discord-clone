import { Message } from "ai";
import Image from "next/image";
import { formatTime, splitMessages } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ChannelMessagesProps {
  messages: Message[];
  isLoading: boolean;
  userData: any;
  friends: any[];
  serverData: any;
  messagesEndRef: any;
}

export default function ChannelMessages({
  messages,
  isLoading,
  userData,
  friends,
  serverData,
  messagesEndRef,
}: ChannelMessagesProps) {
  return (
    <div className="flex flex-col gap-2 px-4 pb-0.5">
      {isLoading ? (
        Array(10)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex gap-4 py-[2px]">
              <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="w-32 h-5" />
                <Skeleton className="w-full h-4" />
              </div>
            </div>
          ))
      ) : (
        <>
          {messages.map((message, messageIndex) => {
            if (message.role === "user") {
              return (
                <div
                  key={`user-${messageIndex}-${message.content.slice(0, 10)}`}
                  className="flex gap-4 py-[2px] hover:bg-[#2D3035]"
                >
                  <div className="w-10 h-10 rounded-full flex-shrink-0">
                    <Image
                      src={userData?.profileImageUrl || ""}
                      alt="user avatar"
                      width={40}
                      height={40}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[15px] text-[#F2F3F5]">
                        {userData?.name}
                      </span>
                      <span className="text-[11.5px] font-medium text-[#949BA4]">
                        {formatTime((message as any).timestamp || Date.now())}
                      </span>
                    </div>
                    <div className="text-[#DBDEE1] text-[15px]">
                      {message.content}
                    </div>
                  </div>
                </div>
              );
            }

            if (Array.isArray(message.content)) {
              return message.content.map((content, contentIndex) => {
                return splitMessages(content.text).map(
                  (aiMessage, subIndex) => {
                    const friend = friends.find(
                      (f) =>
                        serverData?.serverMembers.find(
                          (m: any) => m.memberId === f?._id
                        )?.name === aiMessage.name
                    );

                    return (
                      <div
                        key={`array-${messageIndex}-${contentIndex}-${subIndex}-${aiMessage.name}`}
                        className="flex gap-4 py-[2px] hover:bg-[#2D3035]"
                      >
                        {friend?.friendImageUrl ? (
                          <div className="w-10 h-10 rounded-full flex-shrink-0">
                            <Image
                              src={friend.friendImageUrl}
                              alt={aiMessage.name}
                              width={40}
                              height={40}
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>
                        ) : (
                          <div
                            className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center"
                            style={{
                              backgroundColor: friend?.profileColor ?? "",
                            }}
                          >
                            <Image
                              src="/logo-white.svg"
                              alt="Logo"
                              width={32}
                              height={32}
                              className="w-6 h-6 rounded-full"
                            />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[15px] text-[#F2F3F5]">
                              {aiMessage.name}
                            </span>
                            <span className="text-[11.5px] font-medium text-[#949BA4]">
                              {formatTime(
                                (message as any).timestamp || Date.now()
                              )}
                            </span>
                          </div>
                          <div className="text-[#DBDEE1] text-[15px]">
                            {aiMessage.message}
                          </div>
                        </div>
                      </div>
                    );
                  }
                );
              });
            }

            return splitMessages(message.content).map((aiMessage, index) => {
              const friend = friends.find(
                (f) =>
                  serverData?.serverMembers.find(
                    (m: any) => m.memberId === f?._id
                  )?.name === aiMessage.name
              );

              return (
                <div
                  key={`string-${messageIndex}-${index}-${aiMessage.name}`}
                  className="flex gap-4 py-[2px] hover:bg-[#2D3035]"
                >
                  {friend?.friendImageUrl ? (
                    <div className="w-10 h-10 rounded-full flex-shrink-0">
                      <Image
                        src={friend.friendImageUrl}
                        alt={aiMessage.name}
                        width={40}
                        height={40}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{
                        backgroundColor: friend?.profileColor ?? "",
                      }}
                    >
                      <Image
                        src="/logo-white.svg"
                        alt="Logo"
                        width={32}
                        height={32}
                        className="w-6 h-6 rounded-full"
                      />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[15px] text-[#F2F3F5]">
                        {aiMessage.name}
                      </span>
                      <span className="text-[11.5px] font-medium text-[#949BA4]">
                        {formatTime((message as any).timestamp || Date.now())}
                      </span>
                    </div>
                    <div className="text-[#DBDEE1] text-[15px]">
                      {aiMessage.message}
                    </div>
                  </div>
                </div>
              );
            });
          })}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
