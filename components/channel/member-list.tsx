import { ServerMember } from "@/lib/types";
import Image from "next/image";

export default function MemberList({
  serverMembers,
}: {
  serverMembers: ServerMember[];
}) {
  return (
    <div className="w-60 bg-[#2B2D31] px-2 py-6">
      <div className="text-xs font-semibold text-[#949BA4] ml-2">
        ONLINE — {serverMembers.length}
      </div>
      {serverMembers.map((member) => (
        <button
          className="flex items-center gap-3 w-full hover:bg-[#35373C] rounded-sm py-2 group"
          key={member._id}
        >
          {member.profileImageUrl ? (
            <div className="relative">
              <Image
                src={member?.profileImageUrl || ""}
                alt={member.name}
                width={32}
                height={32}
                className="w-8 h-8 ml-2 rounded-full"
              />
              <div className="w-3.5 h-3.5 bg-green-500 rounded-full absolute bottom-[-2px] right-0 border-[2px] border-[#232428]" />
            </div>
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center ml-2"
              style={{ backgroundColor: member.profileColor }}
            >
              <div className="relative">
                <Image
                  src="/logo-white.svg"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="w-5 h-5 rounded-full"
                />
                <div className="w-3.5 h-3.5 bg-green-500 rounded-full absolute bottom-[-10px] left-[14px] border-[2px] border-[#232428]" />
              </div>
            </div>
          )}
          <span className="text-[#949BA4] text-[15px] group-hover:text-[#DCDEE1] font-semibold">
            {member.name}
          </span>
        </button>
      ))}
    </div>
  );
}
