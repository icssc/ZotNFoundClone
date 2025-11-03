import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { handleSignIn } from "@/lib/auth-client";

export function SignInDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`bg-black/95 border-white/20 text-white sm:mx-4 overflow-y-auto`}
      >
        <DialogHeader className="pb-2 sm:pb-4">
          <DialogTitle className="text-white text-lg sm:text-xl">
            Add a New Item
          </DialogTitle>
          <DialogDescription>
            Please sign in to your account to add a new item.
          </DialogDescription>
          <Button onClick={handleSignIn}>Sign In</Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
