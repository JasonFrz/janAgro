import React, { useState } from "react";
import { Plus, X, Edit, Trash2 } from "lucide-react";

const imageGallery = ['🌱', '🛠️', '🍅', '🌿', '💧', '🌻', '🥕', '🥔', '🪱', '⛏️', '🧤', '🗑️'];

function ProdukCeo({
  produk = [],
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [form, setForm] = useState({
    name: "", category: "", price: "", stock: "", image: "", description: "", detail: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.image) {
      alert("Please select a product image from the gallery.");
      return;
    }
    const produkData = { ...form, price: Number(form.price), stock: Number(form.stock), rating: 0 };
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
    if (window.confirm(`Are you sure you want to delete the product "${name}"?`)) {
      onDelete(id);
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name, category: p.category, price: p.price, stock: p.stock,
      image: p.image || '📦', description: p.description || '', detail: p.detail || '',
    });
    setEditingId(p._id);
    window.scrollTo(0, 0);
  };

  const handleImageSelect = (selectedImage) => {
    setForm({ ...form, image: selectedImage });
    setIsGalleryOpen(false);
  };

  const isFormInvalid = !form.name || !form.category || !form.image || !form.detail || form.price <= 0 || form.stock < 0;

  return (
    <>
      <div className="space-y-8">
        <div className="bg-white text-black shadow-lg rounded-lg p-6 border-2 border-black">
          <h2 className="text-2xl font-bold mb-6 pb-4 border-b-2 border-black">
            {editingId ? "Edit Product Details" : "Add New Product"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-1">Product Name</label>
              <input type="text" placeholder="e.g., Organic Garden Booster" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-3 border-2 border-black rounded" required />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full p-3 border-2 border-black rounded bg-white" required>
                <option value="" disabled>Select Category</option>
                <option value="Pupuk">Fertilizer</option>
                <option value="Alat">Tools</option>
                <option value="Bibit">Seed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Product Image</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 flex items-center justify-center border-2 border-black rounded bg-gray-100 text-5xl">
                  {form.image ? form.image : "?"}
                </div>
                <button type="button" onClick={() => setIsGalleryOpen(true)} className="bg-gray-800 text-white px-5 py-3 rounded font-bold hover:bg-black">
                  Select from Gallery
                </button>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-1">Short Description</label>
              <textarea placeholder="Brief product summary" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-3 border-2 border-black rounded" rows="3" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-1">Full Details (Required)</label>
              <textarea placeholder="Complete product specifications and information" value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} className="w-full p-3 border-2 border-black rounded" rows="5" required />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Price (IDR)</label>
              <input type="number" placeholder="e.g., 25000" value={form.price} onChange={(e) => setForm({ ...form, price: Math.max(0, Number(e.target.value)) })} className="w-full p-3 border-2 border-black rounded" required />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Stock Quantity</label>
              <input type="number" placeholder="e.g., 100" value={form.stock} onChange={(e) => setForm({ ...form, stock: Math.max(0, Number(e.target.value)) })} className="w-full p-3 border-2 border-black rounded" required />
            </div>
            <div className="flex space-x-4 md:col-span-2">
              <button type="submit" disabled={isFormInvalid} className={`bg-black text-white px-6 py-3 rounded font-bold flex items-center ${isFormInvalid ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"}`}>
                <Plus className="mr-2 h-5 w-5" />
                {editingId ? "Update Product" : "Add Product"}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancel} className="bg-white text-black border-2 border-black px-6 py-3 rounded font-bold flex items-center hover:bg-gray-100">
                  <X className="w-5 h-5 mr-2" />
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white text-black shadow-lg rounded-lg p-6 border-2 border-black">
          <h2 className="text-2xl font-bold mb-4">Product Inventory List</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border-2 border-black text-left font-bold">Product Name</th>
                  <th className="p-3 border-2 border-black text-left font-bold">Category</th>
                  <th className="p-3 border-2 border-black text-left font-bold">Price</th>
                  <th className="p-3 border-2 border-black text-left font-bold">Stock</th>
                  <th className="p-3 border-2 border-black text-center font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {produk.length === 0 ? (
                  <tr><td colSpan="5" className="p-10 text-center text-gray-500 italic">No products available or loading...</td></tr>
                ) : (
                  produk.map((p) => (
                    <tr key={p._id} className="border-b-2 border-gray-300">
                      <td className="p-3 border-x-2 border-black font-semibold">{p.name}</td>
                      <td className="p-3 border-x-2 border-black">{p.category}</td>
                      <td className="p-3 border-x-2 border-black">Rp {p.price.toLocaleString("id-ID")}</td>
                      <td className="p-3 border-x-2 border-black">{p.stock}</td>
                      <td className="p-3 border-x-2 border-black text-center space-x-2">
                        <button onClick={() => handleEdit(p)} className="p-2 text-black hover:bg-gray-200 rounded-full transition-colors"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(p._id, p.name)} className="p-2 text-red-700 hover:bg-red-100 rounded-full transition-colors"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isGalleryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md border-2 border-black">
            <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-black">
              <h3 className="text-xl font-bold">Select Image</h3>
              <button onClick={() => setIsGalleryOpen(false)} className="text-black hover:opacity-70"><X size={24} /></button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
              {imageGallery.map((img, index) => (
                <button key={index} onClick={() => handleImageSelect(img)} className="aspect-square flex items-center justify-center border-2 border-black rounded text-4xl hover:bg-gray-200 hover:scale-110 transition-transform">
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

export default ProdukCeo;