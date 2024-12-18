import { Separator } from "@/components/ui/separator";
import { Users } from "lucide-react";

export default function TopNav() {
  return (
    <div className="flex flex-col text-zinc-400">
      <div className="h-12.5 border-b border-[#202225] flex items-center px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-default">
            <Users className="w-6 h-6" />
            <span className="font-semibold text-zinc-100">Friends</span>
          </div>
          <Separator orientation="vertical" className="h-6 bg-zinc-600" />
          <nav className="flex items-center h-12 gap-4 text-white font-medium">
            <button className="px-2.5 h-fit bg-[#43444B] hover:bg-[#3A3C42] rounded-sm cursor-default">
              All
            </button>
            <button className="bg-[#248045] h-fit px-2 rounded-sm">
              Create Friend
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
