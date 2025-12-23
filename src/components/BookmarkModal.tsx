"use client";

import { useState, useActionState, FormEvent } from "react";
import {
  Bell,
  BookmarkIcon,
  Search,
  UserIcon,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSharedContext } from "./ContextProvider";
import { handleSignIn } from "@/lib/auth-client";
import { trackBookmarksOpened } from "@/lib/analytics";
import {
  keywordFormAction,
  type KeywordActionState,
} from "@/server/actions/search/keywords/action";

const initialState: KeywordActionState = {
  success: true,
  data: [],
};

export function BookmarkModal() {
  const { user, setFilter } = useSharedContext();
  const [open, setOpen] = useState(false);

  const [state, formAction, isPending] = useActionState<
    KeywordActionState,
    FormData
  >(keywordFormAction, initialState);

  const keywords = state.success ? (state.data ?? []) : (state.data ?? []);

  const triggerLoad = () => {
    if (!user) return;
    const fd = new FormData();
    fd.set("intent", "load");
    formAction(fd);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen && user) {
      trackBookmarksOpened();
      triggerLoad();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!user) {
      event.preventDefault();
      toast.info("Please sign in to manage bookmarks.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="p-1 rounded hover:text-gray-300 flex items-center cursor-pointer">
          <BookmarkIcon className="h-5 w-5" />
          <span className="hidden md:block ml-1 text-sm font-medium">
            Bookmarks
          </span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        {user ? (
          <>
            <DialogHeader>
              <DialogTitle>Saved Searches</DialogTitle>
              <DialogDescription>
                Manage your saved search keywords and alerts.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={triggerLoad}
                disabled={isPending}
                className="gap-2"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh
              </Button>
              {!state.success && state.error && (
                <p
                  className="text-xs text-red-400 truncate"
                  title={state.error}
                >
                  {state.error}
                </p>
              )}
            </div>

            <form
              action={formAction}
              onSubmit={handleSubmit}
              className="mt-4 flex items-center gap-2"
            >
              <Input
                name="keyword"
                placeholder="Add a keyword"
                className="flex-1"
                disabled={isPending}
                required
              />
              <input type="hidden" name="intent" value="add" />
              <Button type="submit" disabled={isPending} className="gap-2">
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Bell className="h-4 w-4" />
                )}
                Save
              </Button>
            </form>

            <ScrollArea className="h-[32vh] rounded-md border p-4 mt-4">
              {keywords.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No saved searches yet. Add a keyword to get alerts.
                </p>
              ) : (
                <div className="space-y-2">
                  {keywords.map((searchTerm: string) => (
                    <div
                      key={searchTerm}
                      className="flex items-center justify-between rounded-md border border-white/10 px-3 py-2"
                    >
                      <span className="text-sm font-medium">{searchTerm}</span>
                      <div className="flex items-center gap-2">
                        <form
                          action={formAction}
                          onSubmit={handleSubmit}
                          className="flex items-center"
                        >
                          <input
                            type="hidden"
                            name="keyword"
                            value={searchTerm}
                          />
                          <input type="hidden" name="intent" value="remove" />
                          <Button
                            type="submit"
                            variant="ghost"
                            size="sm"
                            disabled={isPending}
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          >
                            Remove
                          </Button>
                        </form>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="text-sm"
                          onClick={() => {
                            setFilter(searchTerm);
                            setOpen(false);
                          }}
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Sign In Required</DialogTitle>
              <DialogDescription>
                Sign in to save search keywords and receive alerts.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 px-4 text-center space-y-4">
              <p className="text-muted-foreground">
                You need to be signed in to save search keywords and get alerts
                when new items match your searches.
              </p>
              <Button
                onClick={handleSignIn}
                className="bg-white/5 hover:bg-white/10 text-gray-200 gap-2"
              >
                <UserIcon className="h-4 w-4" />
                Sign In
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
