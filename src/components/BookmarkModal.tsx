import { Bell, BookmarkIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trackBookmarksOpened } from "@/lib/analytics";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function BookmarkModal() {
  const keywords: string[] = ["test", "iphone", "wallet", "keychain"];
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="p-1 rounded cursor-pointer hover:text-gray-300 flex items-center"
          onClick={() => trackBookmarksOpened()}
        >
          <BookmarkIcon className="h-5 w-5" />
          <span className="hidden md:block">Bookmarks</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Saved Searches</DialogTitle>
          <DialogDescription>
            View and manage your saved search keywords and alerts
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[30vh] rounded-md border p-4">
          {keywords.length === 0 && (
            <p>
              No saved searches. Use the search bar to save search keywords and
              get alerts!
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
      </DialogContent>
    </Dialog>
  );
}
