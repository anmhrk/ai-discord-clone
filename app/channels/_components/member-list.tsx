import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MemberList() {
  return (
    <div className="w-60 bg-[#2B2D31] px-2 py-6">
      <div className="text-xs font-semibold text-[#949BA4] ml-2">
        ONLINE — 1
      </div>
      <button className="flex items-center gap-3 w-full hover:bg-[#35373C] rounded-sm py-2 group">
        <div className="relative">
          <Avatar className="h-8 w-8 ml-2">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div className="w-3.5 h-3.5 bg-green-500 rounded-full absolute bottom-[-2px] right-0 border-[2px] border-[#232428]" />
        </div>
        <span className="text-[#949BA4] text-[15px] group-hover:text-[#DCDEE1] font-bold">
          anmol
        </span>
      </button>
    </div>
  );
}
