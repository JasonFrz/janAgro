import React from "react";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  MessageSquare,
} from "lucide-react";

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

// PERBAIKAN 1: Pastikan 'reviews' diterima sebagai prop
const Pesanan = ({ checkouts, user, reviews, setPage }) => {
  // PERBAIKAN 2: Hapus blok 'if (!user || !reviews)' yang menyebabkan "Loading..."

  // Gunakan optional chaining `user?.id` untuk keamanan jika user null
  const userCheckouts = checkouts
    .filter((order) => order.userId === user?.id)
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  const statusLevels = { diproses: 1, dikirim: 2, sampai: 3 };

  // Tambahkan pengecekan jika pengguna tidak login sama sekali
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl font-bold text-black mb-4">Akses Ditolak</h1>
          <p className="text-gray-600 mb-8">
            Silakan login terlebih dahulu untuk melihat riwayat pesanan Anda.
          </p>
          <button
            onClick={() => setPage({ name: "home" })}
            className="bg-black text-white py-3 px-8 rounded-sm font-medium hover:bg-gray-800 transition"
          >
            Kembali ke Home
          </button>
        </div>
      </div>
    );
  }

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
          Riwayat Pesanan Anda
        </h1>

        {userCheckouts.length > 0 ? (
          <div className="space-y-8">
            {userCheckouts.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-sm border">
                <div className="flex flex-col md:flex-row justify-between md:items-center border-b pb-4 mb-6">
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
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className="font-semibold capitalize text-black">
                      {order.status}
                    </span>
                  </div>
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

                <div className="border-t grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-lg">
                      Rincian Pesanan
                    </h4>
                    <div className="space-y-4">
                      {order.items.map((item) => {
                        // PERBAIKAN 3: Gunakan optional chaining 'user?.id' untuk keamanan
                        const hasReviewed = reviews.some(
                          (review) =>
                            review.userId === user?.id &&
                            review.productId === item._id
                        );
                        return (
                          <div
                            key={item._id}
                            className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center border-b pb-4 last:border-b-0"
                          >
                            <div className="flex gap-4">
                              <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-3xl flex-shrink-0">
                                {item.image}
                              </div>
                              <div>
                                <p className="font-bold text-black">
                                  {item.name}
                                </p>
                                <p className="text-gray-500 text-sm">
                                  {item.quantity} x Rp{" "}
                                  {item.price.toLocaleString("id-ID")}
                                </p>
                              </div>
                            </div>
                            {order.status === "sampai" && (
                              <div>
                                {hasReviewed ? (
                                  <p className="text-sm font-medium text-green-600">
                                    Sudah diulas
                                  </p>
                                ) : (
                                  <button
                                    onClick={() =>
                                      setPage({ name: "review", id: item._id })
                                    }
                                    className="flex items-center gap-2 text-sm bg-black text-white py-2 px-4 rounded-md font-medium hover:bg-gray-800 transition"
                                  >
                                    <MessageSquare size={16} />
                                    Beri Ulasan
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-lg">
                        Rincian Pembayaran
                      </h4>
                      <div className="space-y-2 text-sm p-4 bg-gray-50 rounded-md">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-medium text-black">
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
                          <span className="text-gray-600">Biaya Kurir:</span>
                          <span className="font-medium text-black">
                            Rp {order.kurir.biaya.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <div className="flex justify-between font-bold text-base border-t border-gray-300 pt-2 mt-2">
                          <span>Total Dibayar:</span>
                          <span>
                            Rp {order.totalHarga.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-lg">
                        Alamat Pengiriman
                      </h4>
                      <div className="text-sm p-4 bg-gray-50 rounded-md">
                        <p className="font-bold text-black">{order.nama}</p>
                        <p className="text-gray-600">
                          {formatPhoneNumber(order.noTelpPenerima)}
                        </p>
                        <p className="text-gray-600 mt-1 whitespace-pre-line">
                          {order.alamat}
                        </p>
                      </div>
                    </div>
                  </div>
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
