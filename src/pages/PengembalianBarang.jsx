import React, { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";

const PengembalianBarang = ({ order, setPage, onSubmitReturn }) => {
  const [reason, setReason] = useState("");

  // Data dummy untuk file media yang di-upload pengguna
  const [videos] = useState([{ id: 1, icon: "📹" }]); // Anggap pengguna sudah upload 1 video
  const [photos] = useState([
    { id: 1, icon: "📸" },
    { id: 2, icon: "📸" },
    { id: 3, icon: "📸" },
    { id: 4, icon: "📸" },
    { id: 5, icon: "📸" },
    { id: 6, icon: "📸" },
  ]); // Anggap pengguna sudah upload 6 foto

  // Validasi form
  const isFormValid =
    reason.trim() !== "" && videos.length >= 1 && photos.length >= 6;

  const handleSubmit = () => {
    if (!isFormValid) return;

    // Siapkan data pengembalian untuk dikirim ke App.js
    const returnData = {
      orderId: order.id,
      reason,
      videos: videos.map((v) => `dummy_video_${v.id}.mp4`), // Simpan sebagai string nama file dummy
      photos: photos.map((p) => `dummy_photo_${p.id}.jpg`),
    };

    onSubmitReturn(returnData);
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <p>Pesanan tidak ditemukan. Silakan kembali.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => setPage({ name: "pesanan" })}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-8 transition"
        >
          <ArrowLeft size={20} />
          Kembali ke Riwayat Pesanan
        </button>
        <div className="bg-white p-8 rounded-lg border">
          <h1 className="text-3xl font-bold text-black mb-2">
            Ajukan Pengembalian Barang
          </h1>
          <p className="text-gray-500 mb-6">Untuk Pesanan #{order.id}</p>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Alasan Pengembalian
              </label>
              <textarea
                id="reason"
                rows="5"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Jelaskan secara detail alasan Anda ingin mengembalikan barang..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-black focus:border-black"
              ></textarea>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">
                Bukti Video (Minimal 1)
              </h3>
              <div className="flex flex-wrap gap-4 p-4 border-2 border-dashed rounded-md">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="w-24 h-24 bg-gray-100 rounded-md flex flex-col items-center justify-center"
                  >
                    <span className="text-4xl">{video.icon}</span>
                    <span className="text-xs mt-1">Video {video.id}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">
                Bukti Foto (Minimal 6)
              </h3>
              <div className="flex flex-wrap gap-4 p-4 border-2 border-dashed rounded-md">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="w-24 h-24 bg-gray-100 rounded-md flex flex-col items-center justify-center"
                  >
                    <span className="text-4xl">{photo.icon}</span>
                    <span className="text-xs mt-1">Foto {photo.id}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-black text-white rounded-md font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-800"
              >
                <Send size={18} />
                Kirim Pengajuan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PengembalianBarang;
