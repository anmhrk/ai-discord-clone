import MainTopNav from "@/components/main-top-nav";
import MainContent from "@/components/main-content";

export default function Page() {
  return (
    <div className="flex-1 flex flex-col">
      <MainTopNav />
      <MainContent />
    </div>
  );
}
