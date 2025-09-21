// src/admin/ProdukAdmin.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus } from "lucide-react";

function ProdukAdmin() {
  const [produk, setProduk] = useState([]);
  const [form, setForm] = useState({ nama: "", type: "", harga: "", stok: "" });
  const [editingId, setEditingId] = useState(null);

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

  const handleCancel = () => {
    setForm({ nama: "", type: "", harga: "", stok: "" });
    setEditingId(null);
  };

  const handleDelete = async (id, nama) => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus produk "${nama}"?`
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/Produk/${id}`);
      fetchProduk();
    } catch (err) {
      console.error("Gagal hapus Produk:", err);
    }
  };

  const handleEdit = (p) => {
    setForm({ nama: p.nama, type: p.type, harga: p.harga, stok: p.stok });
    setEditingId(p._id);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Produk" : "Tambah Produk"}
        </h2>
        // Di dalam return form
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
            onChange={(e) =>
              setForm({
                ...form,
                harga: Math.max(0, Number(e.target.value)), // tidak boleh minus
              })
            }
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Stok"
            value={form.stok}
            onChange={(e) =>
              setForm({
                ...form,
                stok: Math.max(0, Number(e.target.value)), // tidak boleh minus
              })
            }
            className="w-full p-2 border rounded"
            required
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={form.harga < 0 || form.stok < 0} // tombol disable jika minus
              className={`bg-green-600 text-white px-4 py-2 rounded flex items-center ${
                form.harga < 0 || form.stok < 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <Plus className="mr-2 h-4 w-4" />
              {editingId ? "Update Produk" : "Tambah Produk"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 flex items-center"
              >
                <img
                  src="/icon/remove.png"
                  alt="Cancel"
                  className="w-4 h-4 mr-2"
                />
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Daftar Produk</h2>
        {produk.length === 0 ? (
          <p className="text-gray-500">Belum ada produk</p>
        ) : (
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            {" "}
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-gray-100 z-10">
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
                        <img
                          src="/icon/edit.png"
                          alt="Edit"
                          className="w-4 h-4 mr-1"
                        />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p._id, p.nama)}
                        className="text-red-600 hover:underline flex items-center"
                      >
                        <img
                          src="/icon/delete.png"
                          alt="Hapus"
                          className="w-4 h-4 mr-1"
                        />
                        Hapus
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
  );
}

export default ProdukAdmin;
