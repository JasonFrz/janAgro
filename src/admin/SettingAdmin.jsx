import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const formatPhoneNumber = (phone) => {
  if (!phone) return "-";
  const digits = phone.replace(/\D/g, "");
  let formatted = "+62 ";
  if (digits.length > 4) {
    formatted += digits.substring(0, 4) + "-";
    if (digits.length > 8) {
      formatted += digits.substring(4, 8) + "-";
      formatted += digits.substring(8);
    } else {
      formatted += digits.substring(4);
    }
  } else {
    formatted += digits;
  }
  return formatted;
};

const SettingAdmin = ({ checkouts = [], onUpdateStatus }) => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const sortedCheckouts = [...checkouts].sort(
    (a, b) => new Date(b.tanggal) - new Date(a.tanggal)
  );

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

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

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Order Management</h2>
        <p className="text-gray-500">
          Kelola dan perbarui status pesanan pelanggan.
        </p>
      </div>

      <div className="space-y-4">
        {sortedCheckouts.length > 0 ? (
          sortedCheckouts.map((order) => (
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
                  <p className="text-sm font-medium text-black">{order.nama}</p>
                  <p className="text-xs text-gray-500">
                    {order.noTelpPenerima
                      ? formatPhoneNumber(order.noTelpPenerima)
                      : "-"}
                  </p>
                </div>
                <div className="flex-1 text-left md:text-right mt-2 md:mt-0">
                  <p className="text-sm font-semibold text-black">
                    Rp {order.totalHarga.toLocaleString("id-ID")}
                  </p>
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
                      <h4 className="font-semibold mb-3 mt-6">Update Status</h4>
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
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">
                          Current Status:{" "}
                          <span className="font-bold capitalize text-black">
                            {order.status}
                          </span>
                        </p>
                      </div>
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
          ))
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold text-black">No Orders Yet</h3>
            <p className="text-gray-500 mt-2">
              Tidak ada pesanan yang masuk saat ini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingAdmin;
