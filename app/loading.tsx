import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Image src="/logo-white.svg" alt="logo" width={80} height={80} />
    </div>
  );
}
