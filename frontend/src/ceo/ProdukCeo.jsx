import React, { useState } from "react";
import { Plus, X, Edit, Trash2, Upload } from "lucide-react";

// API URL tetap dibutuhkan untuk request ke backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function ProdukCeo({ produk = [], onAdd, onUpdate, onDelete }) {
  const [form, setForm] = useState({
    name: "", category: "", price: "", stock: "", description: "", detail: "", image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setImageFile(file);
      // Preview lokal untuk file yang baru dipilih dari komputer
      setImagePreview(URL.createObjectURL(file));
      setForm({ ...form, image: "" });
    } else {
      setImageFile(null);
      setImagePreview(null);
      e.target.value = null;
      alert("Silakan pilih file gambar yang valid (PNG atau JPG).");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!imagePreview) {
      alert("Silakan pilih gambar produk dengan mengunggah file baru.");
      return;
    }
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("price", Number(form.price));
    formData.append("stock", Number(form.stock));
    formData.append("description", form.description);
    formData.append("detail", form.detail);

    if (imageFile) {
      // Jika ada file baru yang diupload (binary)
      formData.append("image", imageFile);
    } else if (form.image) {
      // Jika mode edit dan gambar tidak diubah (kirim URL lama string)
      // Backend sebaiknya mengecek: jika req.file ada -> pakai req.file.path, jika tidak -> pakai req.body.image
      formData.append("image", form.image);
    }

    if (!editingId) {
      formData.append("rating", 0);
    }

    if (editingId) {
      onUpdate(editingId, formData);
    } else {
      onAdd(formData);
    }
    handleCancel();
  };

  const handleCancel = () => {
    setForm({ name: "", category: "", price: "", stock: "", description: "", detail: "", image: "" });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    if (document.getElementById("image-upload")) {
      document.getElementById("image-upload").value = null;
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name, 
      category: p.category, 
      price: p.price, 
      stock: p.stock,
      description: p.description || "", 
      detail: p.detail || "", 
      image: p.image || "",
    });
    setEditingId(p._id);
    setImageFile(null);
    
    // PERUBAHAN DISINI:
    // Karena Cloudinary menyimpan URL lengkap (https://...), kita pakai langsung.
    if (p.image) {
      setImagePreview(p.image); 
    } else {
      setImagePreview(null);
    }
    window.scrollTo(0, 0);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Anda yakin ingin menghapus produk "${name}"?`)) {
      onDelete(id);
    }
  };

  const isFormInvalid = !form.name || !form.category || !imagePreview || !form.detail || form.price <= 0 || form.stock < 0;

  return (
    <>
      <div className="space-y-8">
        <div className="bg-white text-black shadow-lg rounded-lg p-6 border-2 border-black">
          <h2 className="text-2xl font-bold mb-6 pb-4 border-b-2 border-black">
            {editingId ? "Edit Detail Produk" : "Tambah Produk Baru"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-1">Nama Produk</label>
              <input type="text" placeholder="Contoh: Pupuk Organik Super" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-3 border-2 border-black rounded" required />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Kategori</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full p-3 border-2 border-black rounded bg-white" required>
                <option value="" disabled>Pilih Kategori</option>
                <option value="Pupuk">Pupuk</option>
                <option value="Alat">Alat</option>
                <option value="Bibit">Bibit</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Gambar Produk (PNG/JPG)</label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 flex items-center justify-center border-2 border-black rounded bg-gray-100 overflow-hidden">
                  {/* Preview Image: Bisa berupa URL (Cloudinary) atau Blob (Upload baru) */}
                  {imagePreview ? (<img src={imagePreview} alt="Pratinjau" className="w-full h-full object-cover"/>) : (<span className="text-gray-400 text-sm">Pratinjau</span>)}
                </div>
                <div>
                  <input type="file" id="image-upload" accept="image/png, image/jpeg" onChange={handleImageChange} className="hidden"/>
                  <label htmlFor="image-upload" className="bg-blue-600 text-white px-5 py-3 rounded font-bold hover:bg-black cursor-pointer flex items-center text-sm">
                    <Upload size={16} className="mr-2" /> Upload Image
                  </label>
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-1">Deskripsi Singkat</label>
              <textarea placeholder="Ringkasan singkat tentang produk" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-3 border-2 border-black rounded" rows="3"/>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-1">Detail Lengkap (Wajib)</label>
              <textarea placeholder="Spesifikasi dan informasi lengkap produk" value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} className="w-full p-3 border-2 border-black rounded" rows="5" required/>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Harga (IDR)</label>
              <input type="number" placeholder="Contoh: 25000" value={form.price} onChange={(e) => setForm({ ...form, price: Math.max(0, Number(e.target.value)), })} className="w-full p-3 border-2 border-black rounded" required/>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Jumlah Stok</label>
              <input type="number" placeholder="Contoh: 100" value={form.stock} onChange={(e) => setForm({ ...form, stock: Math.max(0, Number(e.target.value)), })} className="w-full p-3 border-2 border-black rounded" required/>
            </div>
            <div className="flex space-x-4 md:col-span-2">
              <button type="submit" disabled={isFormInvalid} className={`bg-black text-white px-6 py-3 rounded font-bold flex items-center ${isFormInvalid ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"}`}>
                <Plus className="mr-2 h-5 w-5" /> {editingId ? "Perbarui Produk" : "Tambah Produk"}
              </button>
              {editingId && (<button type="button" onClick={handleCancel} className="bg-white text-black border-2 border-black px-6 py-3 rounded font-bold flex items-center hover:bg-gray-100">
                  <X className="w-5 h-5 mr-2" /> Batal Edit
                </button>)}
            </div>
          </form>
        </div>
        <div className="bg-white text-black shadow-lg rounded-lg p-6 border-2 border-black">
          <h2 className="text-2xl font-bold mb-4">Daftar Inventaris Produk</h2>
          <div className="overflow-x-auto max-h-96 overflow-y-auto border-2 border-black rounded-lg">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-3 border-2 border-black text-left font-bold">Gambar</th>
                  <th className="p-3 border-2 border-black text-left font-bold">Nama Produk</th>
                  <th className="p-3 border-2 border-black text-left font-bold">Kategori</th>
                  <th className="p-3 border-2 border-black text-left font-bold">Harga</th>
                  <th className="p-3 border-2 border-black text-left font-bold">Stok</th>
                  <th className="p-3 border-2 border-black text-center font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {produk.length === 0 ? (
                  <tr><td colSpan="6" className="p-10 text-center text-gray-500 italic">Belum ada produk atau sedang memuat...</td></tr>
                ) : (
                  produk.map((p) => (
                    <tr key={p._id} className="border-b-2 border-gray-300">
                      <td className="p-3 border-x-2 border-black">
                        {/* PERUBAHAN DISINI: src langsung menggunakan p.image */}
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded"/>
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Image</div>
                        )}
                      </td>
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
    </>
  );
}

export default ProdukCeo;