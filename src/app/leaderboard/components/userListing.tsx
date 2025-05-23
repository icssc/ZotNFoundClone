import Image from "next/image";

type UserListingProps = {
  email: string;
  points: number | null;
  rank: number;
};

export default function UserListing({ email, points, rank }: UserListingProps) {
  return (
    <div
      className={
        rank === 1
          ? "flex justify-between items-center bg-indigo-500 p-4 rounded-lg shadow-lg text-lg font-semibold text-white hover:shadow-xl hover:bg-indigo-600 hover:scale-105 transition duration-200"
          : "flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-lg text-lg font-semibold text-black-500 hover:shadow-xl hover:bg-gray-200 hover:scale-105 transition duration-200"
      }
    >
      <div className="flex items-center">
        <Image
          src="/logos/userLogo.svg"
          alt="User Avatar"
          width={50}
          height={50}
          className="rounded-full mr-4"
        />
        <h2>{email}</h2>
      </div>
      {rank === 1 ? (
        <div className="flex flex-row items-center space-x-2">
          <h1 className="text-2xl font-bold text-yellow-500">{points}</h1>
          <Image
            src="/logos/gold-medal.png"
            alt="Gold Medal"
            width={50}
            height={50}
            className="rounded-full"
          ></Image>
        </div>
      ) : rank === 2 ? (
        <div className="flex flex-row items-center space-x-2">
          <h1 className="text-2xl font-bold text-black-500">{points}</h1>
          <Image
            src="/logos/silver-medal.png"
            alt="Silver Medal"
            width={50}
            height={50}
            className="rounded-full"
          ></Image>
        </div>
      ) : rank === 3 ? (
        <div className="flex flex-row items-center space-x-2">
          <h1 className="text-2xl font-bold text-black-500">{points}</h1>
          <Image
            src="/logos/bronze-medal.png"
            alt="Bronze Medal"
            width={50}
            height={50}
            className="rounded-full"
          ></Image>
        </div>
      ) : (
        <span className="text-2xl font-bold text-black-500">{points} 🍪</span>
      )}
    </div>
  );
}
