import { Id } from "@/convex/_generated/dataModel";
import { xai } from "@ai-sdk/xai";
import { auth } from "@clerk/nextjs/server";
import { streamText } from "ai";
import { NextResponse } from "next/server";

interface Friend {
  id: Id<"friends">;
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
        - you can use emojis in your responses, but use them very sparingly and only when it absolutely makes sense to do so
      `;

export async function POST(req: Request) {
  const body = await req.json();
  const { messages, friends } = body;
  const { userId } = await auth();

  if (!friends?.length) {
    return NextResponse.json(
      {
        error: "At least one friend is required",
      },
      { status: 400 }
    );
  }

  if (friends.length === 1) {
    const { name, personality } = friends[0];
    const result = streamText({
      model: xai("grok-2-1212"),
      system: systemPrompt(name, personality),
      messages: messages,
      onFinish: () => {},
    });

    return result.toDataStreamResponse();
  }

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

  const result = streamText({
    model: xai("grok-2-1212"),
    system: `${systemPrompt(respondingFriends[0].name, respondingFriends[0].personality)}
    Additional context: You are in a group chat with the following participants: ${respondingFriends
      .map((f: Friend) => f.name)
      .join(", ")}. 
    - each participant should respond in character according to their personality
    - format responses as "Name: message"
    - responses should feel natural and conversational
    - the same person can respond multiple times if it makes sense in the conversation
    - not everyone needs to respond in a strict order
    - respond as if in a real group chat where people chime in naturally
    ${isEveryoneMentioned(latestMessage.content) ? "Since @everyone was mentioned, ensure ALL participants respond to the message at least once." : ""}`,
    messages: messages,
    onFinish: () => {},
  });

  return result.toDataStreamResponse();
}
