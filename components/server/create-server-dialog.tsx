import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera, ChevronRight, Plus, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { UserData } from "@/lib/types";
import Image from "next/image";
import { createServer } from "@/actions/server";
import { Loader } from "../common/loader";

export default function CreateServerDialog({
  open,
  onOpenChange,
  userData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserData;
}) {
  const [step, setStep] = useState<"initial" | "create" | "join">("initial");
  const [serverName, setServerName] = useState(
    `${userData?.username}'s server`
  );
  const [serverImage, setServerImage] = useState<File | null>(null);
  const [inviteLink, setInviteLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          setStep("initial");
          setServerName(`${userData?.username}'s server`);
          setServerImage(null);
          setInviteLink("");
        }
      }}
    >
      <DialogContent className="max-w-[440px] bg-[#313338] border-none text-white p-0 gap-0">
        {step === "initial" && (
          <>
            <DialogHeader className="p-4 pb-0 pt-8">
              <DialogTitle className="text-[24px] font-bold text-center leading-7 mb-2">
                Create Your Server
              </DialogTitle>
              <p className="text-[#B5BAC1] font-medium text-center mt-2 px-3 text-[14px]">
                Your server is where you and your friends hang out. Make yours
                and start talking.
              </p>
            </DialogHeader>

            <div className="p-4 space-y-4 mb-4">
              <button
                className="w-full bg-[#313338] hover:bg-[#383A3E] p-4 rounded-lg border border-zinc-700 flex items-center gap-4"
                onClick={() => setStep("create")}
              >
                <div className="flex items-center justify-between flex-1">
                  <div className="flex items-center gap-2">
                    <PlusIcon className="w-6 h-6 text-[#949BA4]" />
                    <span className="text-[16px] font-extrabold">
                      Create My Own
                    </span>
                  </div>
                  <ChevronRight className="w-6 h-6 text-[#949BA4]" />
                </div>
              </button>
            </div>

            <div className="bg-[#2B2D31] px-4">
              <div className="text-center space-y-2 mt-4 mb-4">
                <span className="text-[#DCDEE1] text-xl font-bold">
                  Have an invite already?
                </span>
                <button
                  className="w-full h-[40px] font-medium bg-[#4E5058] hover:bg-[#6D6F78] transition-colors text-white text-sm rounded-sm"
                  onClick={() => setStep("join")}
                >
                  Join a Server
                </button>
              </div>
            </div>
          </>
        )}

        {step === "create" && (
          <>
            <DialogHeader className="p-4 pb-2 pt-8">
              <DialogTitle className="text-[24px] font-bold text-center leading-7 mb-2">
                Customize Your Server
              </DialogTitle>
              <p className="text-[#B5BAC1] text-center font-medium mt-2 px-6 text-[14px] leading-[18px]">
                Give your new server a personality with a name and an icon. You
                can always change it later.
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

            <div className="flex justify-between p-4 bg-[#2B2D31] font-medium">
              <button
                onClick={() => {
                  setStep("initial");
                  setServerName(`${userData?.username}'s server`);
                }}
                className="text-white text-[14px]"
              >
                Back
              </button>
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
                    await createServer(
                      serverName,
                      serverImage,
                      userData?.userId || null
                    );
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
          </>
        )}
        {step === "join" && (
          <>
            <DialogHeader className="p-4 pb-0 pt-8">
              <DialogTitle className="text-[24px] font-bold text-center leading-7 mb-1">
                Join a Server
              </DialogTitle>
              <p className="text-[#B5BAC1] font-medium text-center mt-2 px-6 text-[13px] leading-[18px]">
                Enter an invite below to join an existing server
              </p>
            </DialogHeader>

            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <label className="uppercase text-xs font-bold text-[#B5BAC1]">
                    Invite Link
                  </label>
                  <span className="text-[#ED4245] ml-1">*</span>
                </div>
                <Input
                  className="bg-[#1E1F22] border-none text-white placeholder:text-[#87898C] h-10"
                  placeholder="https://not-discord.vercel.app/hTKzmak"
                  value={inviteLink}
                  onChange={(e) => setInviteLink(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="uppercase text-xs font-bold text-[#B5BAC1] block">
                  Invites should look like
                </label>
                <div className="text-[#F2F3F5] text-[13px]">
                  <p>hTKzmak</p>
                  <p>https://not-discord.vercel.app/hTKzmak</p>
                  <p>https://not-discord.vercel.app/cool-people</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between p-4 bg-[#2B2D31] font-medium">
              <button
                onClick={() => {
                  setStep("initial");
                  setServerName(`${userData?.username}'s server`);
                }}
                className="text-white text-[14px]"
              >
                Back
              </button>
              <button className="px-4 h-[38px] bg-[#5865F2] hover:bg-[#4752C4] text-white text-[14px] rounded-sm transition-colors">
                Join Server
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
