// src/admin/DashboardAdmin.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

function DashboardAdmin() {
  const [produk, setProduk] = useState([]);
  const [users, setUsers] = useState([]); 

  useEffect(() => {
    fetchProduk();
    fetchUsers();
  }, []);

  const fetchProduk = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/Produk");
      setProduk(res.data);
    } catch (err) {
      console.error("Gagal fetch produk:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users"); // endpoint user
      setUsers(res.data);
    } catch (err) {
      console.error("Gagal fetch users:", err);
    }
  };

  const getStatus = (stok) => {
    if (stok === 0) return { text: "Out of Stock", color: "bg-red-100 text-red-600" };
    if (stok <= 10) return { text: "Low Stock", color: "bg-yellow-100 text-yellow-600" };
    return { text: "Available", color: "bg-green-100 text-green-600" };
  };

  const cards = [
    { title: "Total Fertilizer", count: produk.filter(p => p.type === "Fertilizer").length, icon: "/icon/pupuk.png" },
    { title: "Total Tools", count: produk.filter(p => p.type === "Tools").length, icon: "/icon/tools.png" },
    { title: "Total Produk", count: produk.length, icon: "/icon/product.png" },
    { title: "Total Users", count: users.length, icon: "/icon/group.png" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white shadow rounded-lg p-4 flex items-center space-x-4">
            <img src={card.icon} alt={card.title} className="w-12 h-12" />
            <div>
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="text-2xl font-bold">{card.count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
          {users.length === 0 ? (
            <p className="text-gray-500">Belum ada user</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {users.map((u) => (
                <li key={u._id} className="py-2">
                  <p className="font-medium">{u.name}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Produk Inventory</h2>
          <ul className="divide-y divide-gray-200">
            {produk.map((p) => {
              const status = getStatus(p.stok);
              return (
                <li key={p._id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{p.nama}</p>
                    <p className="text-sm text-gray-500">{p.type}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-semibold">Stock: {p.stok}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${status.color}`}>
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
  );
}

export default DashboardAdmin;
