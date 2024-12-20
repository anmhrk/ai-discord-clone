import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

export function CreateChannelDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Create Channel</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create Channel</DialogTitle>
      </DialogContent>
    </Dialog>
  );
}
