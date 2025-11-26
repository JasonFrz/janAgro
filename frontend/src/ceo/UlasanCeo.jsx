import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllReviews } from "../features/admin/adminSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { janAgroLogoBase64 } from "././laporanCeo/logoBase64"; 
import { 
  Star, 
  MessageSquare, 
  Search, 
  PlayCircle,
  FileText,
  Calendar
} from "lucide-react";

const StarRating = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={14}
        className={index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
      />
    ))}
  </div>
);

const UlasanCeo = () => {
  const dispatch = useDispatch();
  const { reviews, loading } = useSelector((state) => state.admin);

  const [ratingFilter, setRatingFilter] = useState(0); 
  const [mediaFilter, setMediaFilter] = useState("all"); 
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    dispatch(fetchAllReviews());
  }, [dispatch]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchRating = ratingFilter === 0 || r.rating === ratingFilter;
      
      const hasMedia = r.media && r.media.length > 0;
      const matchMedia = 
        mediaFilter === "all" || 
        (mediaFilter === "with-media" && hasMedia) || 
        (mediaFilter === "text-only" && !hasMedia);

      const searchLower = searchTerm.toLowerCase();
      const matchSearch = 
        (r.user?.name || "").toLowerCase().includes(searchLower) ||
        (r.product?.name || "").toLowerCase().includes(searchLower) ||
        (r.comment || "").toLowerCase().includes(searchLower);

      let matchDate = true;
      if (startDate || endDate) {
        const reviewDate = new Date(r.createdAt);
        const start = startDate ? new Date(startDate) : new Date("1970-01-01");
        const end = endDate ? new Date(endDate) : new Date();
        end.setHours(23, 59, 59, 999);
        matchDate = reviewDate >= start && reviewDate <= end;
      }

      return matchRating && matchMedia && matchSearch && matchDate;
    });
  }, [reviews, ratingFilter, mediaFilter, searchTerm, startDate, endDate]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    const tableColumn = [
      "No",
      "Tanggal",
      "Nama Pelanggan",
      "Produk",
      "Kategori", 
      "Harga",    
      "Rating",
      "Komentar",
    ];

    const tableRows = [];

    filteredReviews.forEach((review, index) => {
      const category = review.product?.category || "-";
      const price = review.product?.price 
        ? `Rp ${review.product.price.toLocaleString("id-ID")}` 
        : "-";

      const rowData = [
        index + 1,
        new Date(review.createdAt).toLocaleDateString("id-ID", {
          day: "2-digit", month: "short", year: "2-digit",
        }),
        review.user?.name || "Anonymous",
        review.product?.name || "Produk Dihapus",
        category, 
        price,    
        `${review.rating}`,
        review.comment || "-",
      ];
      tableRows.push(rowData);
    });

    const dateNow = new Date();
    const dateString = dateNow.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    const fullDateFile = `${dateNow.getDate()}-${dateNow.getMonth() + 1}-${dateNow.getFullYear()}`;

    let filterInfoParts = [];
    if (ratingFilter > 0) filterInfoParts.push(`Rating: ${ratingFilter}`);
    if (mediaFilter !== 'all') filterInfoParts.push(`Media: ${mediaFilter === 'with-media' ? 'Foto/Video' : 'Teks'}`);
    if (startDate || endDate) {
        const s = startDate ? new Date(startDate).toLocaleDateString('id-ID') : 'Awal';
        const e = endDate ? new Date(endDate).toLocaleDateString('id-ID') : 'Sekarang';
        filterInfoParts.push(`${s} - ${e}`);
    }
    const filterText = filterInfoParts.length > 0 ? `Filter: ${filterInfoParts.join(" | ")}` : "Filter: Semua Data";

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      margin: { top: 50, left: 10, right: 10 },
      theme: "grid",
      styles: { 
        font: "helvetica", 
        fontSize: 7, 
        cellPadding: 2, 
        valign: 'middle', 
        textColor: [0, 0, 0] 
      },
      headStyles: { 
        fillColor: [20, 20, 20], 
        textColor: [255, 255, 255], 
        fontStyle: "bold",
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center' },  
        1: { cellWidth: 18, halign: 'center' }, 
        2: { cellWidth: 25 },                   
        3: { cellWidth: 30 },                   
        4: { cellWidth: 18, halign: 'center' }, 
        5: { cellWidth: 22, halign: 'right' }, 
        6: { cellWidth: 15, halign: 'center' }, 
        7: { cellWidth: 'auto' },               
      },
      didDrawPage: function (data) {
        const logoWidth = 22; const logoHeight = 22;
        const margin = data.settings.margin.left;

        try { doc.addImage(janAgroLogoBase64, "JPEG", margin, 10, logoWidth, logoHeight, undefined, "FAST"); } catch (e) {}

        doc.setFontSize(14); doc.setFont("helvetica", "bold");
        doc.text("PT. Jan Agro Nusantara", margin + logoWidth + 5, 16);
        
        doc.setFontSize(10);
        doc.text("Laporan Ulasan Pelanggan (Feedback)", margin + logoWidth + 5, 22);
        
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.text(filterText, margin + logoWidth + 5, 28); 

        doc.setDrawColor(0, 0, 0); doc.setLineWidth(1);
        doc.line(margin, 35, doc.internal.pageSize.getWidth() - data.settings.margin.right, 35);

        if (data.pageNumber === doc.internal.getNumberOfPages()) {
          const pageHeight = doc.internal.pageSize.getHeight();
          const pageWidth = doc.internal.pageSize.getWidth();
          let finalY = data.cursor.y + 10;
          if (finalY + 40 > pageHeight) { doc.addPage(); finalY = 40; }

          doc.setFontSize(10); doc.setFont("helvetica", "normal");
          const signatureX = pageWidth - data.settings.margin.right;
          doc.text(`Surabaya, ${dateString}`, signatureX, finalY, { align: "right" });
          doc.setFont("helvetica", "bold");
          doc.text("J.Alamsjah,S.H", signatureX, finalY + 25, { align: "right" });
          const nameWidth = doc.getTextWidth("J.Alamsjah,S.H");
          doc.setLineWidth(0.5);
          doc.line(signatureX - nameWidth, finalY + 26, signatureX, finalY + 26);
          doc.setFont("helvetica", "normal");
          doc.text("Ceo & Founder", signatureX, finalY + 32, { align: "right" });
        }
      },
    });

    doc.save(`laporan_ulasan_${fullDateFile}.pdf`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b-2 border-black">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight">Customer Reviews</h1>
          <p className="text-gray-600 font-medium mt-1">Monitor feedback dan kepuasan pelanggan.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportPDF} className="bg-white text-black border-2 border-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-100 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
            <FileText size={20} /> <span>Export PDF</span>
          </button>
          <div className="bg-black text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg">
            <MessageSquare size={20} /> <span>Total: {filteredReviews.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-black p-6 rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <label className="text-xs font-bold uppercase mb-2 block">Cari Review</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Nama user, produk, atau isi ulasan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-black rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-1">
             <label className="text-xs font-bold uppercase mb-2 block flex items-center gap-1">
                <Calendar size={14}/> Rentang Tanggal
             </label>
             <div className="flex gap-2">
                <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-2 py-2.5 border-2 border-black rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
                />
                <span className="self-center">-</span>
                <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-2 py-2.5 border-2 border-black rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
                />
             </div>
          </div>

          <div className="col-span-1">
            <label className="text-xs font-bold uppercase mb-2 block">Filter Rating</label>
            <div className="flex gap-1 flex-wrap">
              {[0, 5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  onClick={() => setRatingFilter(star)}
                  className={`px-3 py-2 rounded-md text-sm font-bold border-2 transition-all ${
                    ratingFilter === star 
                      ? "bg-black text-white border-black" 
                      : "bg-white text-gray-600 border-gray-300 hover:border-black"
                  }`}
                >
                  {star === 0 ? "All" : <span className="flex items-center gap-1">{star} <Star size={12} fill="currentColor" className="text-yellow-400"/></span>}
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-1">
            <label className="text-xs font-bold uppercase mb-2 block">Tipe Konten</label>
            <select
              value={mediaFilter}
              onChange={(e) => setMediaFilter(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-black rounded-md font-bold focus:outline-none"
            >
              <option value="all">Semua</option>
              <option value="with-media">Dengan Foto/Video</option>
              <option value="text-only">Hanya Teks</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 font-bold italic text-gray-500">Memuat ulasan...</div>
      ) : (
        <div className="bg-gray-50 border-2 border-black rounded-lg p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="overflow-y-auto max-h-[550px] pr-2 space-y-4 custom-scrollbar">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <div key={review._id} className="bg-white border-2 border-black rounded-lg p-6 shadow-sm hover:border-gray-500 transition-all duration-200">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4 border-b-2 md:border-b-0 md:border-r-2 border-gray-100 pb-4 md:pb-0 md:pr-6">
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 border-2 border-black rounded overflow-hidden bg-gray-100 flex-shrink-0">
                          {review.product?.image ? (
                            <img src={review.product.image} alt={review.product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-xs font-bold text-gray-400">No IMG</div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="inline-block bg-gray-200 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-300 uppercase w-fit mb-1">
                            {review.product?.category || "UMUM"}
                          </span>
                          <h3 className="font-bold text-sm leading-tight line-clamp-2 mb-1">
                            {review.product?.name || "Produk Dihapus"}
                          </h3>
                          <p className="text-xs font-mono font-bold text-gray-800">
                            {review.product?.price ? `Rp ${review.product.price.toLocaleString('id-ID')}` : "Harga -"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm overflow-hidden border-2 border-black">
                            {review.user?.avatar ? (
                              <img src={review.user.avatar} alt="user" className="w-full h-full object-cover" />
                            ) : (
                              review.user?.name?.charAt(0) || "U"
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{review.user?.name || "Anonymous"}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(review.createdAt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                            </p>
                          </div>
                        </div>
                        <div className="bg-gray-100 px-3 py-1 rounded border border-black">
                          <StarRating rating={review.rating} />
                        </div>
                      </div>

                      <p className="text-gray-800 font-medium leading-relaxed mb-4 min-h-[40px]">
                        "{review.comment}"
                      </p>

                      {review.media && review.media.length > 0 && (
                        <div className="flex gap-3 overflow-x-auto pb-2">
                          {review.media.map((m, idx) => (
                            <div key={idx} className="relative w-24 h-24 flex-shrink-0 border-2 border-black rounded-md overflow-hidden bg-black group cursor-pointer">
                              {m.type === 'video' ? (
                                <>
                                  <video src={m.url} className="w-full h-full object-cover opacity-80" />
                                  <div className="absolute inset-0 flex items-center justify-center text-white">
                                    <PlayCircle size={24} fill="black" />
                                  </div>
                                </>
                              ) : (
                                <a href={m.url} target="_blank" rel="noopener noreferrer">
                                  <img src={m.url} alt="review" className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-black rounded-lg bg-white">
                <p className="font-bold text-gray-500">Tidak ada ulasan yang sesuai filter.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UlasanCeo;