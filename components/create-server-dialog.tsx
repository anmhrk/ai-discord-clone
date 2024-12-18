import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera, Plus } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { UserData } from "@/lib/types";
import Image from "next/image";
import { createServer } from "@/actions/server";
import { Loader } from "./loader";
import { useRouter } from "next/navigation";

export default function CreateServerDialog({
  open,
  onOpenChange,
  userData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserData;
}) {
  const [serverName, setServerName] = useState(
    `${userData?.username}'s server`
  );
  const [serverImage, setServerImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          setServerName(`${userData?.username}'s server`);
          setServerImage(null);
          setError(null);
        }
      }}
    >
      <DialogContent className="max-w-[440px] bg-[#313338] border-none text-white p-0 gap-0">
        <DialogHeader className="p-4 pb-2 pt-8">
          <DialogTitle className="text-[24px] font-bold text-center leading-7 mb-2">
            Customize Your Server
          </DialogTitle>
          <p className="text-[#B5BAC1] text-center font-medium mt-2 px-6 text-[14px] leading-[18px]">
            Give your new server a personality with a name and an icon. You can
            always change it later.
          </p>
        </DialogHeader>

        <div className="p-4 space-y-4">
          <button
            className="relative w-[80px] h-[80px] mx-auto flex items-center justify-center"
            onClick={() => document.getElementById("server-icon")?.click()}
          >
            <input
              className="hidden"
              id="server-icon"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setServerImage(file);
                }
              }}
            />
            <div className="w-full h-full rounded-full flex flex-col items-center justify-center bg-[#2B2D31] relative text-[#8B8F93]">
              {serverImage ? (
                <Image
                  src={URL.createObjectURL(serverImage)}
                  alt="Server icon"
                  className="w-full h-full object-cover rounded-full"
                  width={80}
                  height={80}
                />
              ) : (
                <>
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#41434A]" />
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-[12px] font-bold">UPLOAD</span>
                  <div className="absolute -right-0 -top-0 w-6 h-6 bg-[#5865F2] rounded-full flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                </>
              )}
            </div>
          </button>

          <div className="space-y-2">
            {error && (
              <p className="text-[#FB767B] text-[12px] italic font-medium">
                {error}
              </p>
            )}
            <label className="uppercase text-xs font-bold text-[#B5BAC1] block">
              Server Name
            </label>
            <Input
              className="bg-[#1E1F22] font-medium text-[#DCDEE1] placeholder:text-[#4E5058] h-10"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end p-4 bg-[#2B2D31] font-medium">
          <button
            className={`min-w-[100px] h-[38px] bg-[#5865F2] text-white text-[14px] rounded-sm transition-colors flex items-center justify-center ${
              !serverName
                ? "bg-[#424993] cursor-not-allowed"
                : "hover:bg-[#4752C4]"
            }`}
            disabled={!serverName}
            onClick={async () => {
              setLoading(true);
              try {
                const { serverId, generalChannelId } = await createServer(
                  serverName,
                  serverImage,
                  userData?.userId || null
                );
                onOpenChange(false);
                router.push(`/channels/${serverId}/${generalChannelId}`);
              } catch (error) {
                setError(
                  error instanceof Error ? error.message : "Unknown error"
                );
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? <Loader /> : "Create"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
