import { Loader } from "@/components/common/loader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserData } from "@/lib/types";
import { useState } from "react";
import { Camera, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createFriend } from "@/actions/friend";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateFriendDialog({
  open,
  onOpenChange,
  userData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserData;
}) {
  const [name, setName] = useState("");
  const [friendProfileImage, setFriendProfileImage] = useState<File | null>(
    null
  );
  const [model, setModel] = useState("");
  const [personality, setPersonality] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const models = ["gpt-4o", "gemini-2.0-flash", "grok"];

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          setName("");
          setModel("");
          setPersonality("");
          setFriendProfileImage(null);
          setError(null);
        }
      }}
    >
      <DialogContent className="max-w-[440px] bg-[#313338] border-none text-white p-0 gap-0">
        <DialogHeader className="p-4 pb-2 pt-8">
          <DialogTitle className="text-[24px] font-bold text-center leading-7 mb-2">
            Create Your AI Friend
          </DialogTitle>
          <p className="text-[#B5BAC1] text-center font-medium mt-2 px-6 text-[14px] leading-[18px]">
            Customize your new AI friend here. You can always change these
            settings later.
          </p>
        </DialogHeader>

        <div className="p-4 space-y-4">
          <button
            className="relative w-[80px] h-[80px] mx-auto flex items-center justify-center"
            onClick={() =>
              document.getElementById("friend-profile-image")?.click()
            }
          >
            <input
              className="hidden"
              id="friend-profile-image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFriendProfileImage(file);
                }
              }}
            />
            <div className="w-full h-full rounded-full flex flex-col items-center justify-center bg-[#2B2D31] relative text-[#8B8F93]">
              {friendProfileImage ? (
                <Image
                  src={URL.createObjectURL(friendProfileImage)}
                  alt="Friend profile image"
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
            <div className="flex items-center">
              <label className="uppercase text-xs font-bold text-[#B5BAC1] block">
                Friend Name/Username
              </label>
              <span className="text-[#ED4245] ml-1">*</span>
            </div>
            <Input
              className="bg-[#1E1F22] font-medium text-[#DCDEE1] placeholder:text-[#4E5058] h-10"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="flex items-center">
              <label className="uppercase text-xs font-bold text-[#B5BAC1] block">
                AI Model
              </label>
              <span className="text-[#ED4245] ml-1">*</span>
            </div>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="bg-[#1E1F22] font-medium text-[#DCDEE1] border-none focus:ring-0 placeholder:text-[#4E5058] h-10">
                <SelectValue
                  className="text-[#4E5058] font-medium"
                  placeholder="Select AI Model"
                />
              </SelectTrigger>
              <SelectContent className="bg-[#1E1F22] border-none">
                {models.map((model, idx) => (
                  <SelectItem
                    key={idx}
                    value={model}
                    className="text-[#DCDEE1] font-medium h-10 focus:text-[#DCDEE1] focus:bg-[#404249]"
                  >
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center">
              <label className="uppercase text-xs font-bold text-[#B5BAC1] block">
                Personality
              </label>
              <span className="text-[#ED4245] ml-1">*</span>
            </div>
            <Textarea
              className="bg-[#1E1F22] resize-none flex-1 border-none font-medium text-[#DCDEE1] placeholder:text-[#4E5058]"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              rows={3}
              placeholder="Type how your friend should act here..."
            />
          </div>
        </div>

        <div className="flex justify-end items-center p-4 bg-[#2B2D31] font-medium">
          {error && (
            <p className="text-[#FB767B] text-[12px] italic font-medium mr-5">
              Error: {error}
            </p>
          )}
          <button
            className={`min-w-[100px] h-[38px] text-white text-[14px] rounded-sm transition-colors flex items-center justify-center ${
              !personality || !name || !model
                ? "bg-[#424993] cursor-not-allowed"
                : "hover:bg-[#4752C4] bg-[#5865F2]"
            }`}
            disabled={!personality || !name || !model}
            onClick={async () => {
              setLoading(true);
              try {
                await createFriend(
                  userData?.userId ?? null,
                  name,
                  model,
                  personality,
                  friendProfileImage
                );
                onOpenChange(false);
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
