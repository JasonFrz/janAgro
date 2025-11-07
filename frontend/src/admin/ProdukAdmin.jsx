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
    description: "",
    detail: "",
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
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      rating: 0,
    };

    if (editingId) {
      onUpdate(editingId, produkData);
    } else {
      onAdd(produkData);
    }
    handleCancel();
  };

  const handleCancel = () => {
    setForm({ name: "", category: "", price: "", stock: "", image: "", description: "", detail: "" });
    setEditingId(null);
  };

  const handleDelete = (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this "${name}"?`
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
      description: p.description || '',
      detail: p.detail || '',
    });
    setEditingId(p._id);
  };

  const handleImageSelect = (selectedImage) => {
    setForm({ ...form, image: selectedImage });
    setIsGalleryOpen(false);
  };

  const isFormInvalid = !form.name || !form.category || !form.image || !form.detail || form.price <= 0 || form.stock < 0;

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
              placeholder="Product Name"
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
              <option value="" disabled>Pilih Kategori Produk</option>
              <option value="Fertilizer">Pupuk</option>
              <option value="Tools">Alat</option>
              <option value="Seed">Bibit</option>
            </select>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 flex items-center justify-center border rounded-md bg-gray-100 text-4xl">
                  {form.image ? form.image : "?"}
                </div>
                <button
                  type="button"
                  onClick={() => setIsGalleryOpen(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Choose From Gallery
                </button>
              </div>
            </div>
            
            <textarea
              placeholder="Product Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-2 border rounded"
              rows="3"
            />
            
            <textarea
              placeholder="Product Details (Required)"
              value={form.detail}
              onChange={(e) => setForm({ ...form, detail: e.target.value })}
              className="w-full p-2 border rounded"
              rows="5"
              required
            />

            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Math.max(0, Number(e.target.value))})}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: Math.max(0, Number(e.target.value))})}
              className="w-full p-2 border rounded"
              required
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={isFormInvalid}
                className={`bg-green-600 text-white px-4 py-2 rounded flex items-center ${
                  isFormInvalid ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
                }`}
              >
                <Plus className="mr-2 h-4 w-4" />
                {editingId ? "Update Product" : "Add Product"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 flex items-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Product List</h2>
          {produk.length === 0 ? (
            <p className="text-gray-500">Loading Product...</p>
          ) : (
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr>
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Category</th>
                    <th className="p-2 border">Price</th>
                    <th className="p-2 border">Stock</th>
                    <th className="p-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {produk.map((p) => (
                    <tr key={p._id} className="border-t">
                      <td className="p-2 border">{p.name}</td>
                      <td className="p-2 border">{p.category}</td>
                      <td className="p-2 border">Rp {p.price.toLocaleString("id-ID")}</td>
                      <td className="p-2 border">{p.stock}</td>
                      <td className="p-2 border flex space-x-2">
                        <button onClick={() => handleEdit(p)} className="text-blue-600 hover:underline flex items-center">
                          <img src="/icon/edit.png" alt="Edit" className="w-4 h-4 mr-1"/>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(p._id, p.name)} className="text-red-600 hover:underline flex items-center">
                          <img src="/icon/delete.png" alt="Hapus" className="w-4 h-4 mr-1"/>
                          Delete
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
              <h3 className="text-lg font-semibold">Select Image From Gallery</h3>
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