import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";

function DashboardAdmin({ vouchers = [], produk = [] }) {
  // State untuk menyimpan data pengguna, status loading, dan error
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [produkSortAsc, setProdukSortAsc] = useState(true);
  const [userSortAsc, setUserSortAsc] = useState(true);

  // useEffect untuk mengambil data pengguna saat komponen dimuat
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/admin/get-all-users");
        if (res.data.success) {
          setUsers(res.data.data);
        } else {
          setError("Gagal mengambil data pengguna");
        }
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan pada server saat mengambil data pengguna");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []); // Array dependensi kosong memastikan ini hanya berjalan sekali saat komponen dimuat

  const getProdukStatus = (stock) => {
    if (stock === 0)
      return { text: "Stok Habis", color: "bg-red-100 text-red-600" };
    if (stock <= 10)
      return { text: "Stok Sedikit", color: "bg-yellow-100 text-yellow-600" };
    return { text: "Tersedia", color: "bg-green-100 text-green-600" };
  };

  const getUserStatus = (isBanned) => {
    if (isBanned) return { text: "Diblokir", color: "bg-red-100 text-red-600" };
    return { text: "Aktif", color: "bg-green-100 text-green-600" };
  };

  const cards = [
    { title: "Total Pengguna", count: users.length, icon: "/icon/group.png" },
    { title: "Total Produk", count: produk.length, icon: "/icon/product.png" },
    {
      title: "Total Voucher",
      count: vouchers.length,
      icon: "/icon/voucher.png",
    },
  ];

  const sortedProduk = useMemo(() => {
    return [...produk].sort((a, b) => {
      if (produkSortAsc) return (a.name || "").localeCompare(b.name || "");
      return (b.name || "").localeCompare(a.name || "");
    });
  }, [produk, produkSortAsc]);

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      if (userSortAsc)
        return (a.username || "").localeCompare(b.username || "");
      return (b.username || "").localeCompare(a.username || "");
    });
  }, [users, userSortAsc]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white shadow rounded-lg p-4 flex items-center space-x-4"
          >
            <img src={card.icon} alt={card.title} className="w-12 h-12" />
            <div>
              <p className="text-gray-600">{card.title}</p>
              <p className="text-3xl font-bold">{card.count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center space-x-2">
              <span>Pengguna Terbaru</span>
              <button
                onClick={() => setUserSortAsc(!userSortAsc)}
                className="p-1 rounded border hover:bg-gray-100"
                title={`Urutkan berdasarkan nama pengguna ${userSortAsc ? "DESC" : "ASC"}`}
              >
                <img
                  src="/icon/down.png"
                  alt="Sort"
                  className={`w-4 h-4 transition-transform duration-300 ${
                    userSortAsc ? "rotate-180" : ""
                  }`}
                />
              </button>
            </h2>
          </div>
          {/* Menampilkan status loading, error, atau daftar pengguna */}
          {loading ? (
            <p className="text-gray-500">Memuat pengguna...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : users.length === 0 ? (
            <p className="text-gray-500">Tidak ada data pengguna yang tersedia.</p>
          ) : (
            <div className="overflow-y-auto max-h-96">
              <ul className="divide-y divide-gray-200">
                {sortedUsers.slice(0, 6).map((user) => {
                  const status = getUserStatus(user.isBanned);
                  return (
                    <li
                      key={user._id} // Menggunakan _id dari MongoDB
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <p className="font-medium text-black">{user.name}</p>
                        <p className="text-sm text-gray-500">
                          @{user.username}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${status.color}`}
                        >
                          {status.text}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center space-x-2">
              <span>Inventaris Produk</span>
              <button
                onClick={() => setProdukSortAsc(!produkSortAsc)}
                className="p-1 rounded border hover:bg-gray-100"
                title={`Urutkan berdasarkan nama ${produkSortAsc ? "DESC" : "ASC"}`}
              >
                <img
                  src="/icon/down.png"
                  alt="Sort"
                  className={`w-4 h-4 transition-transform duration-300 ${
                    produkSortAsc ? "rotate-180" : ""
                  }`}
                />
              </button>
            </h2>
          </div>
          <div className="overflow-y-auto max-h-96">
            <ul className="divide-y divide-gray-200">
              {sortedProduk.slice(0, 6).map((p) => {
                const status = getProdukStatus(p.stock);
                return (
                  <li
                    key={p._id}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-gray-500">{p.category}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-semibold">
                        Stok: {p.stock}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${status.color}`}
                      >
                        {status.text}
                      </span>
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

export default DashboardAdmin;