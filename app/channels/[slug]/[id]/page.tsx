import { checkIfUserCreatedFriend } from "@/actions/friend";
import { checkIfUserIsInServer } from "@/actions/server";
import ChannelContent from "@/components/channel/channel-content";
import ChannelTopNav from "@/components/channel/channel-top-nav";
import ChannelsList from "@/components/channel/channels-list";
import FriendsList from "@/components/homepage/friends-list";
import ServerNotFound from "@/components/server/server-not-found";
import { api } from "@/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const { userId } = await auth();

  const preloadedUserData = await preloadQuery(api.user.getUserData, {
    userId: userId!,
  });

  const preloadedFriends = await preloadQuery(api.friend.getFriendsForUser, {
    userId: userId!,
  });

  // all checks from [slug]/page.tsx, and:
  // here slug could be @me or server id
  // if @me then id is friend id
  // if server id then id is channel id
  // do valid checks here

  if (
    (isNaN(Number(slug)) && decodeURIComponent(slug) !== "@me") ||
    isNaN(Number(id))
  ) {
    redirect("/channels/@me");
  }

  if (decodeURIComponent(slug) !== "@me") {
    // this is a channel

    const isUserInServer = await checkIfUserIsInServer(slug); // this also checks if the server exists

    if (!isUserInServer) {
      return <ServerNotFound preloadedUserData={preloadedUserData} />;
    } else {
      // server is valid, return channel stuff

      const preloadedServerData = await preloadQuery(api.server.getServerData, {
        serverId: slug,
      });
      const preloadedChannels = await preloadQuery(
        api.channel.getChannelsForServer,
        {
          serverId: slug,
        }
      );

      return (
        <>
          <ChannelsList
            preloadedUserData={preloadedUserData}
            preloadedChannels={preloadedChannels}
            preloadedServerData={preloadedServerData}
          />
          <div className="flex-1 flex flex-col">
            <ChannelTopNav
              preloadedServerData={preloadedServerData}
              preloadedChannels={preloadedChannels}
            />
            <ChannelContent
              preloadedServerData={preloadedServerData}
              preloadedChannels={preloadedChannels}
            />
          </div>
        </>
      );
    }
  } else {
    // this is a friend
    const result = await checkIfUserCreatedFriend(id); // this also checks if the friend exists

    if (!result) {
      redirect("/channels/@me");
    } else {
      // return dm
      return (
        <>
          <FriendsList
            preloadedUserData={preloadedUserData}
            preloadedFriends={preloadedFriends}
          />
          <div className="flex-1 flex flex-col"></div>
        </>
      );
    }
  }
}
