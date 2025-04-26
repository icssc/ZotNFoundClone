import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function UpdateCard({ 
  emoji, 
  title, 
  description, 
  version, 
  date, 
  message, 
  sections,
  tag
}) {
  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
      {/* Top section */}
      <div className="bg-[#ebf8ff] p-8 text-center">
        <div className="text-3xl mb-2">{emoji}</div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-600 mt-2">{description}</p>
        <div className="my-2">
          <span className="bg-green-200 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
            {tag.toUpperCase()}
          </span>
        </div>
        <div className="flex justify-center items-center gap-2">
          <span className="text-gray-500 text-sm">{`Version ${version} • ${date}`}</span>
        </div>
      </div>

      {/* Content section */}
      <div className="p-6 space-y-6">
        {/* Message */}
        <blockquote className="border-l-4 border-blue-400 pl-4 text-gray-700 italic text-sm">
          {message.split("\n").map((line, idx) => (
            <p key={idx} className="mb-3 last:mb-0">{line}</p>
          ))}
        </blockquote>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-xl font-bold mb-2">{section.title}</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {section.items.map((item, i) => (
                  <li key={i}>
                    {item.link ? (
                      <a
                        href={item.link.href}
                        className="text-blue-600 underline cursor-pointer hover:text-blue-800 transition"
                      >
                        {item.link.text}
                      </a>
                    ) : (
                      item.text
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export default function UpdatesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Back Button */}
      <Button variant="ghost" size="icon" className="mb-4">
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <p className="text-3xl font-bold text-[#6972da]">ZotNFound Updates</p>
        <p className="text-gray-500 mt-2 text-lg">
          Keep track of the latest improvements and features
        </p>

        {/* Cards */}
        <div className="mt-8 space-y-12">
          {/* Update 1 */}
          <UpdateCard
            emoji="⚡"
            title="Performance & Search Update"
            description="Major improvements to search functionality and overall performance"
            version="1.1.0"
            date="March 19, 2024"
            tag="Feature"
            message={`Dear ZotNFound Community,\n\nWe’ve been listening closely to your feedback about search and performance. Many of you mentioned that finding specific items could be faster and more intuitive. Today, we’re excited to bring you a major update that addresses these concerns and more.\n\nWith gratitude,\nThe ZotNFound Team`}
            sections={[
              {
                title: "Search Enhancements 🎯",
                items: [
                  { text: "Added fuzzy matching to search" },
                  { text: "Instant results as you type" },
                  { text: "Better ranking for relevant results" },
                ],
              },
              {
                title: "Performance Boost 🚀",
                items: [
                  { text: "Enhanced map clustering for large numbers" },
                  { text: "Reduced initial load time by 50%" },
                  { text: "Optimized image loading" },
                ],
              },
              {
                title: "New Features 🎉",
                items: [
                  { text: "Smart filtering for categories" },
                  { text: "Advanced date range selection" },
                  { text: "Improved notifications" },
                ],
              },
            ]}
          />

          {/* Update 2 */}
          <UpdateCard
            emoji="🔧"
            title="Bug Fixes & Mobile Improvements"
            description="Critical fixes and mobile experience enhancement"
            version="1.0.1"
            date="March 9, 2024"
            tag="Fix"
            message={`Dear ZotNFound Community,\n\nThank you for all your bug reports and suggestions over the past few weeks. We know some of you experienced issues with the mobile version and email login - we hear you! This update focuses on fixing these pain points and making the mobile experience smoother for everyone. Your patience and feedback have been invaluable in helping us improve ZotNFound.\nBest wishes,\nThe ZotNFound Team`}
            sections={[
              {
                title: "Authentication Updates 🔐",
                items: [
                  { text: "Improved authentication flow and error handling" },
                  { text: "Corrected map zoom glitches" },
                  { text: "Added remember me functionality" },
                ],
              },
              {
                title: "Mobile Experience 📱",
                items: [
                  { text: "Improved mobile responsiveness across all pages" },
                  { text: "Better touch interactions for map" },
                  { text: "Enhanced mobile navigation" },
                ],
              },
              {
                title: "UI Improvements 🎨",
                items: [
                  { text: "Updated item marker icons for better visibility" },
                  { text: "New color scheme for better contrast" },
                  { text: "Improved accessibility features" },
                ],
              },
            ]}
          />


          {/* Update 3 */}
          <UpdateCard
            emoji="🎉"
            title="Initial Release"
            description="Launching ZotNFound to the UCI community"
            version="1.0.0"
            date="February 29, 2024"
            tag="Release"
            message={`Dear UCI Community,\n\nWe're thrilled to officially launch ZotNFound! This project started from a simple Instagram page where we helped connect lost items with their owners, and now it's grown into a full-fledged platform for our UCI community. We built this with love and care, thinking about how we could make the process of finding lost items as simple and stress-free as possible.\nWe're excited to start this journey with you and can't wait to hear your thoughts and suggestions. Remember, ZotNFound is more than just a lost and found platform - it's a community initiative built by Anteaters, for Anteaters.\nZot Zot Zot!\nThe ZotNFound Team`}
            sections={[
              {
                title: "Platform Launch 🚀",
                items: [
                  { text: "Initial release of ZotNFound platform" },
                  { text: "Complete end-to-end lost and found system" },
                  { text: "Integrated UCI authentication" },
                ],
              },
              {
                title: "Core Features 💫",
                items: [
                  { text: "Lost and found item posting with image support" },
                  { text: "Secure UCI email authentication system" },
                  { text: "Interactive campus map with real-time updates" },
                ],
              },
              {
                title: "Community Features 🤝",
                items: [
                  { text: "Direct messaging between users" },
                  { text: "Item status tracking" },
                  { text: "Community guidelines and safety features" },
                ],
              },
            ]}
          />


        </div>
      </div>
    </div>
  );
}
