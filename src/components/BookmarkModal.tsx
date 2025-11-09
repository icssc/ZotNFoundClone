"use client";

import { Bell, BookmarkIcon, Search, UserIcon, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useSharedContext } from "./ContextProvider";
import { signInWithGoogle } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState, useEffect, useCallback } from "react";
import { getUserKeywords } from "@/server/actions/search/get-user-keywords/action";
import { addKeyword } from "@/server/actions/search/add-keyword/action";
import { removeKeyword } from "@/server/actions/search/remove-keyword/action";
import { isError } from "@/lib/types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function BookmarkModal() {
  const { user, setFilter } = useSharedContext();
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [removingKeywords, setRemovingKeywords] = useState<Set<string>>(
    new Set()
  );

  const fetchKeywords = async () => {
    if (!user?.email) return;
    setIsLoading(true);
    const result = await getUserKeywords();
    if (isError(result)) {
      toast.error(result.error);
      setKeywords([]);
    } else {
      setKeywords(result.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!user?.email) return;
    
    let cancelled = false;
    
    const loadKeywords = async () => {
      setIsLoading(true);
      const result = await getUserKeywords();
      if (cancelled) return;
      if (isError(result)) {
        toast.error(result.error);
        setKeywords([]);
      } else {
        setKeywords(result.data);
      }
      setIsLoading(false);
    };
    
    loadKeywords();
    
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim() || isAdding) return;

    const keywordToAdd = newKeyword.trim().toLowerCase();
    
    // Check if keyword already exists locally
    if (keywords.includes(keywordToAdd)) {
      toast.error("You are already subscribed to this keyword.");
      return;
    }

    // Optimistic update: add to local state immediately
    setKeywords((prev) => [...prev, keywordToAdd]);
    const previousKeywords = keywords;
    setNewKeyword("");
    setIsAdding(true);

    // Perform server action in the background
    addKeyword(keywordToAdd)
      .then((result) => {
        setIsAdding(false);
        if (isError(result)) {
          // Revert optimistic update on error
          setKeywords(previousKeywords);
          toast.error(result.error);
        } else {
          toast.success("Keyword added successfully");
        }
      })
      .catch((error) => {
        // Handle promise rejection (network errors, etc.)
        setIsAdding(false);
        setKeywords(previousKeywords);
        toast.error("Failed to add keyword. Please try again.");
        console.error("Error adding keyword:", error);
      });
  };

  const handleRemoveKeyword = async (keyword: string) => {
    if (removingKeywords.has(keyword)) return;

    // Optimistic update: remove from local state immediately
    const previousKeywords = keywords;
    setKeywords((prev) => prev.filter((k) => k !== keyword));
    setRemovingKeywords((prev) => new Set(prev).add(keyword));

    // Perform server action in the background
    removeKeyword(keyword)
      .then((result) => {
        setRemovingKeywords((prev) => {
          const next = new Set(prev);
          next.delete(keyword);
          return next;
        });

        if (isError(result)) {
          // Revert optimistic update on error
          setKeywords(previousKeywords);
          toast.error(result.error);
        } else {
          toast.success("Keyword removed successfully");
        }
      })
      .catch((error) => {
        // Handle promise rejection (network errors, etc.)
        setRemovingKeywords((prev) => {
          const next = new Set(prev);
          next.delete(keyword);
          return next;
        });
        setKeywords(previousKeywords);
        toast.error("Failed to remove keyword. Please try again.");
        console.error("Error removing keyword:", error);
      });
  };

  const handleSearchKeyword = (keyword: string) => {
    setFilter(keyword);
    // Close the dialog by finding the trigger and clicking it, or we could use state
    // For now, we'll just set the filter and let the user close manually
  };

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
            
            {/* Add Keyword Form */}
            <form onSubmit={handleAddKeyword} className="flex gap-2 px-1 pb-3">
              <Input
                type="text"
                placeholder="Add a search keyword..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="flex-1"
                disabled={isAdding}
              />
              <Button
                type="submit"
                disabled={isAdding || !newKeyword.trim()}
                className="shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </form>

            <ScrollArea className="h-[30vh] rounded-md border p-4">
              {isLoading ? (
                <p className="text-gray-400">Loading your bookmarks...</p>
              ) : keywords.length === 0 ? (
                <p>
                  No saved searches. Add a keyword above to get alerts when new
                  items match your searches!
                </p>
              ) : (
                keywords.map((searchTerm) => (
                  <div
                    key={searchTerm}
                    className="flex justify-between items-center p-3 hover:bg-white/5 rounded-md transition-colors"
                  >
                    <span className="flex-1 font-medium">{searchTerm}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSearchKeyword(searchTerm)}
                        className="h-8"
                      >
                        <Search className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveKeyword(searchTerm)}
                        disabled={removingKeywords.has(searchTerm)}
                        className="h-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        {removingKeywords.has(searchTerm) ? (
                          <X className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))
              )}
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
