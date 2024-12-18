import { redirect } from "next/navigation";
import TopNav from "../_components/@me/top-nav";
import Content from "../_components/@me/content";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  if (decodeURIComponent(slug) !== "@me") {
    redirect("/channels/@me");
  }

  // if (decodeURIComponent(slug) === "@me") {
  //   return <div>Hello</div>;
  // }

  // // check if slug is valid server id

  // if (isValidServerId) {
  //   return <div>Server page</div>;
  // }

  // if server id is valid, then it should return the base server page because we are not in a channel route

  // if server id is not valid, then it should return a gray page like in discord, the side panel should also change

  return (
    <div className="flex-1 flex flex-col">
      <TopNav />
      <Content />
    </div>
  );
}
