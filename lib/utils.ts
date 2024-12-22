import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function splitMessageText(text: string) {
  const messages = text.split(/\n|(?<=^|\n)([^:]+?):/g).filter(Boolean);
  const result = [];

  for (let i = 0; i < messages.length; i += 2) {
    if (messages[i + 1]) {
      result.push({
        name: messages[i].trim(),
        message: messages[i + 1].trim(),
      });
    }
  }

  return result;
}

export function splitMessages(
  content: string | { type: string; text: string }[]
) {
  if (Array.isArray(content)) {
    const text = content[0]?.text || "";
    return splitMessageText(text);
  }

  return splitMessageText(content);
}

export function formatTime(timestamp?: number) {
  if (!timestamp) {
    return `Today at ${new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}`;
  }
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (date.toDateString() === today.toDateString()) {
    return `Today at ${time}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${time}`;
  } else {
    return `${date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
    })}, ${time}`;
  }
}
