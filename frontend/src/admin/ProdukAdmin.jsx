import React, { useState } from "react";
import { Plus, X } from "lucide-react";

const imageGallery = ['🌱', '🛠️', '🍅', '🌿', '💧', '🌻', '🥕', '🥔', '🪱', '⛏️', '🧤', '🗑️'];

function ProdukAdmin({
  produk = [],
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "", 
  });
  const [editingId, setEditingId] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.image) {
      alert("Silakan pilih gambar produk dari galeri.");
      return;
    }
    
    const produkData = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      image: form.image, 
      description: "Deskripsi produk baru.",
      rating: 0,
      detail: "Detail produk baru.",
    };

    if (editingId) {
      onUpdate(editingId, produkData);
    } else {
      onAdd(produkData);
    }
    handleCancel();
  };

  const handleCancel = () => {
    setForm({ name: "", category: "", price: "", stock: "", image: "" });
    setEditingId(null);
  };

  const handleDelete = (id, name) => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus produk "${name}"?`
    );
    if (confirmDelete) {
      onDelete(id);
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock,
      image: p.image || '📦', 
    });
    setEditingId(p._id);
  };

  const handleImageSelect = (selectedImage) => {
    setForm({ ...form, image: selectedImage });
    setIsGalleryOpen(false); 
  };

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Produk" : "Tambah Produk"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nama Produk"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="" disabled>
                Pilih Kategori Produk
              </option>
              <option value="Pupuk">Pupuk</option>
              <option value="Alat">Alat</option>
              <option value="Bibit">Bibit</option>
            </select>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gambar Produk
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 flex items-center justify-center border rounded-md bg-gray-100 text-4xl">
                  {form.image ? form.image : "?"}
                </div>
                <button
                  type="button"
                  onClick={() => setIsGalleryOpen(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Pilih dari Galeri
                </button>
              </div>
            </div>

            <input
              type="number"
              placeholder="Harga"
              value={form.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: Math.max(0, Number(e.target.value)),
                })
              }
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Stok"
              value={form.stock}
              onChange={(e) =>
                setForm({
                  ...form,
                  stock: Math.max(0, Number(e.target.value)),
                })
              }
              className="w-full p-2 border rounded"
              required
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={!form.name || !form.category || !form.image || form.price < 0 || form.stock < 0}
                className={`bg-green-600 text-white px-4 py-2 rounded flex items-center ${
                  !form.name || !form.category || !form.image || form.price < 0 || form.stock < 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-green-700"
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
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              {" "}
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr>
                    <th className="p-2 border">Nama</th>
                    <th className="p-2 border">Kategori</th>
                    <th className="p-2 border">Harga</th>
                    <th className="p-2 border">Stok</th>
                    <th className="p-2 border">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {produk.map((p) => (
                    <tr key={p._id} className="border-t">
                      <td className="p-2 border">{p.name}</td>
                      <td className="p-2 border">{p.category}</td>
                      <td className="p-2 border">
                        Rp {p.price.toLocaleString("id-ID")}
                      </td>
                      <td className="p-2 border">{p.stock}</td>
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
                          onClick={() => handleDelete(p._id, p.name)}
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

      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Pilih Gambar dari Galeri</h3>
              <button onClick={() => setIsGalleryOpen(false)} className="text-gray-500 hover:text-gray-800">
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
              {imageGallery.map((img, index) => (
                <button
                  key={index}
                  onClick={() => handleImageSelect(img)}
                  className="aspect-square flex items-center justify-center border rounded-md text-4xl hover:bg-gray-100 hover:scale-110 transition-transform"
                >
                  {img}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProdukAdmin;