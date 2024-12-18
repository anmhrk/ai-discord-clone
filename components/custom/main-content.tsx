import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Search } from "lucide-react";

export default function MainContent() {
  return (
    <div className="flex-1 flex">
      <div className="flex-1 flex flex-col py-4 px-8 gap-5">
        <div className="relative">
          <Input
            placeholder="Search"
            className="bg-[#1E1F22] p-2 pl-2 pr-8 border-none text-zinc-200 text-md font-medium placeholder:text-[#949BA4]"
          />
          <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-[#B5BAC1]" />
        </div>
        <ScrollArea className="flex-1">
          <div className="text-[#B5BAC1] text-xs font-semibold">
            ALL FRIENDS — 0
          </div>
        </ScrollArea>
      </div>

      <div className="w-[360px] border-l border-zinc-700 px-4 py-6">
        <h2 className="text-xl font-extrabold mb-5 text-[#DCDEE1]">
          Active Now
        </h2>
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-[15px] font-semibold text-[#DCDEE1] mb-1">
            It's quiet for now...
          </div>
          <div className="text-[13px] font-medium text-[#B5BAC1] max-w-[320px]">
            When a friend starts an activity—like playing a game or hanging out
            on voice—we'll show it here!
          </div>
        </div>
      </div>
    </div>
  );
}
