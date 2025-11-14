import React, { useMemo, useState } from "react";
import {
  Users,
  Package,
  Ticket,
  BarChart2,
  TrendingUp,
  TrendingDown,
  Clock,
} from "lucide-react";

function DashboardCeo({
  users = [],
  vouchers = [],
  produk = [],
  checkouts = [],
}) {
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSortToggle = () => {
    setSortDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc"
    );
  };

  const stats = useMemo(() => {
    const totalRevenue = checkouts
      .filter((o) => o.status === "selesai" || o.status === "sampai")
      .reduce((sum, order) => sum + order.totalHarga, 0);
    const successfulOrders = checkouts.filter(
      (o) => o.status === "selesai" || o.status === "sampai"
    ).length;
    const pendingOrders = checkouts.filter(
      (o) => o.status === "diproses" || o.status === "dikirim" || o.status === "pending" // Tambahkan 'pending'
    ).length;
    const lowStockProducts = produk.filter(
      (p) => p.stock > 0 && p.stock <= 10
    ).length;
    return { totalRevenue, successfulOrders, pendingOrders, lowStockProducts };
  }, [checkouts, produk]);

  const sortedProducts = useMemo(() => {
    return [...produk].sort((a, b) => {
      if (sortDirection === "asc") return a.stock - b.stock;
      return b.stock - a.stock;
    });
  }, [produk, sortDirection]);

  const StatCard = ({ icon, title, value, detail, trend }) => {
    const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
    const trendColor = trend === "up" ? "text-green-500" : "text-red-500";
    return (
      <div className="bg-white border-2 border-black rounded-lg p-6 flex flex-col justify-between shadow-xl transform hover:scale-105 transition-transform duration-300">
        <div>
          <div className="flex justify-between items-start">
            <div className="bg-black text-white rounded-full p-3">{icon}</div>
            {trend && <TrendIcon className={`${trendColor} w-6 h-6`} />}
          </div>
          <p className="text-4xl font-extrabold mt-4">{value}</p>
          <p className="text-gray-600 font-semibold">{title}</p>
        </div>
        <p className="text-sm text-gray-500 mt-2">{detail}</p>
      </div>
    );
  };

  // --- PERBAIKAN DI SINI ---
  const recentActivities = useMemo(() => {
    return checkouts
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Gunakan createdAt
      .slice(0, 5)
      .map((c) => ({ ...c, type: "order" }));
  }, [checkouts]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black">CEO Dashboard</h1>
        <p className="text-gray-600 text-lg">High-level overview of JanAgro's performance.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<BarChart2 size={24} />} title="Total Revenue" value={`Rp ${stats.totalRevenue.toLocaleString("id-ID")}`} detail="From all completed orders." trend="up" />
        <StatCard icon={<Package size={24} />} title="Successful Orders" value={stats.successfulOrders} detail={`${stats.pendingOrders} orders are pending.`} trend="up" />
        <StatCard icon={<Users size={24} />} title="Total Users" value={users.length} detail="Registered customer accounts." />
        <StatCard icon={<Ticket size={24} />} title="Low Stock Products" value={stats.lowStockProducts} detail="Items needing immediate restock." trend="down" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border-2 border-black rounded-lg p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b-2 border-black">Recent Activities</h2>
          <div className="max-h-96 overflow-y-auto pr-2">
            <ul className="divide-y-2 divide-gray-300">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <li key={activity._id} className="flex items-center justify-between py-4"> {/* Gunakan _id */}
                    <div className="flex items-center">
                      <div className="bg-gray-100 border-2 border-black rounded-full p-3 mr-4"><Clock size={20} /></div>
                      <div>
                        <p className="font-bold">New Order #{activity._id.substring(0, 8)}</p> {/* Gunakan _id */}
                        <p className="text-sm text-gray-600">by {activity.nama} - Rp {activity.totalHarga.toLocaleString("id-ID")}</p>
                      </div>
                    </div>
                    <span className="font-mono text-sm text-gray-500">
                      {new Date(activity.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} {/* Gunakan createdAt */}
                    </span>
                  </li>
                ))
              ) : ( <p className="text-gray-500 italic p-4">No recent activities.</p> )}
            </ul>
          </div>
        </div>
        <div className="bg-white border-2 border-black rounded-lg p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-black">
            <h2 className="text-xl font-bold">Inventory Status</h2>
            <button onClick={handleSortToggle} title={sortDirection === "asc" ? "Sort Descending" : "Sort Ascending"} className="p-1 rounded hover:bg-gray-200 transition-colors">
              <img src={sortDirection === "asc" ? "/icon/down.png" : "/icon/up.png"} alt="Toggle Sort" className="w-5 h-5" />
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto pr-2">
            <ul className="divide-y-2 divide-gray-300">
              {sortedProducts.map((p) => {
                const stockStatus = p.stock === 0 ? "bg-red-500" : p.stock <= 10 ? "bg-yellow-400" : "bg-green-500";
                return (
                  <li key={p._id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-sm text-gray-500">{p.category}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-lg">{p.stock}</span>
                      <div className={`w-3 h-3 rounded-full ${stockStatus}`}></div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCeo;