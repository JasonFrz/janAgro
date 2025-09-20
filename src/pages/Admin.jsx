// src/pages/Admin.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { LayoutDashboard, Users, Package, Settings, Plus, Edit3, Trash2 } from "lucide-react";

function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [produk, setProduk] = useState([]);
  const [form, setForm] = useState({ nama: "", type: "", harga: "", stok: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch produk dari API
  useEffect(() => {
    fetchProduk();
  }, []);

  const fetchProduk = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/Produk");
      setProduk(res.data);
    } catch (err) {
      console.error("Gagal fetch produk:", err);
    }
  };

  // Submit produk
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/Produk/${editingId}`, form);
      } else {
        await axios.post("http://localhost:5000/api/Produk", form);
      }
      setForm({ nama: "", type: "", harga: "", stok: "" });
      setEditingId(null);
      fetchProduk();
    } catch (err) {
      console.error("Gagal simpan Produk:", err);
    }
  };

  // Delete produk
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/Produk/${id}`);
      fetchProduk();
    } catch (err) {
      console.error("Gagal hapus Produk:", err);
    }
  };

  // Edit produk
  const handleEdit = (p) => {
    setForm({ nama: p.nama, type: p.type, harga: p.harga, stok: p.stok });
    setEditingId(p._id);
  };

  // Status stok
  const getStatus = (stok) => {
    if (stok === 0) return { text: "Out of Stock", color: "bg-red-100 text-red-600" };
    if (stok <= 10) return { text: "Low Stock", color: "bg-yellow-100 text-yellow-600" };
    return { text: "Available", color: "bg-green-100 text-green-600" };
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h1 className="text-xl font-bold mb-6">Admin Panel</h1>
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center w-full px-3 py-2 rounded ${
              activeTab === "dashboard" ? "bg-black text-white" : "hover:bg-gray-200"
            }`}
          >
            <LayoutDashboard className="mr-2 h-5 w-5" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center w-full px-3 py-2 rounded ${
              activeTab === "users" ? "bg-black text-white" : "hover:bg-gray-200"
            }`}
          >
            <Users className="mr-2 h-5 w-5" /> Users
          </button>
          <button
            onClick={() => setActiveTab("produk")}
            className={`flex items-center w-full px-3 py-2 rounded ${
              activeTab === "produk" ? "bg-black text-white" : "hover:bg-gray-200"
            }`}
          >
            <Package className="mr-2 h-5 w-5" /> Produk
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center w-full px-3 py-2 rounded ${
              activeTab === "settings" ? "bg-black text-white" : "hover:bg-gray-200"
            }`}
          >
            <Settings className="mr-2 h-5 w-5" /> Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 mt-16">
        {/* ⬆️ mt-16 biar isi dashboard turun sesuai tinggi navbar */}
        
        {activeTab === "dashboard" && (
          <>
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white shadow rounded-lg p-4">
                <h2 className="text-lg font-semibold">Total Fertilizer</h2>
                <p className="text-2xl font-bold">{produk.filter(p => p.type === "Fertilizer").length}</p>
              </div>
              <div className="bg-white shadow rounded-lg p-4">
                <h2 className="text-lg font-semibold">Total Tools</h2>
                <p className="text-2xl font-bold">{produk.filter(p => p.type === "Tools").length}</p>
              </div>
              <div className="bg-white shadow rounded-lg p-4">
                <h2 className="text-lg font-semibold">Total Produk</h2>
                <p className="text-2xl font-bold">{produk.length}</p>
              </div>
            </div>

            {/* Recent Users + Produk Inventory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
                <p className="text-gray-500">Belum ada user</p>
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
          </>
        )}

        {activeTab === "users" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold">Users</h2>
            <p className="text-gray-500">Belum ada data user</p>
          </div>
        )}

        {activeTab === "produk" && (
          <div className="space-y-6">
            {/* Form */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Produk" : "Tambah Produk"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Nama Produk"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Harga"
                  value={form.harga}
                  onChange={(e) => setForm({ ...form, harga: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Stok"
                  value={form.stok}
                  onChange={(e) => setForm({ ...form, stok: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  {editingId ? "Update Produk" : "Tambah Produk"}
                </button>
              </form>
            </div>

            {/* Table Produk */}
<div className="bg-white shadow rounded-lg p-6">
  <h2 className="text-xl font-semibold mb-4">Daftar Produk</h2>
  {produk.length === 0 ? (
    <p className="text-gray-500">Belum ada produk</p>
  ) : (
    <div className="overflow-x-auto max-h-80 overflow-y-auto">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-gray-100">
          <tr>
            <th className="p-2 border">Nama</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Harga</th>
            <th className="p-2 border">Stok</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {produk.map((p) => (
            <tr key={p._id} className="border-t">
              <td className="p-2 border">{p.nama}</td>
              <td className="p-2 border">{p.type}</td>
              <td className="p-2 border">Rp {p.harga}</td>
              <td className="p-2 border">{p.stok}</td>
              <td className="p-2 border flex space-x-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="text-blue-600 hover:underline flex items-center"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-red-600 hover:underline flex items-center"
                >
                  🗑️ Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold">Settings</h2>
            <p className="text-gray-500">Belum ada pengaturan</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Admin;
