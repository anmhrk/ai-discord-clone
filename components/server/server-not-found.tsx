"use client";

import UserInfo from "../common/user-info";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "../ui/skeleton";

export default function ServerNotFound({
  preloadedUserData,
}: {
  preloadedUserData: Preloaded<typeof api.user.getUserData>;
}) {
  const userData = usePreloadedQuery(preloadedUserData);

  const skeletonWidths = [45, 65, 52, 58, 42, 63];

  return (
    <>
      <div className="w-60 bg-[#2B2D31] flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex flex-col px-2 py-4">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="mb-6">
                <Skeleton className="w-[35%] h-4 rounded-sm bg-[#3A3C44] !animate-none mb-2" />
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center px-2 py-[6px] gap-3 mb-2"
                    style={{ opacity: 100 }}
                  >
                    <Skeleton className="w-4 h-4 rounded-full bg-[#3A3C44] !animate-none" />
                    <Skeleton
                      className={`h-4 rounded-xl bg-[#3A3C44] !animate-none`}
                      style={{ width: `${skeletonWidths[idx]}%` }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <UserInfo userData={userData} />
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <span className="font-bold text-[17px] text-[#949BA4] mb-2">
          NO TEXT CHANNELS
        </span>
        <span className="text-[#949BA4] max-w-md text-center text-[14.5px] font-medium">
          You find yourself in a strange place. You don't have access to any
          text channels, or there are none in this server.
        </span>
      </div>
    </>
  );
}
