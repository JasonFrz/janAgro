import React from "react";
import { ArrowLeft, Package, Truck, CheckCircle } from "lucide-react";

const TrackerStep = ({ icon, label, isActive, isCompleted }) => {
  return (
    <div className="flex flex-col items-center text-center w-24">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
          isActive
            ? "bg-black border-black scale-110"
            : "bg-white border-gray-300"
        } ${isCompleted ? "bg-black border-black" : ""}`}
      >
        {React.cloneElement(icon, {
          size: 24,
          className: `transition-colors duration-300 ${
            isActive || isCompleted ? "text-white" : "text-gray-400"
          }`,
        })}
      </div>
      <p
        className={`mt-2 text-sm font-semibold transition-colors duration-300 ${
          isActive || isCompleted ? "text-black" : "text-gray-500"
        }`}
      >
        {label}
      </p>
    </div>
  );
};

const Pesanan = ({ checkouts, user, setPage }) => {
  const userCheckouts = checkouts
    .filter((order) => order.userId === user?.id)
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  const statusLevels = { diproses: 1, dikirim: 2, sampai: 3 };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => setPage({ name: "shop" })}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-8 transition"
        >
          <ArrowLeft size={20} />
          Kembali ke Toko
        </button>
        <h1 className="text-4xl font-bold text-black mb-8">
          Lacak Pesanan Anda
        </h1>

        {userCheckouts.length > 0 ? (
          <div className="space-y-8">
            {userCheckouts.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-sm border">
                <div className="flex flex-col md:flex-row justify-between md:items-center border-b pb-4 mb-4">
                  <div>
                    <p className="font-bold text-lg">Pesanan #{order.id}</p>
                    <p className="text-sm text-gray-500">
                      Tanggal:{" "}
                      {new Date(order.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <p className="font-semibold text-lg mt-2 md:mt-0">
                    Total: Rp {order.totalHarga.toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="flex items-center justify-between px-4 sm:px-8 my-8 relative">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 transform -translate-y-1/2 -z-1"></div>
                  <div
                    className="absolute top-1/2 left-0 h-1 bg-black transform -translate-y-1/2 -z-1 transition-all duration-500"
                    style={{
                      width: `${((statusLevels[order.status] || 1) - 1) * 50}%`,
                    }}
                  ></div>
                  <TrackerStep
                    icon={<Package />}
                    label="Diproses"
                    isActive={order.status === "diproses"}
                    isCompleted={statusLevels[order.status] >= 1}
                  />
                  <TrackerStep
                    icon={<Truck />}
                    label="Dikirim"
                    isActive={order.status === "dikirim"}
                    isCompleted={statusLevels[order.status] >= 2}
                  />
                  <TrackerStep
                    icon={<CheckCircle />}
                    label="Sampai"
                    isActive={order.status === "sampai"}
                    isCompleted={statusLevels[order.status] >= 3}
                  />
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Produk yang dibeli:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {order.items.map((item) => (
                      <li key={item._id}>
                        {item.name} (x{item.quantity})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border rounded-sm">
            <h2 className="text-2xl font-semibold text-black">
              Tidak Ada Riwayat Pesanan
            </h2>
            <p className="text-gray-500 mt-2">
              Anda belum melakukan pesanan apapun.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pesanan;
