import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllReviews } from "../features/admin/adminSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { janAgroLogoBase64 } from "./laporanCeo/logoBase64";
import {
  Star,
  MessageSquare,
  Search,
  PlayCircle,
  FileText,
  Calendar,
  Filter,
} from "lucide-react";

const StarRating = ({ rating }) => (
  <div className="flex items-center shrink-0">
    {[...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={14}
        className={
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }
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
          day: "2-digit",
          month: "short",
          year: "2-digit",
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

    const fullDateFile = `${new Date().getDate()}-${
      new Date().getMonth() + 1
    }-${new Date().getFullYear()}`;

    // Construct Filter Text
    let filterInfoParts = [];
    if (ratingFilter > 0) filterInfoParts.push(`Rating: ${ratingFilter}`);
    if (mediaFilter !== "all")
      filterInfoParts.push(
        `Media: ${mediaFilter === "with-media" ? "Foto/Video" : "Teks"}`
      );
    if (startDate || endDate) {
      const s = startDate
        ? new Date(startDate).toLocaleDateString("id-ID")
        : "Awal";
      const e = endDate
        ? new Date(endDate).toLocaleDateString("id-ID")
        : "Sekarang";
      filterInfoParts.push(`${s} - ${e}`);
    }
    const filterText =
      filterInfoParts.length > 0
        ? `Filter: ${filterInfoParts.join(" | ")}`
        : "Filter: Semua Data";

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
        valign: "middle",
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [20, 20, 20],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 8, halign: "center" },
        1: { cellWidth: 18, halign: "center" },
        2: { cellWidth: 25 },
        3: { cellWidth: 30 },
        4: { cellWidth: 18, halign: "center" },
        5: { cellWidth: 22, halign: "right" },
        6: { cellWidth: 15, halign: "center" },
        7: { cellWidth: "auto" },
      },
      didDrawPage: function (data) {
        const logoWidth = 22;
        const logoHeight = 22;
        const margin = data.settings.margin.left;
        const pageWidth = doc.internal.pageSize.getWidth();
        const textX = margin + logoWidth + 5;

        try {
          doc.addImage(
            janAgroLogoBase64,
            "JPEG",
            margin,
            10,
            logoWidth,
            logoHeight,
            undefined,
            "FAST"
          );
        } catch (e) {}

        doc.setFontSize(14).setFont("helvetica", "bold");
        doc.text("PT. Jan Agro Nusantara", textX, 15);

        doc.setFontSize(10);
        doc.text("Laporan Ulasan Pelanggan (Feedback)", textX, 20);

        doc.setFontSize(8).setFont("helvetica", "normal");
        doc.text(
          "Jan Agro Nusantara Indonesia Pondok Chandra Indah No. 69 Surabaya 10130",
          textX,
          24
        );
        doc.text(
          "Email: janagronusantara@gmail.com | Contact Person: +62 811 762 788",
          textX,
          28
        );

        doc.setFontSize(8).setFont("helvetica", "italic");
        doc.text(filterText, textX, 32);

        doc.setDrawColor(0, 0, 0).setLineWidth(1);
        doc.line(margin, 36, pageWidth - data.settings.margin.right, 36);

        if (data.pageNumber === doc.internal.getNumberOfPages()) {
          const pageHeight = doc.internal.pageSize.getHeight();
          let finalY = data.cursor.y + 15;
          if (finalY + 40 > pageHeight) {
            doc.addPage();
            finalY = 40;
          }

          const signatureX = pageWidth - data.settings.margin.right;
          const currentDate = new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          doc.setFontSize(10).setFont("helvetica", "normal");
          doc.text(`Surabaya, ${currentDate}`, signatureX, finalY, {
            align: "right",
          });
          doc.setFont("helvetica", "bold");
          doc.text("J.Alamsjah, S.H", signatureX, finalY + 20, {
            align: "right",
          });
          doc.setLineWidth(0.5);
          doc.line(
            signatureX - doc.getTextWidth("J.Alamsjah, S.H"),
            finalY + 21,
            signatureX,
            finalY + 21
          );
          doc.setFont("helvetica", "normal").setFontSize(9);
          doc.text("Ceo & Founder", signatureX, finalY + 25, {
            align: "right",
          });
        }
      },
    });
    doc.save(`laporan_ulasan_${fullDateFile}.pdf`);
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden p-1">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b-2 border-black">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-gray-900">
            Customer Reviews
          </h1>
          <p className="text-sm sm:text-base text-gray-600 font-medium mt-1">
            Monitor feedback dan kepuasan pelanggan secara real-time.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <button
            onClick={handleExportPDF}
            className="flex-1 lg:flex-none bg-green-600 text-white border-2 border-black px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            <FileText size={18} /> <span className="whitespace-nowrap">Export PDF</span>
          </button>
          <div className="flex-1 lg:flex-none bg-black text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg">
            <MessageSquare size={18} />
            <span className="whitespace-nowrap">Total: {filteredReviews.length}</span>
          </div>
        </div>
      </div>

      {/* FILTER SECTION */}
      <div className="bg-white border-2 border-black p-4 sm:p-5 rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          
          {/* SEARCH */}
          <div className="col-span-1 sm:col-span-2 xl:col-span-1">
            <label className="text-xs font-bold uppercase mb-1.5 block text-gray-700">
              Cari Review
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="User, produk, atau komentar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border-2 border-black rounded-md font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black transition-shadow"
              />
            </div>
          </div>

          {/* DATE RANGE */}
          <div className="col-span-1 sm:col-span-2 xl:col-span-1">
            <label className="text-xs font-bold uppercase mb-1.5 block flex items-center gap-1 text-gray-700">
              <Calendar size={14} /> Rentang Tanggal
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2 py-2 border-2 border-black rounded-md text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-2 py-2 border-2 border-black rounded-md text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* RATING */}
          <div className="col-span-1">
            <label className="text-xs font-bold uppercase mb-1.5 block text-gray-700">
              Filter Rating
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[0, 5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  onClick={() => setRatingFilter(star)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold border-2 transition-all ${
                    ratingFilter === star
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-600 border-gray-300 hover:border-black"
                  }`}
                >
                  {star === 0 ? "All" : <span className="flex items-center gap-1">{star} <Star size={10} fill="currentColor" /></span>}
                </button>
              ))}
            </div>
          </div>

          {/* MEDIA TYPE */}
          <div className="col-span-1">
            <label className="text-xs font-bold uppercase mb-1.5 block text-gray-700">
              Tipe Konten
            </label>
            <div className="relative">
                <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"/>
                <select
                value={mediaFilter}
                onChange={(e) => setMediaFilter(e.target.value)}
                className="w-full pl-9 pr-8 py-2 border-2 border-black rounded-md text-sm font-bold focus:outline-none cursor-pointer appearance-none bg-white"
                >
                <option value="all">Semua Tipe</option>
                <option value="with-media">Dengan Foto/Video</option>
                <option value="text-only">Hanya Teks</option>
                </select>
                {/* Custom Arrow */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* REVIEWS LIST */}
      {loading ? (
        <div className="text-center py-20 font-bold italic text-gray-500 animate-pulse">
          Memuat ulasan...
        </div>
      ) : (
        <div className="bg-gray-100 border-2 border-black rounded-lg p-2 sm:p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="overflow-y-auto max-h-[600px] pr-1 sm:pr-2 space-y-3 custom-scrollbar">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white border-2 border-black rounded-lg p-4 shadow-sm hover:border-gray-500 transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                    
                    {/* LEFT: PRODUCT INFO */}
                    <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-row lg:flex-col items-start gap-3 lg:gap-4 border-b-2 lg:border-b-0 lg:border-r-2 border-gray-100 pb-3 lg:pb-0 lg:pr-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-full lg:h-40 border-2 border-black rounded overflow-hidden bg-gray-50 flex-shrink-0">
                        {review.product?.image ? (
                          <img
                            src={review.product.image}
                            alt={review.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-xs font-bold text-gray-400">No IMG</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="inline-block bg-gray-200 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-300 uppercase mb-1">
                          {review.product?.category || "UMUM"}
                        </span>
                        <h3 className="font-bold text-sm sm:text-base leading-tight line-clamp-2 mb-1" title={review.product?.name}>
                          {review.product?.name || "Produk Dihapus"}
                        </h3>
                        <p className="text-xs sm:text-sm font-mono font-bold text-gray-800">
                          {review.product?.price
                            ? `Rp ${review.product.price.toLocaleString("id-ID")}`
                            : "Harga -"}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT: REVIEW CONTENT */}
                    <div className="flex-1 min-w-0">
                      {/* User Header */}
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm overflow-hidden border-2 border-black flex-shrink-0">
                            {review.user?.avatar ? (
                              <img src={review.user.avatar} alt="user" className="w-full h-full object-cover" />
                            ) : (
                              review.user?.name?.charAt(0) || "U"
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm truncate max-w-[150px] sm:max-w-xs">{review.user?.name || "Anonymous"}</p>
                            <p className="text-[10px] sm:text-xs text-gray-500">
                              {new Date(review.createdAt).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" })}
                            </p>
                          </div>
                        </div>
                        <div className="bg-white px-2 py-1 rounded border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                          <StarRating rating={review.rating} />
                        </div>
                      </div>

                      {/* Comment */}
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mb-3">
                        <p className="text-gray-800 text-sm sm:text-base font-medium leading-relaxed break-words">
                          "{review.comment}"
                        </p>
                      </div>

                      {/* Media Gallery */}
                      {review.media && review.media.length > 0 && (
                        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 custom-scrollbar">
                          {review.media.map((m, idx) => (
                            <div
                              key={idx}
                              className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 border-2 border-black rounded-md overflow-hidden bg-black group"
                            >
                              {m.type === "video" ? (
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
              <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-300 rounded-lg bg-white text-gray-400">
                <Search size={48} className="mb-2 opacity-20" />
                <p className="font-bold text-sm">Tidak ada ulasan yang sesuai filter.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UlasanCeo;