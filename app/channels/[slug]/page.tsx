import { redirect } from "next/navigation";
import { checkIfUserIsInServer } from "@/actions/server";
import { auth } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import TopNav from "../_components/@me/top-nav";
import Content from "../_components/@me/content";
import FriendsList from "../_components/@me/friends-list";
import ServerNotFound from "../_components/server-not-found";
import ChannelTopNav from "../_components/channel-top-nav";
import ChannelContent from "../_components/channel-content";
import ChannelsList from "../_components/channels-list";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const { userId } = await auth();
  const preloadedUserData = await preloadQuery(api.user.getUserData, {
    userId: userId!,
  });
  const preloadedServerData = await preloadQuery(api.server.getServerData, {
    serverId: slug,
  });
  const preloadedChannels = await preloadQuery(
    api.channel.getChannelsForServer,
    {
      serverId: slug,
    }
  );
  const preloadedFriends = await preloadQuery(api.friend.getFriendsForUser, {
    userId: userId!,
  });

  // if slug is not a number and is not @me, then redirect to /channels/@me
  // if slug is a number, then do the fetch mutation
  // if false, then return a gray page like in discord, the side panel should also change
  // if true, then return the base server page

  if (isNaN(Number(slug)) && decodeURIComponent(slug) !== "@me") {
    redirect("/channels/@me");
  }

  if (decodeURIComponent(slug) !== "@me") {
    const isUserInServer = await checkIfUserIsInServer(slug);

    if (!isUserInServer) {
      return <ServerNotFound />;
    } else {
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
  }

  return (
    <>
      <FriendsList
        preloadedUserData={preloadedUserData}
        preloadedFriends={preloadedFriends}
      />
      <div className="flex-1 flex flex-col">
        <TopNav preloadedUserData={preloadedUserData} />
        <Content preloadedFriends={preloadedFriends} />
      </div>
    </>
  );
}
