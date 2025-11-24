import React, { useState, useMemo, useEffect } from "react";
import { Check, X, Search, ChevronDown, FileText } from "lucide-react"; // Tambahkan FileText
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Tambahkan useNavigate
import {
  updateCheckoutStatus,
  setCheckouts,
} from "../features/admin/adminSlice";

// --- Helper Components ---

const StatusBadge = ({ status }) => {
  const statusStyles = {
    pending: "bg-gray-200 text-gray-800 border-gray-800",
    diproses: "bg-blue-100 text-blue-800 border-blue-800",
    dikirim: "bg-yellow-100 text-yellow-800 border-yellow-800",
    sampai: "bg-green-100 text-green-800 border-green-800",
    selesai: "bg-green-200 text-green-900 border-green-900",
    "pembatalan diajukan": "bg-orange-100 text-orange-800 border-orange-800",
    dibatalkan: "bg-gray-300 text-gray-900 border-gray-900",
    "pengembalian diajukan": "bg-purple-100 text-purple-800 border-purple-800",
    "pengembalian berhasil": "bg-purple-200 text-purple-900 border-purple-900",
    "pengembalian ditolak": "bg-red-100 text-red-800 border-red-800",
  };
  const style =
    statusStyles[status] || "bg-gray-100 text-gray-800 border-gray-800";
  return (
    <span
      className={`px-3 py-1 text-xs rounded-md font-bold border-2 ${style}`}
    >
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </span>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const StatusButton = ({
  orderId,
  currentStatus,
  targetStatus,
  label,
  onChange,
}) => {
  const [loading, setLoading] = useState(false);
  const isActive = currentStatus === targetStatus;

  const statusColorClasses = {
    diproses: "bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600",
    dikirim: "bg-blue-600 text-white border-blue-600 hover:bg-blue-700",
    sampai: "bg-green-600 text-white border-green-600 hover:bg-green-700",
    selesai: "bg-green-700 text-white border-green-700 hover:bg-green-800",
  };
  const activeClasses =
    statusColorClasses[targetStatus] || "bg-black text-white border-black";
  const inactiveClasses =
    "bg-white text-gray-500 border-gray-300 hover:border-black";

  const handleClick = async (e) => {
    e && e.stopPropagation();
    if (isActive || loading) return;
    if (typeof onChange !== "function") {
      console.warn("StatusButton: onChange handler not provided");
      return;
    }

    setLoading(true);
    try {
      await onChange(orderId, targetStatus);
    } catch (err) {
      console.error("Status change failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isActive || loading}
      className={`w-full px-3 py-2 text-sm rounded-sm border transition ${
        isActive ? activeClasses : inactiveClasses
      }`}
    >
      {loading ? "Updating..." : label}
    </button>
  );
};

// --- Main Component ---

function PesananCeo({
  checkouts,
  onUpdateOrderStatus,
  onApproveReturn,
  onRejectReturn,
  onApproveCancellation,
  onRejectCancellation,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook navigasi
  const adminCheckouts = useSelector((state) => state.admin?.checkouts || []);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);

  const orders = adminCheckouts.length ? adminCheckouts : checkouts || [];

  useEffect(() => {
    if (
      (!adminCheckouts || adminCheckouts.length === 0) &&
      checkouts &&
      checkouts.length > 0
    ) {
      dispatch(setCheckouts(checkouts));
    }
  }, [adminCheckouts, checkouts, dispatch]);

  const pendingReturns = useMemo(
    () => orders.filter((o) => o.status === "pengembalian diajukan"),
    [orders]
  );
  const pendingCancellations = useMemo(
    () => orders.filter((o) => o.status === "pembatalan diajukan"),
    [orders]
  );

  const filteredCheckouts = useMemo(
    () =>
      orders.filter(
        (order) =>
          (order.nama &&
            order.nama.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (order._id &&
            order._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (order.status &&
            order.status.toLowerCase().includes(searchTerm.toLowerCase()))
      ),
    [orders, searchTerm]
  );

  const handleDropdownToggle = (e, order) => {
    e.stopPropagation();
    if (activeDropdown && activeDropdown.order._id === order._id) {
      setActiveDropdown(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setActiveDropdown({
        order,
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX - 100,
      });
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setActiveDropdown(null);
    const prev = orders.slice();

    const optimistic = orders.map((o) =>
      o._id === orderId ? { ...o, status: newStatus } : o
    );
    dispatch(setCheckouts(optimistic));

    try {
      await dispatch(
        updateCheckoutStatus({ id: orderId, status: newStatus })
      ).unwrap();
      if (typeof onUpdateOrderStatus === "function")
        onUpdateOrderStatus(orderId, newStatus);
    } catch (err) {
      dispatch(setCheckouts(prev));
      console.error("Failed to update status:", err);
    }
  };

  const ActionCard = ({ title, count, children }) => (
    <div className="bg-white p-6 rounded-lg border-2 border-black shadow-lg">
      <h3 className="font-bold text-xl mb-4 pb-2 border-b-2 border-black flex justify-between items-center">
        <span>{title}</span>
        <span className="font-mono bg-black text-white rounded-full px-2.5 py-1 text-sm">
          {count}
        </span>
      </h3>
      <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
        {count > 0 ? (
          children
        ) : (
          <p className="text-gray-500 italic py-4">No pending requests.</p>
        )}
      </div>
    </div>
  );

  const RequestItem = ({ order, onApprove, onReject }) => (
    <div className="p-3 border-b-2 border-gray-300 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-bold text-black">
            Order #{order._id.substring(0, 8)}
          </p>
          <p className="text-sm text-gray-600">{order.nama}</p>
        </div>
        <p className="text-sm font-mono">{formatDate(order.createdAt)}</p>
      </div>
      <div className="mt-2 flex space-x-2">
        <button
          onClick={() => onApprove(order._id)}
          className="flex-1 bg-green-600 text-white px-3 py-1.5 text-sm rounded font-bold hover:bg-green-700 flex items-center justify-center space-x-1"
        >
          <Check size={16} /> <span>Approve</span>
        </button>
        <button
          onClick={() => onReject(order._id)}
          className="flex-1 bg-red-600 text-white px-3 py-1.5 text-sm rounded font-bold hover:bg-red-700 flex items-center justify-center space-x-1"
        >
          <X size={16} /> <span>Reject</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-black">Order & Request Management</h2>

        <button
          onClick={() => navigate("/laporan-order-ceo")}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition shadow-md font-bold"
        >
          <FileText size={20} />
          <span>Laporan Pesanan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ActionCard title="Return Requests" count={pendingReturns.length}>
          {pendingReturns.map((order) => (
            <RequestItem
              key={order._id}
              order={order}
              onApprove={onApproveReturn}
              onReject={onRejectReturn}
            />
          ))}
        </ActionCard>
        <ActionCard
          title="Cancellation Requests"
          count={pendingCancellations.length}
        >
          {pendingCancellations.map((order) => (
            <RequestItem
              key={order._id}
              order={order}
              onApprove={onApproveCancellation}
              onReject={onRejectCancellation}
            />
          ))}
        </ActionCard>
      </div>

      <div className="bg-white text-black shadow-lg rounded-lg p-6 border-2 border-black">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b-2 border-black">
          <h2 className="text-2xl font-bold mb-4 sm:mb-0">
            Comprehensive Order Log
          </h2>
          <div className="relative w-full sm:w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by ID, name, status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-black rounded-md focus:ring-2 focus:ring-black"
            />
          </div>
        </div>
        <div className="overflow-x-auto max-h-[32rem] overflow-y-auto border-2 border-black rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-3 border-2 border-black text-left font-bold">
                  Order ID
                </th>
                <th className="p-3 border-2 border-black text-left font-bold">
                  Customer
                </th>
                <th className="p-3 border-2 border-black text-left font-bold">
                  Date
                </th>
                <th className="p-3 border-2 border-black text-left font-bold">
                  Total
                </th>
                <th className="p-3 border-2 border-black text-center font-bold">
                  Status
                </th>
                <th className="p-3 border-2 border-black text-center font-bold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCheckouts.length > 0 ? (
                filteredCheckouts.map((order) => (
                  <tr key={order._id} className="border-b-2 border-gray-300">
                    <td className="p-3 border-x-2 border-black font-mono font-bold">
                      #{order._id.substring(0, 8)}
                    </td>
                    <td className="p-3 border-x-2 border-black">
                      {order.nama}
                    </td>
                    <td className="p-3 border-x-2 border-black">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="p-3 border-x-2 border-black">
                      Rp {order.totalHarga.toLocaleString("id-ID")}
                    </td>
                    <td className="p-3 border-x-2 border-black text-center">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-3 border-x-2 border-black text-center relative">
                      <button
                        onClick={(e) => handleDropdownToggle(e, order)}
                        className="bg-black text-white px-3 py-1.5 rounded font-bold flex items-center hover:bg-gray-800 mx-auto"
                      >
                        Update Status <ChevronDown size={16} className="ml-1" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="p-10 text-center text-gray-500 italic"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {activeDropdown && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setActiveDropdown(null)}
          ></div>

          <div
            style={{
              position: "absolute",
              top: `${activeDropdown.top + 2}px`,
              left: `${activeDropdown.left}px`,
            }}
            className="w-48 bg-white border-2 border-black rounded-md shadow-2xl z-30 p-2 space-y-2"
          >
            {(() => {
              const current =
                orders.find((o) => o._id === activeDropdown.order._id)
                  ?.status || activeDropdown.order.status;
              return (
                <>
                  <StatusButton
                    orderId={activeDropdown.order._id}
                    currentStatus={current}
                    targetStatus="diproses"
                    label="Diproses"
                    onChange={handleStatusChange}
                  />
                  <StatusButton
                    orderId={activeDropdown.order._id}
                    currentStatus={current}
                    targetStatus="dikirim"
                    label="Dikirim"
                    onChange={handleStatusChange}
                  />
                  <StatusButton
                    orderId={activeDropdown.order._id}
                    currentStatus={current}
                    targetStatus="sampai"
                    label="Sampai"
                    onChange={handleStatusChange}
                  />
                  <StatusButton
                    orderId={activeDropdown.order._id}
                    currentStatus={current}
                    targetStatus="selesai"
                    label="Selesai"
                    onChange={handleStatusChange}
                  />
                </>
              );
            })()}
          </div>
        </>
      )}
    </div>
  );
}

export default PesananCeo;
