import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Star, ArrowLeft, Camera, Image as ImageIcon } from "lucide-react";

const Review = ({ product, onAddReview }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const navigate = useNavigate(); 

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = (capture) => {
    if (capture) {
      fileInputRef.current.setAttribute("capture", capture);
    } else {
      fileInputRef.current.removeAttribute("capture");
    }
    fileInputRef.current.click();
  };

  const handleSubmit = () => {
    if (rating === 0) {
      setError("Rating bintang wajib diisi.");
      return;
    }
    onAddReview({
      productId: product._id,
      rating,
      comment,
      imageUrl: imagePreview,
    });
    alert("Terima kasih atas ulasan Anda!");
    navigate("/pesanan"); 
  };

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate("/pesanan")}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-8 transition"
        >
          <ArrowLeft size={20} />
          Kembali ke Pesanan
        </button>
        <div className="bg-white p-8 rounded-lg border border-gray-200">
          <h1 className="text-3xl font-bold text-black mb-2">Beri Ulasan</h1>
          <p className="text-gray-500 mb-6">
            {" "}
            Bagikan pendapat Anda tentang produk ini.{" "}
          </p>
          <div className="flex gap-4 items-center border-b pb-6 mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center text-4xl flex-shrink-0">
              {" "}
              {product.image}{" "}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{product.category}</p>
              <p className="font-bold text-lg text-black">{product.name}</p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {" "}
                Kualitas Produk (Wajib){" "}
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <Star
                      size={32}
                      className={`transition-colors ${
                        (hoverRating || rating) >= star
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {" "}
                Ulasan Anda (Opsional){" "}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-black"
                rows="4"
                placeholder="Bagaimana kualitas produk ini? Apakah sesuai dengan deskripsi?"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {" "}
                Tambah Foto (Opsional){" "}
              </label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 border-2 border-dashed rounded-md flex items-center justify-center bg-gray-50">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <ImageIcon className="text-gray-400" />
                  )}
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => triggerFileInput("environment")}
                    className="flex items-center gap-2 text-sm w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors"
                  >
                    {" "}
                    <Camera size={16} /> Buka Kamera{" "}
                  </button>
                  <button
                    onClick={() => triggerFileInput(null)}
                    className="flex items-center gap-2 text-sm w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors"
                  >
                    {" "}
                    <ImageIcon size={16} /> Pilih dari Galeri{" "}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              onClick={handleSubmit}
              className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              {" "}
              Kirim Ulasan{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
