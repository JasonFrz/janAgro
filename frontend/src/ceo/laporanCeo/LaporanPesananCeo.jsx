import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { X, ArrowLeft, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
import { fetchCeoReport } from "../../features/admin/adminSlice"; // Import action thunk

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { janAgroLogoBase64 } from "./logoBase64";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// --- Helper Component: Modal Detail ---
const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white text-black p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-black relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>
        <div className="border-b-2 border-black pb-4 mb-6">
          <h2 className="text-3xl font-bold">Detail Pesanan</h2>
          <p className="text-gray-600">ORDER #{order.id}</p>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-2">Informasi Pengiriman</h3>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-semibold">Nama:</span> {order.nama}
              </p>
              <p>
                <span className="font-semibold">Telepon:</span>
                {order.noTelpPenerima}
              </p>
              <p>
                <span className="font-semibold">Alamat:</span> {order.alamat}
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Item yang Dipesan</h3>
            <div className="divide-y divide-gray-200 border-y border-gray-200">
              {order.items.map((item) => (
                <div
                  key={item._id || item.product}
                  className="flex justify-between items-center py-3 text-sm"
                >
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-gray-500">
                      {item.quantity} x Rp {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <p className="font-semibold">
                    Rp {(item.quantity * item.price).toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Ringkasan Pembayaran</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>
                  Rp{" "}
                  {order.subtotal
                    ? order.subtotal.toLocaleString("id-ID")
                    : "-"}
                </span>
              </div>
              {order.diskon > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Diskon ({order.kodeVoucher}):
                  </span>
                  <span className="text-green-600">
                    - Rp {order.diskon.toLocaleString("id-ID")}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Biaya Kurir:</span>
                <span>
                  Rp{" "}
                  {order.kurir?.biaya
                    ? order.kurir.biaya.toLocaleString("id-ID")
                    : 0}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-black pt-2 mt-2">
                <span>Total Harga:</span>
                <span>Rp {order.totalHarga.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Metode Pembayaran:</span>
                <span className="font-semibold">{order.metodePembayaran}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Component: Section List ---
const LaporanSection = ({ title, orders, onOrderClick }) => (
  <div className="bg-white p-6 rounded-lg border border-black">
    <h2 className="text-xl font-bold mb-4 border-b border-black pb-2">
      {title}
    </h2>
    {orders.length > 0 ? (
      <div className="divide-y divide-gray-300">
        {orders.map((order) => (
          <button
            key={order.id}
            onClick={() => onOrderClick(order)}
            className="w-full text-left py-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-black">ORDER #{order.id}</p>
                <p className="text-sm text-gray-600">{order.nama}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-black">
                  Rp {order.totalHarga.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(order.tanggal).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 italic">
        Tidak ada pesanan pada kategori ini.
      </p>
    )}
  </div>
);

// --- Main Component ---
const LaporanPesananCeo = () => {
  const dispatch = useDispatch();

  // Mengambil data dari Redux store (ceoReportData), bukan dari props
  const { ceoReportData, loading } = useSelector((state) => state.admin);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [listYear, setListYear] = useState(new Date().getFullYear());
  const [listMonthStart, setListMonthStart] = useState(1);
  const [listMonthEnd, setListMonthEnd] = useState(12);
  const [chartYear, setChartYear] = useState(new Date().getFullYear());
  const [purchaseFilter, setPurchaseFilter] = useState("all");

  // Fetch data saat komponen dimuat
  useEffect(() => {
    // Kita mengirim object kosong {} agar backend mengembalikan semua data historis.
    // Ini memungkinkan filter tahun/bulan di frontend bekerja dinamis tanpa fetch ulang.
    dispatch(fetchCeoReport({}));
  }, [dispatch]);

  // Menggunakan ceoReportData sebagai sumber data
  const reportData = ceoReportData || [];

  // Mendapatkan list tahun unik dari data yang ada
  const years = useMemo(() => {
    const uniqueYears = new Set(
      reportData.map((c) => new Date(c.tanggal).getFullYear())
    );
    uniqueYears.add(new Date().getFullYear());
    return Array.from(uniqueYears).sort((a, b) => b - a);
  }, [reportData]);

  // Filter data untuk Daftar Pesanan (Tabel/List)
  const filteredCheckoutsForList = useMemo(() => {
    return reportData.filter((checkout) => {
      const checkoutDate = new Date(checkout.tanggal);
      const yearMatch = checkoutDate.getFullYear() === listYear;
      const startMonth = Math.min(listMonthStart, listMonthEnd);
      const endMonth = Math.max(listMonthStart, listMonthEnd);
      const monthMatch =
        checkoutDate.getMonth() + 1 >= startMonth &&
        checkoutDate.getMonth() + 1 <= endMonth;
      return yearMatch && monthMatch;
    });
  }, [reportData, listYear, listMonthStart, listMonthEnd]);

  // Filter data untuk Chart
  const chartData = useMemo(() => {
    const successfulPurchases = Array(12).fill(0);
    const failedPurchases = Array(12).fill(0);

    reportData.forEach((checkout) => {
      const checkoutDate = new Date(checkout.tanggal);
      if (checkoutDate.getFullYear() === chartYear) {
        const month = checkoutDate.getMonth();
        if (["selesai", "sampai"].includes(checkout.status)) {
          // Menambahkan 'sampai' sebagai sukses
          successfulPurchases[month] += 1;
        } else if (
          [
            "pengembalian berhasil",
            "pengembalian ditolak",
            "dibatalkan",
            "pembatalan diajukan",
          ].includes(checkout.status)
        ) {
          failedPurchases[month] += 1;
        }
      }
    });

    const datasets = [
      {
        label: "Pembelian Berhasil",
        data: successfulPurchases,
        backgroundColor: "rgba(34, 197, 94, 0.8)",
      },
      {
        label: "Pembelian Gagal/Batal",
        data: failedPurchases,
        backgroundColor: "rgba(239, 68, 68, 0.8)",
      },
    ];

    let filteredDatasets;
    if (purchaseFilter === "success") filteredDatasets = [datasets[0]];
    else if (purchaseFilter === "failed") filteredDatasets = [datasets[1]];
    else filteredDatasets = datasets;

    return {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ],
      datasets: filteredDatasets,
    };
  }, [reportData, chartYear, purchaseFilter]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "ID Pesanan",
      "Nama Pelanggan",
      "Tanggal",
      "Total Harga",
      "Status",
    ];
    const tableRows = [];

    filteredCheckoutsForList.forEach((order) => {
      const orderData = [
        `#${order.id.substring(0, 8)}`, // Memperpendek ID agar rapi
        order.nama,
        new Date(order.tanggal).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        `Rp ${order.totalHarga.toLocaleString("id-ID")}`,
        order.status.charAt(0).toUpperCase() + order.status.slice(1),
      ];
      tableRows.push(orderData);
    });

    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const fullDate = `${day}-${month}-${year}`;

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 42,
      margin: { top: 42 },
      theme: "grid",
      styles: { font: "helvetica", fontSize: 8, cellPadding: 2 },
      headStyles: {
        fillColor: [41, 41, 41],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      didDrawPage: function (data) {
        const logoWidth = 22;
        const logoHeight = 22;
        const margin = data.settings.margin.left;

        // Header Logo & Text
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
        } catch (e) {
          console.warn("Logo load failed", e);
        }

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("PT. Jan Agro Nusantara", margin + logoWidth + 5, 16);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(
          "Kantor Pusat JanAgro, Jl. Pondok Chandra Indah Gg. Durian, Surabaya, 60111",
          margin + logoWidth + 5,
          22
        );
        doc.text(
          "Email: janagronusantara@gmail.com | Telepon: (031) 123-4567",
          margin + logoWidth + 5,
          27
        );
        doc.setDrawColor(0, 0, 0);
        doc.line(
          margin,
          35,
          doc.internal.pageSize.getWidth() - data.settings.margin.right,
          35
        );

        // Footer Signature on last page
        if (data.pageNumber === doc.internal.getNumberOfPages()) {
          const pageHeight = doc.internal.pageSize.getHeight();
          const pageWidth = doc.internal.pageSize.getWidth();
          let finalY = data.cursor.y;
          if (finalY + 60 > pageHeight) {
            doc.addPage();
            finalY = data.settings.margin.top;
          }
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          const signatureX = pageWidth - data.settings.margin.right;
          doc.text(
            `Surabaya, ${new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}`,
            signatureX,
            finalY + 20,
            { align: "right" }
          );
          doc.setFont("helvetica", "bold");
          doc.text("J.Alamsjah,S.H", signatureX, finalY + 45, {
            align: "right",
          });
          const nameWidth = doc.getTextWidth("J.Alamsjah,S.H");
          doc.setLineWidth(0.5);
          doc.line(
            signatureX - nameWidth,
            finalY + 46,
            signatureX,
            finalY + 46
          );
          doc.setFont("helvetica", "normal");
          doc.text(
            "Ceo & Founder of Jan Agro Nusantara",
            signatureX,
            finalY + 55,
            { align: "right" }
          );
        }
      },
    });
    doc.save(`laporan_pesanan_janagronusantara_${fullDate}.pdf`);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Total Transaksi per Bulan - ${chartYear}`,
        font: { size: 18 },
      },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  return (
    <>
      <div className="bg-white min-h-screen pt-24 text-black">
        <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 pb-12">
          {/* Header */}
          <header className="flex justify-between items-center border-b-2 border-black pb-4">
            <div>
              <h1 className="text-4xl font-bold">Laporan Pesanan</h1>
              <p className="text-gray-600 mt-1">
                Analisis dan rekapitulasi data pesanan.
              </p>
            </div>
            <Link
              to="/ceo"
              className="bg-black text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-800 transition-colors duration-200"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Kembali ke Ceo
            </Link>
          </header>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-black border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Memuat data laporan...</p>
            </div>
          ) : (
            <>
              {/* Chart Section */}
              <div className="bg-white p-6 rounded-lg border border-black space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">
                    Filter Diagram Pembelian
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <select
                      value={chartYear}
                      onChange={(e) => setChartYear(parseInt(e.target.value))}
                      className="w-full sm:w-auto bg-white border border-black rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <select
                      value={purchaseFilter}
                      onChange={(e) => setPurchaseFilter(e.target.value)}
                      className="w-full sm:w-auto bg-white border border-black rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="all">Semua Pembelian</option>
                      <option value="success">Pembelian Berhasil</option>
                      <option value="failed">Pembelian Gagal</option>
                    </select>
                  </div>
                </div>
                <div className="h-96 relative">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>

              {/* List Filter Section */}
              <div className="bg-white border border-black p-6 rounded-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <h2 className="text-xl font-bold mb-4 sm:mb-0">
                    Filter Daftar Pesanan
                  </h2>
                  <button
                    onClick={handleExportPDF}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors duration-200"
                  >
                    <FileText className="mr-2 h-5 w-5" /> Export PDF
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-center mt-4">
                  <select
                    value={listYear}
                    onChange={(e) => setListYear(parseInt(e.target.value))}
                    className="w-full sm:w-auto bg-white border border-black rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <select
                    value={listMonthStart}
                    onChange={(e) =>
                      setListMonthStart(parseInt(e.target.value))
                    }
                    className="w-full sm:w-auto bg-white border border-black rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString("id-ID", {
                          month: "long",
                        })}
                      </option>
                    ))}
                  </select>
                  <span className="text-gray-600">sampai</span>
                  <select
                    value={listMonthEnd}
                    onChange={(e) => setListMonthEnd(parseInt(e.target.value))}
                    className="w-full sm:w-auto bg-white border border-black rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString("id-ID", {
                          month: "long",
                        })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Details Grid */}
              <div className="border-t-2 border-black pt-8">
                <h2 className="text-3xl font-bold mb-6">
                  Detail Pesanan per Status
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <LaporanSection
                    title="Pesanan Diproses"
                    orders={filteredCheckoutsForList.filter(
                      (o) => o.status === "diproses"
                    )}
                    onOrderClick={setSelectedOrder}
                  />
                  <LaporanSection
                    title="Pesanan Dikirim"
                    orders={filteredCheckoutsForList.filter(
                      (o) => o.status === "dikirim"
                    )}
                    onOrderClick={setSelectedOrder}
                  />
                  <LaporanSection
                    title="Pesanan Selesai"
                    orders={filteredCheckoutsForList.filter((o) =>
                      ["selesai", "sampai"].includes(o.status)
                    )}
                    onOrderClick={setSelectedOrder}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
};

export default LaporanPesananCeo;
