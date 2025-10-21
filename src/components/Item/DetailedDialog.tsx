"use client";
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Mail, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { isLostObject } from "@/lib/types";
import { Item } from "@/db/schema";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

function isValidUrl(string: string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

function DetailedDialog({ item }: { item: Item}) {
  const islostObject = isLostObject(item);
  const [isCopied, setIsCopied] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/?item=${item.id}`;
      await navigator.clipboard.writeText(shareUrl);
      
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Error sharing:', error);
    } 
  };

  const handleViewContact = () => {
    setShowEmail(true);
    setTimeout(() => setShowEmail(false), 3000); // Reset after 3 seconds
  };

  return (
    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
      <div className="flex flex-col sm:flex-row gap-4 my-8">
        {/* Image - Top on mobile, Left on desktop */}
        <div className="w-full max-w-sm sm:w-64 h-80 sm:h-64 relative mx-auto sm:mx-8">
          <Image
            src={isValidUrl(item.image) ? item.image : "/placeholder.jpg"}
            alt={item.name || "Item Image"}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 640px) 100vw, 256px"
          />
        </div>

        {/* Content - Bottom on mobile, Right on desktop */}
        <div className="min-w-76 flex flex-col justify-between px-4 sm:px-0">
          <DialogHeader className="text-left pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {item.name}
            </DialogTitle>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                islostObject 
                  ? "bg-red-100 text-red-800" 
                  : "bg-green-100 text-green-800"
              }`}>
                {islostObject ? "Lost" : "Found"}
              </span>
              <span className="text-sm text-gray-500">
                Posted: {new Date(item.date).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric'
                })}
              </span>
            </div>
          </DialogHeader>

          <Separator />

          <div className="space-y-3 mt-4">
            <div>
              <p className="font-semibold text-gray-900 mb-2 text-sm">Description:</p>
              <div className="text-xs space-y-1">
                <p className="text-gray-500">{islostObject ? "Lost on" : "Found on"} {new Date(item.itemDate).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric'
                })}</p>
                {/* TODO: Make location not coordinates */}
                {/* <p>{item.location || "No location provided"}</p> */}
                {item.description && (
                  <p className="mt-2">{item.description}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button 
              className={`flex items-center gap-2 w-full sm:w-auto ${showEmail ? 'outline border-blue-600 text-blue-600 hover:text-blue' : 'bg-blue-600 hover:bg-blue-700'}`}
              variant={showEmail ? 'outline' : 'default'}
              onClick={handleViewContact}
            >
              <Mail className="h-4 w-4"/>
              {showEmail ? item.email : "View Contact"}
            </Button>
            <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto border-blue-600 text-blue-600 hover:text-blue-700" onClick={handleShare}>
              {isCopied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              {isCopied ? "Copied!" : "Share"}
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export { DetailedDialog };
