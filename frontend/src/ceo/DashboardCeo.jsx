import React, { useMemo } from "react";
import { Users, Package, Ticket, BarChart2, TrendingUp, TrendingDown, Clock } from "lucide-react";

function DashboardCeo({ users = [], vouchers = [], produk = [], checkouts = [] }) {
  const stats = useMemo(() => {
    const totalRevenue = checkouts
      .filter(o => o.status === 'selesai' || o.status === 'sampai')
      .reduce((sum, order) => sum + order.totalHarga, 0);

    const successfulOrders = checkouts.filter(o => o.status === 'selesai' || o.status === 'sampai').length;
    const pendingOrders = checkouts.filter(o => o.status === 'diproses' || o.status === 'dikirim').length;
    const lowStockProducts = produk.filter(p => p.stock > 0 && p.stock <= 10).length;

    return { totalRevenue, successfulOrders, pendingOrders, lowStockProducts };
  }, [checkouts, produk]);

  const StatCard = ({ icon, title, value, detail, trend }) => {
    const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
    const trendColor = trend === 'up' ? 'text-green-500' : 'text-red-500';

    return (
      <div className="bg-white border-2 border-black rounded-lg p-6 flex flex-col justify-between shadow-xl transform hover:scale-105 transition-transform duration-300">
        <div>
          <div className="flex justify-between items-start">
            <div className="bg-black text-white rounded-full p-3">
              {icon}
            </div>
            {trend && <TrendIcon className={`${trendColor} w-6 h-6`} />}
          </div>
          <p className="text-4xl font-extrabold mt-4">{value}</p>
          <p className="text-gray-600 font-semibold">{title}</p>
        </div>
        <p className="text-sm text-gray-500 mt-2">{detail}</p>
      </div>
    );
  };

  const recentActivities = useMemo(() => {
    const recentCheckouts = checkouts
      .slice()
      .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
      .slice(0, 5)
      .map(c => ({ ...c, type: 'order' }));
      
    // Placeholder for other activities if needed in future
    // For now, we only show recent orders
    return recentCheckouts;
  }, [checkouts]);


  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black">CEO Dashboard</h1>
        <p className="text-gray-600 text-lg">High-level overview of JanAgro's performance.</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<BarChart2 size={24} />} 
          title="Total Revenue" 
          value={`Rp ${stats.totalRevenue.toLocaleString('id-ID')}`} 
          detail="From all completed orders."
          trend="up"
        />
        <StatCard 
          icon={<Package size={24} />} 
          title="Successful Orders" 
          value={stats.successfulOrders} 
          detail={`${stats.pendingOrders} orders are pending.`}
          trend="up"
        />
        <StatCard 
          icon={<Users size={24} />} 
          title="Total Users" 
          value={users.length} 
          detail="Registered customer accounts."
        />
        <StatCard 
          icon={<Ticket size={24} />} 
          title="Low Stock Products" 
          value={stats.lowStockProducts} 
          detail="Items needing immediate restock."
          trend="down"
        />
      </div>

      {/* Recent Activities & Inventory Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border-2 border-black rounded-lg p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b-2 border-black">Recent Activities</h2>
          <ul className="divide-y-2 divide-gray-300">
            {recentActivities.length > 0 ? recentActivities.map(activity => (
              <li key={activity.id} className="flex items-center justify-between py-4">
                <div className="flex items-center">
                  <div className="bg-gray-100 border-2 border-black rounded-full p-3 mr-4">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="font-bold">New Order #{activity.id}</p>
                    <p className="text-sm text-gray-600">by {activity.nama} - Rp {activity.totalHarga.toLocaleString('id-ID')}</p>
                  </div>
                </div>
                <span className="font-mono text-sm text-gray-500">{new Date(activity.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
              </li>
            )) : <p className="text-gray-500 italic p-4">No recent activities.</p>}
          </ul>
        </div>

        <div className="bg-white border-2 border-black rounded-lg p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b-2 border-black">Inventory Status</h2>
          <ul className="divide-y-2 divide-gray-300">
            {produk.slice(0, 7).map(p => {
              const stockStatus = p.stock === 0 ? 'bg-red-500' : p.stock <= 10 ? 'bg-yellow-400' : 'bg-green-500';
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
  );
}

export default DashboardCeo;