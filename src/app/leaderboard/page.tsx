import Image from "next/image";
import Link from "next/link";
import UserListing from "./components/userListing";
import { getAllLeaderboard } from "@/server/data/leaderboard/queries";
import { User } from "lucide-react";

interface Card {
  image: string;
  imageX: number;
  imageY: number;
  altText: string;
  title: string;
  amount: number;
}

export default async function Leaderboard() {
  const cards: Card[] = [
    {
      image: "/logos/locate_dark.svg",
      imageX: 80,
      imageY: 80,
      altText: "Post Item Icon",
      title: "Post a lost Item",
      amount: 1,
    },
    {
      image: "/logos/Wallet_found.png",
      imageX: 108,
      imageY: 108,
      altText: "Found Item Icon",
      title: "Find an item",
      amount: 3,
    },
    {
      image: "/logos/resolved.png",
      imageX: 108,
      imageY: 108,
      altText: "Resolve Found Icon",
      title: "Resolve a FOUND Item",
      amount: 5,
    },
    {
      image: "/logos/resolved.png",
      imageX: 108,
      imageY: 108,
      altText: "Resolve Lost Icon",
      title: "Resolve a LOST Item",
      amount: 2,
    },
  ];
  const leaderboard = await getAllLeaderboard();
  let leaderboardContent;

  if ("data" in leaderboard) {
    // This is haardcoded to a speccific email for now, will change when sign-in is
    const userInfo = leaderboard.data.find(
      (user) => user.email === "ttsundue@uci.edu"
    );

    leaderboardContent = (
      <div className="text-center bg-gray-700">
        <div className="mx-4 md:mx-32 py-8 space-y-8">
          <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-4xl font-bold text-white">Ranking 🏆</h1>
            <div className="mt-4 w-fit mx-auto p-2 bg-red-800 rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold text-white">
                You Have {userInfo?.points} Cookies 🍪
              </h1>
            </div>

            <div className="flex flex-col space-y-4 mt-8">
              {leaderboard.data.slice(0, 3).map((user, index) => (
                <UserListing
                  key={index}
                  email={user.email}
                  points={user.points}
                  rank={index + 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    leaderboardContent = (
      <div className="text-center bg-gray-700">
        <div className="mx-4 md:mx-32 py-8 space-y-8">
          <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-4xl font-bold text-white">
              Leaderboard Unavailable
            </h1>

            <div className="flex flex-col space-y-4 mt-8">
              <UserListing email={"No Data"} points={0} rank={0} />
              <UserListing email={"..."} points={0} rank={0} />
              <UserListing email={"..."} points={0} rank={0} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center min-h-screen space-y-8 bg-gray-700">
      {leaderboardContent}

      {/* Leaderboard "How To" Section */}

      <h1 className="text-4xl font-bold mb-4 space-y-2">
        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          How to Earn Cookies
        </span>
        🍪
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white text-black p-4 rounded-lg shadow-lg hover:shadow-x2 hover:scale-105 transition duration-150 flex flex-col items-center space-y-4"
          >
            <Image
              src={card.image}
              alt={card.altText}
              width={card.imageX}
              height={card.imageY}
              className="rounded-full mb-4"
            />
            <h1 className="text-xl">{card.title}</h1>
            <h1 className="text-xl bg-gray-200 rounded-lg p-1">
              +{card.amount} 🍪
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
}
