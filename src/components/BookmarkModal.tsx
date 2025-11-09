"use client";

import { Bell, BookmarkIcon, Search, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSharedContext } from "./ContextProvider";
import { signInWithGoogle } from "@/lib/auth-client";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function BookmarkModal() {
  const { user } = useSharedContext();
  const keywords: string[] = ["test", "iphone", "wallet", "keychain"];

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast.error("Failed to sign in. Please try again.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="p-1 rounded hover:text-gray-300 flex items-center cursor-pointer">
          <BookmarkIcon className="h-5 w-5" />
          <span className="hidden md:block">Bookmarks</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {user ? (
          <>
            <DialogHeader>
              <DialogTitle>Saved Searches</DialogTitle>
              <DialogDescription>
                View and manage your saved search keywords and alerts
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[30vh] rounded-md border p-4">
              {keywords.length === 0 && (
                <p>
                  No saved searches. Use the search bar to save search keywords
                  and get alerts!
                </p>
              )}
              {keywords.map((searchTerm) => (
                <div
                  key={searchTerm}
                  className="flex justify-between items-center p-3"
                >
                  {searchTerm}
                  <div>
                    <Button className="mr-2">
                      <Bell className="w-4 h-4 mr-2 " />
                      Remove Alerts
                    </Button>
                    <Button>
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Sign In Required</DialogTitle>
              <DialogDescription>
                Sign in to save search keywords and receive alerts
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 px-4 text-center">
              <p className="text-gray-400 mb-6">
                You need to be signed in to save search keywords and get alerts
                when new items match your searches.
              </p>
              <Button
                onClick={handleSignIn}
                className="bg-white/5 hover:bg-white/10 text-gray-400"
              >
                <UserIcon className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
