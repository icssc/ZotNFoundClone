"use client";
import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";

function DetailedDialog({ item }: { item: Item }) {
  const islostObject = isLostObject(item);

  // Local contact form state
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<null | "sending" | "ok" | "error">(null);
  const [message, setMessage] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setEmail("");
    setShowForm(false);
    setStatus(null);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setMessage("Please provide name and email.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setMessage(null);

    try {
      const payload = {
        item: {
          id: item.id,
          name: item.name,
          type: item.type,
          email: item.email,
          image: item.image,
        },
        finderName: name.trim(),
        finderEmail: email.trim(),
      };

      const res = await fetch("/api/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok) {
        setStatus("ok");
        setMessage("Contact sent. The owner has been notified.");
        // keep the form visible briefly so user sees confirmation
        setTimeout(resetForm, 2000);
      } else {
        setStatus("error");
        setMessage(json?.error ?? "Failed to send contact.");
      }
    } catch (err) {
      console.error("contact send error:", err);
      setStatus("error");
      setMessage("Failed to send contact.");
    }
  };

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

        {showForm && (
          <form className="space-y-3 pt-2" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium block mb-1">
                Your name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                type="text"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">
                Your email
              </label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.edu"
                type="email"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="submit"
                variant="default"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending..." : "Send Contact"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowForm(false);
                  setMessage(null);
                }}
              >
                Cancel
              </Button>
            </div>

            {message && (
              <p
                className={`text-sm ${status === "error" ? "text-red-500" : "text-green-600"}`}
              >
                {message}
              </p>
            )}
          </form>
        )}
      </div>

      <div className="flex justify-end gap-2">
        {!showForm ? (
          <Button
            variant="outline"
            onClick={() => {
              setShowForm(true);
              setMessage(null);
            }}
          >
            Contact
          </Button>
        ) : null}
      </div>
    </DialogContent>
  );
}

export { DetailedDialog };
