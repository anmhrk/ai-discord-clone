import TopNav from "@/app/channels/_components/top-nav";
import Content from "@/app/channels/_components/content";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  if (decodeURIComponent(slug) !== "@me") {
    redirect("/channels/@me");
  }

  return (
    <div className="flex-1 flex flex-col">
      <TopNav />
      <Content />
    </div>
  );
}
