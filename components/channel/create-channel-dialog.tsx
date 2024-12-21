import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/common/loader";
import { useRouter } from "next/navigation";
import { Hash } from "lucide-react";
import { createChannel } from "@/actions/channel";

export function CreateChannelDialog({
  open,
  onOpenChange,
  serverId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serverId: string;
}) {
  const [channelName, setChannelName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          setChannelName("");
        }
      }}
    >
      <DialogContent className="max-w-[440px] bg-[#313338] border-none rounded-xl text-white p-0 gap-0">
        <VisuallyHidden.Root>
          <DialogTitle></DialogTitle>
        </VisuallyHidden.Root>
        <DialogHeader className="p-4 pb-2 pt-4 text-xl text-[#DBDEE1] font-semibold">
          Create Channel
        </DialogHeader>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            {error && (
              <p className="text-[#FB767B] text-[12px] italic font-medium">
                {error}
              </p>
            )}
            <label className="uppercase text-xs font-bold text-[#DBDEE1] block">
              Channel Name
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#DCDEE1]" />
              <Input
                className="bg-[#1E1F22] font-medium text-[#DCDEE1] placeholder:text-[#87898C] h-10 pl-8"
                value={channelName}
                placeholder="new-channel"
                onChange={(e) => setChannelName(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end p-4 bg-[#2B2D31] font-medium gap-7 mt-4">
          <button
            className="text-[#f1f3f4] text-[13px] hover:underline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </button>
          <button
            className={`min-w-[130px] h-[38px] text-[13px] rounded-sm transition-colors flex items-center justify-center ${
              !channelName
                ? "bg-[#424993] cursor-not-allowed text-[#9D9E9F]"
                : "hover:bg-[#4752C4] bg-[#5865F2] text-white"
            }`}
            disabled={!channelName}
            onClick={async () => {
              setLoading(true);
              try {
                const { channelId } = await createChannel(
                  serverId,
                  channelName
                );
                onOpenChange(false);
                router.push(`/channels/${serverId}/${channelId}`);
              } catch (error) {
                setError(
                  error instanceof Error ? error.message : "Unknown error"
                );
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? <Loader /> : "Create Channel"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
