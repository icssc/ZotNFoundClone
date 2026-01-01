const stats = [
  { color: "text-red-400", label: "Lost Items", value: 88 },
  { color: "text-green-400", label: "Found Items", value: 32 },
  { color: "text-yellow-400", label: "Successful Items", value: 16 },
  { color: "text-purple-400", label: "Active Users", value: 705 },
];

export default function StatisticsCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      {stats.map((s, i) => (
        <div
          key={i} //using index as a key since this is a static list
          className="px-10 py-8 rounded-md shadow-lg transition-transform duration-300 hover:scale-105 bg-white text-center"
        >
          <p className={`${s.color} font-bold text-3xl`}>{s.value}</p>
          <p className="text-sm">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
