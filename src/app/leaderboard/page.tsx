import Image from "next/image";
import Link from "next/link";
import UserListing from "./components/userListing";
import { getAllLeaderboard } from "@/server/data/leaderboard/queries";
import { User } from "lucide-react";

export default async function Leaderboard() {
  const leaderboard = await getAllLeaderboard();

  if ("data" in leaderboard) {
    // This is haardcoded to a speccific email for now, will change when sign-in is functional
    const userInfo = leaderboard.data.find(
      (user) => user.email === "ttsundue@uci.edu"
    );

    return (
      <div className="text-center min-h-screen space-y-8 bg-gray-700">
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
    return (
      <div className="text-center min-h-screen space-y-8 bg-gray-700">
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
}
