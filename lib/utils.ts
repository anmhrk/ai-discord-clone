import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime() {
  return `Today at ${new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })}`;
}

export function splitMessages(content: string) {
  const messages = content.split(/\n|(?<=^|\n)([^:]+?):/g).filter(Boolean);
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
