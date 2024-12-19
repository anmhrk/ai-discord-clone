import { ScrollArea } from "@/components/ui/scroll-area";
import MemberList from "./member-list";

export default function ChannelContent() {
  return (
    <div className="flex-1 flex flex-row h-screen">
      <ScrollArea className="flex-1">Hello</ScrollArea>
      <MemberList />
    </div>
  );
}
