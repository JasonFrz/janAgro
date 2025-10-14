import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Check,
  AlertCircle,
  X,
} from "lucide-react";

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

const SettingAdmin = ({
  checkouts = [],
  returns = [],
  onUpdateStatus,
  onApproveReturn,
  onRejectReturn,
  setPage,
}) => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  // <-- PERUBAHAN: State untuk menyimpan status filter -->
  const [filterStatus, setFilterStatus] = useState("all");

  const sortedCheckouts = [...checkouts].sort(
    (a, b) => new Date(b.tanggal) - new Date(a.tanggal)
  );

  // <-- PERUBAHAN: Logika untuk memfilter pesanan berdasarkan state filterStatus -->
  const filteredCheckouts = sortedCheckouts.filter((order) => {
    if (filterStatus === "all") {
      return true; // Tampilkan semua jika filter 'all'
    }
    return order.status === filterStatus;
  });

  const toggleExpand = (orderId) =>
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);

  const StatusButton = ({ orderId, currentStatus, targetStatus, label }) => {
    const isActive = currentStatus === targetStatus;
    return (
      <button
        onClick={() => onUpdateStatus(orderId, targetStatus)}
        disabled={isActive}
        className={`px-3 py-1 text-xs rounded-full border transition ${
          isActive
            ? "bg-black text-white border-black"
            : "bg-white text-gray-500 border-gray-300 hover:border-black"
        }`}
      >
        {label}
      </button>
    );
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
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
          statusStyles[status] || "bg-gray-100"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Order Management</h2>
          <p className="text-gray-500">
            Kelola dan perbarui status pesanan pelanggan.
          </p>
        </div>
        {/* <-- PERUBAHAN: Container untuk filter dropdown dan tombol laporan --> */}
        <div className="flex items-center gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-gray-300 rounded-md py-2 px-3 text-black focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="all">Semua Status</option>
            <option value="diproses">Diproses</option>
            <option value="dikirim">Dikirim</option>
            <option value="sampai">Sampai</option>
            <option value="pengembalian">Pengajuan Pengembalian</option>
            <option value="pengembalian berhasil">Pengembalian Berhasil</option>
            <option value="pengembalian ditolak">Pengembalian Ditolak</option>
            <option value="selesai">Selesai</option>
          </select>
          <button
            onClick={() => setPage({ name: "laporan", id: null })}
            className="bg-black text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-800 transition-colors duration-200 flex-shrink-0"
          >
            <FileText className="mr-2 h-5 w-5" />
            Laporan
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {/* <-- PERUBAHAN: Gunakan `filteredCheckouts` untuk me-render daftar --> */}
        {filteredCheckouts.length > 0 ? (
          filteredCheckouts.map((order) => {
            const isOrderFinal = [
              "selesai",
              "pengembalian berhasil",
              "pengembalian ditolak",
            ].includes(order.status);
            const returnRequest = returns.find((r) => r.orderId === order.id);

            return (
              <div key={order.id} className="border rounded-lg overflow-hidden">
                <div
                  className="bg-gray-50 p-4 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleExpand(order.id)}
                >
                  <div className="flex-1">
                    <p className="font-bold text-sm text-black">
                      ORDER #{order.id}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.tanggal).toLocaleString("id-ID", {
                        dateStyle: "full",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <div className="flex-1 mt-2 md:mt-0">
                    <p className="text-sm font-medium text-black">
                      {order.nama}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatPhoneNumber(order.noTelpPenerima)}
                    </p>
                  </div>
                  <div className="flex-1 text-left md:text-right mt-2 md:mt-0">
                    <p className="text-sm font-semibold text-black">
                      Rp {order.totalHarga.toLocaleString("id-ID")}
                    </p>
                    <div className="mt-1">
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {expandedOrderId === order.id ? (
                      <ChevronUp className="text-gray-500" />
                    ) : (
                      <ChevronDown className="text-gray-500" />
                    )}
                  </div>
                </div>

                {expandedOrderId === order.id && (
                  <div className="p-6 bg-white border-t animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        {returnRequest && (
                          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
                            <h4 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                              <AlertCircle size={18} /> Detail Pengajuan
                              Pengembalian
                            </h4>
                            <div className="text-sm text-yellow-700 space-y-3">
                              <div>
                                <p className="font-semibold">Alasan:</p>
                                <p className="whitespace-pre-wrap italic">
                                  "{returnRequest.reason}"
                                </p>
                              </div>
                              <div>
                                <p className="font-semibold">Bukti Video:</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {returnRequest.videos.map((v) => (
                                    <span key={v} className="text-2xl">
                                      📹
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="font-semibold">Bukti Foto:</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {returnRequest.photos.map((p) => (
                                    <span key={p} className="text-2xl">
                                      📸
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {order.status === "pengembalian" && (
                              <div className="mt-4 flex gap-3">
                                <button
                                  onClick={() => onRejectReturn(order.id)}
                                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-600 text-white rounded-md text-sm font-semibold hover:bg-red-700"
                                >
                                  <X size={16} />
                                  Tolak
                                </button>
                                {/* <-- PERUBAHAN: Warna tombol diubah menjadi hijau --> */}
                                <button
                                  onClick={() => onApproveReturn(order.id)}
                                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-600 text-white rounded-md text-sm font-semibold hover:bg-green-700"
                                >
                                  <Check size={16} />
                                  Setujui
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                        <h4 className="font-semibold mb-3">Items Ordered</h4>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div
                              key={item._id}
                              className="flex justify-between items-center text-sm border-b pb-2"
                            >
                              <div>
                                <p className="font-medium text-black">
                                  {item.name}
                                </p>
                                <p className="text-gray-500">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="text-gray-700">
                                Rp{" "}
                                {(item.price * item.quantity).toLocaleString(
                                  "id-ID"
                                )}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Order Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium">
                              Rp {order.subtotal.toLocaleString("id-ID")}
                            </span>
                          </div>
                          {order.diskon > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Diskon ({order.kodeVoucher}):</span>
                              <span className="font-medium">
                                - Rp {order.diskon.toLocaleString("id-ID")}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Kurir:</span>
                            <span className="font-medium">
                              Rp {order.kurir.biaya.toLocaleString("id-ID")}
                            </span>
                          </div>
                          <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                            <span>Total:</span>
                            <span>
                              Rp {order.totalHarga.toLocaleString("id-ID")}
                            </span>
                          </div>
                        </div>
                        {isOrderFinal ? (
                          <div className="mt-6 p-3 bg-gray-100 rounded-md text-center">
                            <p className="text-sm font-medium text-gray-700">
                              Pesanan ini sudah final.
                            </p>
                          </div>
                        ) : (
                          <>
                            {order.status !== "pengembalian" && (
                              <>
                                <h4 className="font-semibold mb-3 mt-6">
                                  Update Status
                                </h4>
                                <div className="flex gap-2">
                                  <StatusButton
                                    orderId={order.id}
                                    currentStatus={order.status}
                                    targetStatus="diproses"
                                    label="Diproses"
                                  />
                                  <StatusButton
                                    orderId={order.id}
                                    currentStatus={order.status}
                                    targetStatus="dikirim"
                                    label="Dikirim"
                                  />
                                  <StatusButton
                                    orderId={order.id}
                                    currentStatus={order.status}
                                    targetStatus="sampai"
                                    label="Sampai"
                                  />
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="border-t mt-6 pt-4">
                      <h4 className="font-semibold mb-2">Shipping Details</h4>
                      <p className="text-sm text-black font-medium">
                        {order.nama}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatPhoneNumber(order.noTelpPenerima)}
                      </p>
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {order.alamat}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Metode Pembayaran:{" "}
                        <span className="font-medium text-black">
                          {order.metodePembayaran}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold text-black">
              Tidak Ada Pesanan
            </h3>
            <p className="text-gray-500 mt-2">
              Tidak ada pesanan yang cocok dengan filter yang dipilih.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingAdmin;
