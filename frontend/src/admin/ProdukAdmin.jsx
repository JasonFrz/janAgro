import React, { useState } from "react";
import { Plus, X, Upload, Edit, Trash2, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Tidak perlu lagi SERVER_URL untuk gambar Cloudinary
// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
// const SERVER_URL = API_URL.replace("/api", "");

function ProdukAdmin({ produk = [], onAdd, onUpdate, onDelete }) {
  const navigate = useNavigate();
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
      // Untuk file baru dari komputer, kita buat local preview URL
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
      alert("Silakan pilih gambar produk dengan mengunggah file.");
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
      // Jika ada file baru yang diupload
      formData.append("image", imageFile);
    } else if (form.image) {
      // Jika menggunakan gambar lama (URL String)
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
    if (document.getElementById("admin-image-upload")) {
      document.getElementById("admin-image-upload").value = null;
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Anda yakin ingin menghapus produk "${name}"?`)) {
      onDelete(id);
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

    // --- PERUBAHAN DI SINI ---
    // Langsung gunakan URL dari database karena itu adalah URL Cloudinary
    if (p.image) {
      setImagePreview(p.image); 
    } else {
      setImagePreview(null);
    }
  };

  const isFormInvalid = !form.name || !form.category || !imagePreview || !form.detail || form.price <= 0 || form.stock < 0;

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Produk" : "Tambah Produk"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Nama Produk" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 border rounded" required />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full p-2 border rounded" required>
              <option value="" disabled>Pilih Kategori Produk</option>
              <option value="Pupuk">Pupuk</option>
              <option value="Alat">Alat</option>
              <option value="Bibit">Bibit</option>
            </select>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Produk</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 flex items-center justify-center border rounded-md bg-gray-100 overflow-hidden">
                  {imagePreview ? (<img src={imagePreview} alt="Pratinjau" className="w-full h-full object-cover"/>) : (<span className="text-gray-500 text-sm">Pratinjau</span>)}
                </div>
                <div>
                    <input type="file" id="admin-image-upload" accept="image/png, image/jpeg" onChange={handleImageChange} className="hidden"/>
                    <label htmlFor="admin-image-upload" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm cursor-pointer flex items-center justify-center">
                        <Upload size={16} className="mr-2"/> Upload Image
                    </label>
                </div>
              </div>
            </div>
            <textarea placeholder="Deskripsi Produk" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-2 border rounded" rows="3"/>
            <textarea placeholder="Detail Produk (Wajib)" value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} className="w-full p-2 border rounded" rows="5" required/>
            <input type="number" placeholder="Harga" value={form.price} onChange={(e) => setForm({ ...form, price: Math.max(0, Number(e.target.value)) })} className="w-full p-2 border rounded" required/>
            <input type="number" placeholder="Stok" value={form.stock} onChange={(e) => setForm({ ...form, stock: Math.max(0, Number(e.target.value)) })} className="w-full p-2 border rounded" required/>
            <div className="flex space-x-2">
              <button type="submit" disabled={isFormInvalid} className={`bg-green-600 text-white px-4 py-2 rounded flex items-center ${isFormInvalid ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"}`}>
                <Plus className="mr-2 h-4 w-4" /> {editingId ? "Perbarui Produk" : "Tambah Produk"}
              </button>
              {editingId && (<button type="button" onClick={handleCancel} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 flex items-center">
                  <X className="w-4 h-4 mr-2" /> Batal
                </button>)}
            </div>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 pb-4 border-b gap-4">
            <h2 className="text-xl font-semibold">Daftar Produk</h2>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => navigate("/laporan-stok-admin")}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition shadow-md font-bold"
              >
                <FileText size={20} />
                <span>Laporan Stok</span>
              </button>
              <button
                onClick={() => navigate("/laporan-movement-admin")}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md font-bold"
              >
                <FileText size={20} />
                <span>Laporan Masuk/Keluar</span>
              </button>
            </div>
          </div>
          {produk.length === 0 ? (<p className="text-gray-500">Memuat produk...</p>) : (
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr>
                    <th className="p-2 border">Gambar</th>
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
                      <td className="p-2 border w-24">
                        {/* --- PERUBAHAN DI SINI --- */}
                        {p.image ? (
                            <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded mx-auto"/>
                        ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded mx-auto flex items-center justify-center text-xs text-gray-500">No Image</div>
                        )}
                      </td>
                      <td className="p-2 border">{p.name}</td>
                      <td className="p-2 border">{p.category}</td>
                      <td className="p-2 border">Rp {p.price.toLocaleString("id-ID")}</td>
                      <td className="p-2 border">{p.stock}</td>
                      <td className="p-2 border">
                        <div className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-2 md:justify-center">
                            <button onClick={() => handleEdit(p)} className="text-blue-600 hover:underline text-sm flex items-center"><Edit size={14} className="mr-1"/> Edit</button>
                            <button onClick={() => handleDelete(p._id, p.name)} className="text-red-600 hover:underline text-sm flex items-center"><Trash2 size={14} className="mr-1"/> Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProdukAdmin;