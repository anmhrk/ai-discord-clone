"use client";

import { Plus } from "lucide-react";
import { Separator } from "../ui/separator";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ServerSidebar() {
  const pathname = usePathname();
  const isOnHome = pathname === "/channels/@me";

  return (
    <div className="w-[72px] bg-[#1E1F22] flex flex-col items-center py-3 gap-2">
      <div className="relative flex items-center justify-center w-full group">
        <ActiveIndicator isActive={isOnHome} />
        <Link href="/channels/@me">
          <button
            className={`w-12 h-12 hover:bg-[#5865F2] ${
              isOnHome
                ? "rounded-[16px] bg-[#5865F2]"
                : "rounded-full bg-[#313338]"
            } hover:rounded-[16px] flex items-center justify-center transition-colors`}
          >
            <Image src="/logo-white.svg" alt="Logo" width={28} height={28} />
          </button>
        </Link>
      </div>
      <Separator className="w-8 h-[2px] bg-[#36393F]" />
      <button className="w-12 h-12 bg-[#36393F] rounded-full hover:rounded-[16px] flex items-center justify-center text-[#22A559] hover:bg-[#22A559] hover:text-white transition-colors">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}

const ActiveIndicator = ({ isActive }: { isActive: boolean }) => {
  return (
    <div
      className={`absolute left-0 w-[4px] bg-white rounded-r-full transition-all duration-300 ease-out ${
        isActive ? "h-10 opacity-100" : "h-0 opacity-0"
      } group-hover:opacity-100 ${!isActive && "group-hover:h-5"}`}
    />
  );
};
