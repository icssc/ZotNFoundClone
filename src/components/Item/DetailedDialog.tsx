"use client";
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { User, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { isLostObject } from "@/lib/types";
import { Item } from "@/db/schema";
function DetailedDialog({ item }: { item: Item }) {
  const islostObject = isLostObject(item);

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{item.name}</DialogTitle>
        <DialogDescription>
          {islostObject ? "Lost" : "Found"} item details
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="flex items-start space-x-3">
          <User className="h-5 w-5 text-gray-500 mt-0.5" />
          <div>
            <p className="font-medium">Person</p>
            <p className="text-sm text-gray-500">{item.email}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
          <div>
            <p className="font-medium">Date</p>
            <p className="text-sm text-gray-500">{item.date}</p>
            <p className="text-sm text-gray-500">
              Status: {islostObject ? "Lost" : "Found"}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
          <div>
            <p className="font-medium">Location</p>
            <p className="text-sm text-gray-500">
              {item.location || "No location provided"}
            </p>
          </div>
        </div>

        <div className="pt-2">
          <p className="font-medium">Description</p>
          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Contact</Button>
      </div>
    </DialogContent>
  );
}

export { DetailedDialog };
