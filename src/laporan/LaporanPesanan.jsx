import React, { useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { X, ArrowLeft } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
                <span className="font-semibold">Telepon:</span>{" "}
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
                  key={item._id}
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
                <span className="text-gray-600">Subtotal:</span>{" "}
                <span>Rp {order.subtotal.toLocaleString("id-ID")}</span>
              </div>
              {order.diskon > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Diskon ({order.kodeVoucher}):
                  </span>{" "}
                  <span className="text-green-600">
                    - Rp {order.diskon.toLocaleString("id-ID")}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Biaya Kurir:</span>{" "}
                <span>Rp {order.kurir.biaya.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-black pt-2 mt-2">
                <span>Total Harga:</span>{" "}
                <span>Rp {order.totalHarga.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Metode Pembayaran:</span>{" "}
                <span className="font-semibold">{order.metodePembayaran}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
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

const LaporanPesanan = ({ checkouts = [], setPage }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [listYear, setListYear] = useState(new Date().getFullYear());
  const [listMonth, setListMonth] = useState("all");
  const [chartYear, setChartYear] = useState(new Date().getFullYear());
  const [purchaseFilter, setPurchaseFilter] = useState("all");

  const years = useMemo(() => {
    const uniqueYears = new Set(
      checkouts.map((c) => new Date(c.tanggal).getFullYear())
    );
    uniqueYears.add(new Date().getFullYear());
    return Array.from(uniqueYears).sort((a, b) => b - a);
  }, [checkouts]);
  const filteredCheckoutsForList = useMemo(() => {
    return checkouts.filter((checkout) => {
      const checkoutDate = new Date(checkout.tanggal);
      const yearMatch = checkoutDate.getFullYear() === listYear;
      const monthMatch =
        listMonth === "all" ||
        checkoutDate.getMonth() + 1 === parseInt(listMonth);
      return yearMatch && monthMatch;
    });
  }, [checkouts, listYear, listMonth]);

  const chartData = useMemo(() => {
    const successfulPurchases = Array(12).fill(0);
    const failedPurchases = Array(12).fill(0);
    checkouts.forEach((checkout) => {
      const checkoutDate = new Date(checkout.tanggal);
      if (checkoutDate.getFullYear() === chartYear) {
        const month = checkoutDate.getMonth();
        if (checkout.status === "selesai") {
          successfulPurchases[month] += 1;
        } else if (
          [
            "pengembalian berhasil",
            "pengembalian ditolak",
            "dibatalkan",
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
        borderColor: "rgba(22, 163, 74, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: "Pembelian Gagal",
        data: failedPurchases,
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderColor: "rgba(220, 38, 38, 1)",
        borderWidth: 1,
        borderRadius: 4,
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
  }, [checkouts, chartYear, purchaseFilter]);

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
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: (value) =>
            Number.isInteger(value) ? `${value} Pembelian` : "",
        },
      },
    },
  };

  return (
    <>
      <div className="bg-white min-h-screen pt-24 text-black">
        <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 pb-12">
          <header className="flex justify-between items-center border-b-2 border-black pb-4">
            <div>
              <h1 className="text-4xl font-bold">Laporan Pesanan</h1>
              <p className="text-gray-600 mt-1">
                Analisis dan rekapitulasi data pesanan.
              </p>
            </div>
            <button
              onClick={() => setPage({ name: "admin", id: null })}
              className="bg-black text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-800 transition-colors duration-200"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Kembali ke Admin
            </button>
          </header>
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
          <div className="bg-white border border-black p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Filter Daftar Pesanan</h2>
            <div className="flex flex-col sm:flex-row gap-4">
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
                value={listMonth}
                onChange={(e) => setListMonth(e.target.value)}
                className="w-full sm:w-auto bg-white border border-black rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="all">Semua Bulan</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>
          </div>
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
                title="Pesanan Tiba"
                orders={filteredCheckoutsForList.filter(
                  (o) => o.status === "sampai"
                )}
                onOrderClick={setSelectedOrder}
              />
            </div>
          </div>
        </div>
      </div>
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
};

export default LaporanPesanan;
