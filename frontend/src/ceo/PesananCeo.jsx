import React, { useState, useMemo } from "react";
import { Check, X, ArrowRight, Search, ChevronDown } from "lucide-react";

// Komponen untuk badge status yang konsisten
const StatusBadge = ({ status }) => {
  const statusStyles = {
    diproses: "bg-blue-100 text-blue-800 border-blue-800",
    dikirim: "bg-yellow-100 text-yellow-800 border-yellow-800",
    sampai: "bg-green-100 text-green-800 border-green-800",
    selesai: "bg-green-200 text-green-900 border-green-900",
    "pembatalan diajukan": "bg-orange-100 text-orange-800 border-orange-800",
    dibatalkan: "bg-gray-200 text-gray-800 border-gray-800",
    "pengembalian": "bg-purple-100 text-purple-800 border-purple-800",
    "pengembalian berhasil": "bg-purple-200 text-purple-900 border-purple-900",
    "pengembalian ditolak": "bg-red-100 text-red-800 border-red-800",
  };
  const style = statusStyles[status] || "bg-gray-100 text-gray-800 border-gray-800";
  return (
    <span className={`px-3 py-1 text-xs rounded-md font-bold border-2 ${style}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};


function PesananCeo({
  checkouts,
  onUpdateOrderStatus,
  onApproveReturn,
  onRejectReturn,
  onApproveCancellation,
  onRejectCancellation,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);

  const pendingReturns = useMemo(
    () => checkouts.filter((o) => o.status === "pengembalian"),
    [checkouts]
  );
  const pendingCancellations = useMemo(
    () => checkouts.filter((o) => o.status === "pembatalan diajukan"),
    [checkouts]
  );
  
  const filteredCheckouts = useMemo(
    () => checkouts.filter(order =>
        order.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(order.id).includes(searchTerm) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [checkouts, searchTerm]
  );
  
  const handleStatusChange = (orderId, newStatus) => {
    onUpdateOrderStatus(orderId, newStatus);
    setOpenDropdown(null);
  };

  const ActionCard = ({ title, count, children }) => (
    <div className="bg-white p-6 rounded-lg border-2 border-black shadow-lg">
      <h3 className="font-bold text-xl mb-4 pb-2 border-b-2 border-black flex justify-between items-center">
        <span>{title}</span>
        <span className="font-mono bg-black text-white rounded-full px-2.5 py-1 text-sm">{count}</span>
      </h3>
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {count > 0 ? children : <p className="text-gray-500 italic py-4">No pending requests.</p>}
      </div>
    </div>
  );

  const RequestItem = ({ order, onApprove, onReject }) => (
    <div className="p-3 border-b-2 border-gray-300 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-bold text-black">Order #{order.id}</p>
          <p className="text-sm text-gray-600">{order.nama}</p>
        </div>
        <p className="text-sm font-mono">{new Date(order.tanggal).toLocaleDateString()}</p>
      </div>
      <div className="mt-2 flex space-x-2">
        <button onClick={() => onApprove(order.id)} className="flex-1 bg-green-600 text-white px-3 py-1.5 text-sm rounded font-bold hover:bg-green-700 flex items-center justify-center space-x-1">
          <Check size={16}/><span>Approve</span>
        </button>
        <button onClick={() => onReject(order.id)} className="flex-1 bg-red-600 text-white px-3 py-1.5 text-sm rounded font-bold hover:bg-red-700 flex items-center justify-center space-x-1">
          <X size={16}/><span>Reject</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black">Order & Request Management</h2>

      {/* Action Required Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ActionCard title="Return Requests" count={pendingReturns.length}>
          {pendingReturns.map(order => (
            <RequestItem key={order.id} order={order} onApprove={onApproveReturn} onReject={onRejectReturn} />
          ))}
        </ActionCard>
        <ActionCard title="Cancellation Requests" count={pendingCancellations.length}>
          {pendingCancellations.map(order => (
            <RequestItem key={order.id} order={order} onApprove={onApproveCancellation} onReject={onRejectCancellation} />
          ))}
        </ActionCard>
      </div>

      {/* All Orders Table Section */}
      <div className="bg-white text-black shadow-lg rounded-lg p-6 border-2 border-black">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b-2 border-black">
          <h2 className="text-2xl font-bold mb-4 sm:mb-0">Comprehensive Order Log</h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20}/>
            <input 
              type="text"
              placeholder="Search by ID, name, status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-black rounded-md focus:ring-2 focus:ring-black"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border-2 border-black text-left font-bold">Order ID</th>
                <th className="p-3 border-2 border-black text-left font-bold">Customer</th>
                <th className="p-3 border-2 border-black text-left font-bold">Date</th>
                <th className="p-3 border-2 border-black text-left font-bold">Total</th>
                <th className="p-3 border-2 border-black text-center font-bold">Status</th>
                <th className="p-3 border-2 border-black text-center font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCheckouts.length > 0 ? filteredCheckouts.map((order) => (
                <tr key={order.id} className="border-b-2 border-gray-300">
                  <td className="p-3 border-x-2 border-black font-mono font-bold">#{order.id}</td>
                  <td className="p-3 border-x-2 border-black">{order.nama}</td>
                  <td className="p-3 border-x-2 border-black">{new Date(order.tanggal).toLocaleDateString("id-ID")}</td>
                  <td className="p-3 border-x-2 border-black">Rp {order.totalHarga.toLocaleString("id-ID")}</td>
                  <td className="p-3 border-x-2 border-black text-center"><StatusBadge status={order.status}/></td>
                  <td className="p-3 border-x-2 border-black text-center">
                    <div className="relative inline-block">
                      <button 
                        onClick={() => setOpenDropdown(openDropdown === order.id ? null : order.id)}
                        className="bg-black text-white px-3 py-1.5 rounded font-bold flex items-center hover:bg-gray-800"
                      >
                        Update Status <ChevronDown size={16} className="ml-1"/>
                      </button>
                      {openDropdown === order.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-black rounded-md shadow-2xl z-10">
                          <a onClick={() => handleStatusChange(order.id, 'diproses')} className="block px-4 py-2 text-sm text-black hover:bg-gray-100 cursor-pointer">Diproses</a>
                          <a onClick={() => handleStatusChange(order.id, 'dikirim')} className="block px-4 py-2 text-sm text-black hover:bg-gray-100 cursor-pointer">Dikirim</a>
                          <a onClick={() => handleStatusChange(order.id, 'sampai')} className="block px-4 py-2 text-sm text-black hover:bg-gray-100 cursor-pointer">Sampai</a>
                          <a onClick={() => handleStatusChange(order.id, 'selesai')} className="block px-4 py-2 text-sm text-black hover:bg-gray-100 cursor-pointer">Selesai</a>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="p-10 text-center text-gray-500 italic">No orders found matching your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PesananCeo;