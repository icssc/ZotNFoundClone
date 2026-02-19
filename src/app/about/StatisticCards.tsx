const stats = [
  {
    color: "text-red-400",
    label: "Lost Items",
    value: 88,
    hue: "hover:shadow-red-500/10",
  },
  {
    color: "text-green-400",
    label: "Found Items",
    value: 32,
    hue: "hover:shadow-green-500/10",
  },
  {
    color: "text-yellow-400",
    label: "Successful Items",
    value: 16,
    hue: "hover:shadow-yellow-500/10",
  },
  {
    color: "text-purple-400",
    label: "Total Users",
    value: 705,
    hue: "hover:shadow-purple-500/10",
  },
];

export default function StatisticsCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`px-10 py-8 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 ${stat.hue} bg-white/5 border border-white/10 backdrop-blur-sm text-center group`}
        >
          <p
            className={`${stat.color} font-bold text-3xl mb-2 group-hover:scale-110 transition-transform duration-300`}
          >
            {stat.value}
          </p>
          <p className="text-sm text-gray-400 group-hover:text-white transition-colors duration-300">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
