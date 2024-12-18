import MainTopNav from "@/components/layout/main-top-nav";
import MainContent from "@/components/layout/main-content";
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
      <MainTopNav />
      <MainContent />
    </div>
  );
}
