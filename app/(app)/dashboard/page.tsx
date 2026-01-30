export default function DashboardPage() {
  return (
    <>
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-white/50 text-sm mt-1">
          Overview of your farm operations
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Crops" value="124" trend="+8%" />
        <StatCard title="Active Fields" value="18" trend="+2%" />
        <StatCard title="Inventory Items" value="2,340" trend="-1%" />
        <StatCard title="Monthly Yield" value="32.5t" trend="+12%" />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
          <ul className="space-y-4 text-sm text-white/70">
            <li>🌱 New crop batch added</li>
            <li>📦 Inventory updated</li>
            <li>👷 Worker reassigned</li>
            <li>📈 Yield report generated</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-green-500/10 to-emerald-500/5 backdrop-blur-xl p-6">
          <h2 className="text-lg font-medium mb-4">Today’s Summary</h2>
          <p className="text-sm text-white/70">
            All systems are running smoothly.
          </p>
        </div>
      </section>
    </>
  );
}

function StatCard({ title, value, trend }: any) {
  const positive = trend.startsWith("+");
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
      <p className="text-sm text-white/50">{title}</p>
      <div className="mt-2 flex items-end justify-between">
        <span className="text-3xl font-semibold">{value}</span>
        <span
          className={`text-xs font-medium ${
            positive ? "text-green-400" : "text-red-400"
          }`}
        >
          {trend}
        </span>
      </div>
    </div>
  );
}
