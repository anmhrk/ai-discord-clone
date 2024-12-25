import { xai } from "@ai-sdk/xai";
import { streamText, convertToCoreMessages, Message, CoreMessage } from "ai";
import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { auth } from "@clerk/nextjs/server";

interface Friend {
  id: string;
  name: string;
  personality: string;
}

const systemPrompt = (name: string, personality: string) => `\n
    - You are an AI friend named ${name} created by the user who wants to chat with you
    - the user has set your personality as such: ${personality}
    - if the name and personality are based on a real life person such as a celebrity or a public figure, you need to act as if you were them
    - you need to respond to the user's messages as if you were a friend of theirs
    - keep the vibe conversational and friendly
    - respect the user's preferences on name and personality and use it as context for your responses. THIS IS VERY IMPORTANT
    - your responses should be tailored to the user's preferences on name and personality
    - keep your responses concise and to the point
    - always be in character unless the user asks otherwise
    - make the responses human like and not robotic
    - you can use emojis in your responses, but use them very sparingly and only when it absolutely makes sense to do so
    - the current date and time is ${new Date().toLocaleString()} if needed
    - always respond in the format "${name}: your message". never respond without this format
    - if the user sends an image, never say that you can't see it, just respond with whatever they asked you to do with the image
  `;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawFriends = body.friends;
    const friends: Friend[] = Array.isArray(rawFriends)
      ? rawFriends
      : [rawFriends];
    const {
      messages,
      id,
      data,
    }: { messages: Message[]; id: string; data: any } = body;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const coreMessages = convertToCoreMessages(messages);
    const lastMessage = coreMessages[coreMessages.length - 1];

    const formattedLastMessage = data?.imageUrl
      ? {
          role: lastMessage.role,
          content: [
            { type: "text", text: lastMessage.content },
            { type: "image", image: new URL(data.imageUrl) },
          ],
        }
      : lastMessage;

    const updatedMessages = [
      ...coreMessages.slice(0, -1),
      formattedLastMessage,
    ];

    const formattedMessages = updatedMessages.map((msg) => ({
      role: msg.role,
      content: Array.isArray(msg.content)
        ? msg.content
        : [{ type: "text", text: msg.content }],
    }));

    if (friends.length === 1) {
      const { name, personality } = friends[0];

      try {
        const result = streamText({
          model: xai("grok-2-vision-1212"),
          system: `${systemPrompt(name, personality)}`,
          messages: formattedMessages as CoreMessage[],
          onFinish: async ({ response }) => {
            try {
              const existingMessages = await fetchQuery(
                api.message.getMessages,
                {
                  id: id,
                  userId: userId,
                }
              );

              const lastUserMessage = coreMessages[coreMessages.length - 1];
              const lastAIMessage =
                response.messages[response.messages.length - 1];

              const updatedMessages = [
                ...(existingMessages || []),
                { ...lastUserMessage, timestamp: Date.now() },
                { ...lastAIMessage, timestamp: Date.now() + 1 },
              ];

              await fetchMutation(api.message.createMessages, {
                id: id,
                messages: updatedMessages,
                userId: userId,
              });
            } catch (error) {
              console.error("Error in onFinish:", error);
            }
          },
        });

        return result.toDataStreamResponse();
      } catch (error) {
        console.error("Error:", error);
      }
    }

    // group chat logic below

    const latestMessage = messages[messages.length - 1];

    const isFriendMentioned = (message: string, friendName: string) => {
      return message.toLowerCase().includes(friendName.toLowerCase());
    };

    const isEveryoneMentioned = (message: string) => {
      return message.toLowerCase().includes("@everyone");
    };

    let respondingFriends: Friend[] = [];

    if (isEveryoneMentioned(latestMessage.content)) {
      respondingFriends = friends;
    } else {
      const mentionedFriends = friends.filter((friend: Friend) =>
        isFriendMentioned(latestMessage.content, friend.name)
      );

      respondingFriends =
        mentionedFriends.length > 0
          ? mentionedFriends
          : friends
              .sort(() => Math.random() - 0.5)
              .slice(0, Math.floor(Math.random() * 2) + 1);
    }

    try {
      const result = streamText({
        model: xai("grok-2-vision-1212"),
        system: `${systemPrompt(respondingFriends[0].name, respondingFriends[0].personality)}
      Additional context: You are in a group chat with the following participants: ${respondingFriends
        .map((f: Friend) => f.name)
        .join(", ")}. 
      - each participant should respond in character according to their personality
      - responses should feel natural and conversational
      - the same person can respond multiple times if it makes sense in the conversation
      - not everyone needs to respond in a strict order
      - respond as if in a real group chat where people chime in naturally
      ${isEveryoneMentioned(latestMessage.content) ? "Since @everyone was mentioned, ensure ALL participants respond to the message at least once." : ""}`,
        messages: formattedMessages as CoreMessage[],
        onFinish: async ({ response }) => {
          try {
            const existingMessages = await fetchQuery(api.message.getMessages, {
              id: id,
              userId: userId,
            });

            const lastUserMessage = coreMessages[coreMessages.length - 1];
            const lastAIMessage =
              response.messages[response.messages.length - 1];

            const updatedMessages = [
              ...(existingMessages || []),
              { ...lastUserMessage, timestamp: Date.now() },
              { ...lastAIMessage, timestamp: Date.now() + 1 },
            ];

            await fetchMutation(api.message.createMessages, {
              id: id,
              messages: updatedMessages,
              userId: userId,
            });
          } catch (error) {
            console.error("Error in onFinish:", error);
          }
        },
      });

      return result.toDataStreamResponse();
    } catch (error) {
      console.error("Error:", error);
    }
  } catch (error) {
    console.error("Main catch block error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : JSON.stringify(error) },
      { status: 500 }
    );
  }
}
