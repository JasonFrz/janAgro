import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Check,
  AlertCircle,
  X,
  ShoppingCart,
} from "lucide-react";
import {
  fetchCheckouts,
  updateCheckoutStatus,
} from "../features/admin/adminSlice"; // matches your earlier usage

// --- helpers ---
const formatPhoneNumber = (phone) => {
  if (!phone) return "-";
  const digits = phone.replace(/\D/g, "");
  let formatted = "+62 ";
  if (digits.length > 4) {
    formatted += `${digits.substring(0, 4)}-${digits.substring(
      4,
      8
    )}-${digits.substring(8)}`;
  } else {
    formatted += digits;
  }
  return formatted;
};

const StatusBadge = ({ status }) => {
  const statusStyles = {
    selesai: "bg-green-100 text-green-800",
    pengembalian: "bg-yellow-100 text-yellow-800",
    "pengembalian berhasil": "bg-teal-100 text-teal-800",
    "pengembalian ditolak": "bg-red-100 text-red-800",
    dikirim: "bg-blue-100 text-blue-800",
    diproses: "bg-gray-100 text-gray-800",
    sampai: "bg-indigo-100 text-indigo-800",
    "pembatalan diajukan": "bg-purple-100 text-purple-800",
    dibatalkan: "bg-gray-400 text-white",
  };
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${statusStyles[status] || "bg-gray-100 text-gray-800"
        }`}
    >
      {status}
    </span>
  );
};

// --- Status button component (uses dispatch) ---
const StatusButton = ({ orderId, currentStatus, targetStatus, label, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const isActive = currentStatus === targetStatus;

  const statusColorClasses = {
    diproses: "bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600",
    dikirim: "bg-blue-600 text-white border-blue-600 hover:bg-blue-700",
    sampai: "bg-green-600 text-white border-green-600 hover:bg-green-700",
  };
  const activeClasses =
    statusColorClasses[targetStatus] || "bg-black text-white border-black";
  const inactiveClasses = "bg-white text-gray-500 border border-gray-300 hover:border-black";

  const handleClick = async (e) => {
    e.stopPropagation();
    if (isActive || loading) return;
    setLoading(true);
    try {
      await onUpdate(orderId, targetStatus);
    } catch (err) {
      // parent handles failed dispatch rollback (if any)
      console.error("Status update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isActive || loading}
      className={`px-3 py-1 text-xs rounded-full transition ${isActive ? activeClasses : inactiveClasses}`}
    >
      {loading ? "Updating..." : label}
    </button>
  );
};

// --- Main component ---
const SettingAdmin = () => {
  const dispatch = useDispatch();
  const { checkouts = [], loading = false, error = null } = useSelector((state) => state.admin || {});

  // local optimistic copy for immediate UI feedback (syncs from redux)
  const [orders, setOrders] = useState(() => [...(checkouts || [])]);

  useEffect(() => {
    // fetch checkouts on mount
    dispatch(fetchCheckouts());
  }, [dispatch]);

  // sync local optimistic copy whenever redux checkouts change
  useEffect(() => {
    setOrders([...checkouts]);
  }, [checkouts]);

  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const sortedCheckouts = useMemo(() => {
    return [...orders].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  }, [orders]);

  const filteredCheckouts = useMemo(() => {
    return sortedCheckouts.filter((order) =>
      filterStatus === "all" ? true : order.status === filterStatus
    );
  }, [sortedCheckouts, filterStatus]);

  // derive returns & cancellations (if you have separate arrays in state later, pick them instead)
  const returns = useMemo(() => orders.filter((o) => o.status === "pengembalian"), [orders]);
  const cancellations = useMemo(() => orders.filter((o) => ["pembatalan diajukan", "dibatalkan"].includes(o.status)), [orders]);

  const toggleExpand = (orderId) =>
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);

  // wrapper to dispatch update and optimistically update UI
  const handleUpdateStatus = async (orderId, targetStatus) => {
    // keep copy to rollback if needed
    const prev = [...orders];
    setOrders((prevOrders) => prevOrders.map((o) => (o._id === orderId ? { ...o, status: targetStatus } : o)));
    try {
      // dispatch thunk (returns a promise)
      const res = await dispatch(updateCheckoutStatus({ id: orderId, status: targetStatus })).unwrap();
      // merging server updated object to local orders
      if (res && res._id) {
        setOrders((prevOrders) => prevOrders.map((o) => (o._id === res._id ? { ...o, ...res } : o)));
      }
    } catch (err) {
      // rollback on error
      console.error("Failed to update checkout status:", err);
      setOrders(prev);
      throw err;
    }
  };

  const handleApproveReturn = (orderId) => handleUpdateStatus(orderId, "pengembalian berhasil");
  const handleRejectReturn = (orderId) => handleUpdateStatus(orderId, "pengembalian ditolak");
  const handleApproveCancellation = (orderId) => handleUpdateStatus(orderId, "dibatalkan");
  const handleRejectCancellation = (orderId) => handleUpdateStatus(orderId, "diproses"); // or whatever your flow dictates

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Order Management</h2>
          <p className="text-gray-500">Manage and Update customer order status</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-gray-300 rounded-md py-2 px-3 text-black focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="all">All Status</option>
            <option value="diproses">Processed</option>
            <option value="pembatalan diajukan">Cancellation Submitted</option>
            <option value="dikirim">Sent</option>
            <option value="sampai">Arrived</option>
            <option value="pengembalian">Return Submitted</option>
            <option value="pengembalian berhasil">Return Accepted</option>
            <option value="pengembalian ditolak">Return Rejected</option>
            <option value="dibatalkan">Cancelled</option>
            <option value="selesai">Done</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {loading && (
          <div className="py-8 text-center">
            <p className="text-gray-500">Loading orders...</p>
          </div>
        )}

        {!loading && filteredCheckouts.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold text-black">Empty..</h3>
            <p className="text-gray-500 mt-2">No matching orders found..</p>
          </div>
        )}

        {!loading &&
          filteredCheckouts.map((order) => {
            const isOrderFinal = [
              "selesai",
              "pengembalian berhasil",
              "pengembalian ditolak",
              "dibatalkan",
            ].includes(order.status);

            // If return/cancel requests were stored separately in your system, merge logic here.
            const returnRequest = (order.returnRequest) || returns.find((r) => r.orderId === order._id);
            const cancelRequest = (order.cancelRequest) || cancellations.find((c) => c.orderId === order._id);

            return (
              <div key={order._id} className="border rounded-lg overflow-hidden">
                <div
                  className="bg-gray-50 p-4 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleExpand(order._id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex-1">
                    <p className="font-bold text-sm text-black">ORDER #{order._id}</p>
                    <p className="text-xs text-gray-500">
                      {order.tanggal
                        ? new Date(order.tanggal).toLocaleString("id-ID", {
                          dateStyle: "full",
                          timeStyle: "short",
                        })
                        : "-"}
                    </p>
                  </div>

                  <div className="flex-1 mt-2 md:mt-0">
                    <p className="text-sm font-medium text-black">{order.nama || "-"}</p>
                    <p className="text-xs text-gray-500">{formatPhoneNumber(order.noTelpPenerima)}</p>
                  </div>

                  <div className="flex-1 text-left md:text-right mt-2 md:mt-0">
                    <p className="text-sm font-semibold text-black">Rp {(order.totalHarga || 0).toLocaleString("id-ID")}</p>
                    <div className="mt-1">
                      <StatusBadge status={order.status} />
                    </div>
                  </div>

                  <div className="ml-4 flex-shrink-0">
                    {expandedOrderId === order._id ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
                  </div>
                </div>

                {expandedOrderId === order._id && (
                  <div className="p-6 bg-white border-t animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        {cancelRequest &&
                          ["pembatalan diajukan", "dibatalkan"].includes(order.status) && (
                            <div className="mb-6 p-4 bg-purple-50 border-l-4 border-purple-400">
                              <h4 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                                <ShoppingCart size={18} /> Cancellation Submission
                              </h4>
                              <div className="text-sm text-purple-700 space-y-3">
                                <div>
                                  <p className="font-semibold">Alasan:</p>
                                  <p className="whitespace-pre-wrap italic">"{cancelRequest.reason || cancelRequest.notes || "-"}"</p>
                                </div>
                              </div>
                              {order.status === "pembatalan diajukan" && (
                                <div className="mt-4 flex gap-3">
                                  <button
                                    onClick={() => handleRejectCancellation(order._id)}
                                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-600 text-white rounded-md text-sm font-semibold hover:bg-red-700"
                                  >
                                    <X size={16} /> Tolak
                                  </button>
                                  <button
                                    onClick={() => handleApproveCancellation(order._id)}
                                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-600 text-white rounded-md text-sm font-semibold hover:bg-green-700"
                                  >
                                    <Check size={16} /> Setujui
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                        {returnRequest && (
                          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
                            <h4 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                              <AlertCircle size={18} /> Return submission details
                            </h4>
                            <div className="text-sm text-yellow-700 space-y-3">
                              <div>
                                <p className="font-semibold">Reason:</p>
                                <p className="whitespace-pre-wrap italic">"{returnRequest.reason || returnRequest.notes || "-"}"</p>
                              </div>
                              <div>
                                <p className="font-semibold">Proof in-Video:</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {(returnRequest.videos || []).length > 0 ? (
                                    returnRequest.videos.map((v) => (
                                      <span key={v} className="text-2xl">📹</span>
                                    ))
                                  ) : (
                                    <span className="text-xs text-gray-500">No video proof</span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <p className="font-semibold">Photo Proof:</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {(returnRequest.photos || []).length > 0 ? (
                                    returnRequest.photos.map((p) => (
                                      <span key={p} className="text-2xl">📸</span>
                                    ))
                                  ) : (
                                    <span className="text-xs text-gray-500">No photo proof</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            {order.status === "pengembalian" && (
                              <div className="mt-4 flex gap-3">
                                <button
                                  onClick={() => handleRejectReturn(order._id)}
                                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-600 text-white rounded-md text-sm font-semibold hover:bg-red-700"
                                >
                                  <X size={16} /> Reject
                                </button>
                                <button
                                  onClick={() => handleApproveReturn(order._id)}
                                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-600 text-white rounded-md text-sm font-semibold hover:bg-green-700"
                                >
                                  <Check size={16} /> Accept
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        <h4 className="font-semibold mb-3">Items Ordered</h4>
                        <div className="space-y-3">
                          {(order.items || []).map((item) => (
                            <div key={item._id || item.id || Math.random()} className="flex justify-between items-center text-sm border-b pb-2">
                              <div>
                                <p className="font-medium text-black">{item.name}</p>
                                <p className="text-gray-500">Qty: {item.quantity}</p>
                              </div>
                              <p className="text-gray-700">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Order Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium">Rp {(order.subtotal || 0).toLocaleString("id-ID")}</span>
                          </div>
                          {order.diskon > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Diskon ({order.kodeVoucher || "-" }):</span>
                              <span className="font-medium">- Rp {order.diskon.toLocaleString("id-ID")}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Kurir:</span>
                            <span className="font-medium">Rp {(order.kurir?.biaya || 0).toLocaleString("id-ID")}</span>
                          </div>
                          <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                            <span>Total:</span>
                            <span>Rp {(order.totalHarga || 0).toLocaleString("id-ID")}</span>
                          </div>
                        </div>

                        {isOrderFinal ? (
                          <div className="mt-6 p-3 bg-gray-100 rounded-md text-center">
                            <p className="text-sm font-medium text-gray-700">Pesanan ini sudah final.</p>
                          </div>
                        ) : (
                          <>
                            {!["pengembalian", "pembatalan diajukan"].includes(order.status) && (
                              <>
                                <h4 className="font-semibold mb-3 mt-6">Update Status</h4>
                                <div className="flex gap-2">
                                  <StatusButton orderId={order._id} currentStatus={order.status} targetStatus="diproses" label="Processed" onUpdate={handleUpdateStatus} />
                                  <StatusButton orderId={order._id} currentStatus={order.status} targetStatus="dikirim" label="Sent" onUpdate={handleUpdateStatus} />
                                  <StatusButton orderId={order._id} currentStatus={order.status} targetStatus="sampai" label="Arrived" onUpdate={handleUpdateStatus} />
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="border-t mt-6 pt-4">
                      <h4 className="font-semibold mb-2">Shipping Details</h4>
                      <p className="text-sm text-black font-medium">{order.nama}</p>
                      <p className="text-sm text-gray-600">{formatPhoneNumber(order.noTelpPenerima)}</p>
                      <p className="text-sm text-gray-600 whitespace-pre-line">{order.alamat}</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Metode Pembayaran: <span className="font-medium text-black">{order.metodePembayaran}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SettingAdmin;
