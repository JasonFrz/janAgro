import React from "react";

const SettingAdmin = ({ checkouts = [], onUpdateStatus }) => {
  const sortedCheckouts = [...checkouts].sort(
    (a, b) => new Date(b.tanggal) - new Date(a.tanggal)
  );

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
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Order Management</h2>
      <p className="text-gray-500 mb-6">
        Kelola dan perbarui status pesanan pelanggan.
      </p>

      <div className="space-y-6">
        <div className="border border-gray-200 rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedCheckouts.length > 0 ? (
                sortedCheckouts.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4">
                      <p className="font-bold text-sm text-black">
                        #{order.id}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.tanggal).toLocaleString("id-ID")}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-black">
                        {order.nama}
                      </p>
                      <p className="text-xs text-gray-500">{order.alamat}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-black">
                      Rp {order.totalHarga.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4">
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
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-500">
                    No orders have been placed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SettingAdmin;
