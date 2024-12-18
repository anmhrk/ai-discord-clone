import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <div className="flex flex-col items-center space-y-6">
        <Image
          src="/logo-white.svg"
          alt="Discord Logo"
          width={100}
          height={100}
          className="animate-bounce-slow"
        />
        <h1 className="text-xl md:text-3xl text-center font-semibold text-zinc-200">
          Discord clone, but your friends are AI models
        </h1>
        <Link
          href="/channels/@me"
          className="bg-[#5865F2] hover:bg-[#4752C4] transition-colors px-8 py-3 rounded-full font-semibold"
        >
          Open the app
        </Link>
      </div>
    </div>
  );
}
