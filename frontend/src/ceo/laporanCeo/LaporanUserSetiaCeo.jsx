import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, User, ShoppingBag, Calendar, DollarSign, FileText } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLoyalUsersReport } from "../../features/admin/adminSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { janAgroLogoBase64 } from "./logoBase64"; 

const LaporanUserSetiaCeo = () => {
  const dispatch = useDispatch();
  const { loyalUsersData, loading } = useSelector((state) => state.admin);
  const [expandedUser, setExpandedUser] = useState(null);

  useEffect(() => {
    dispatch(fetchLoyalUsersReport());
  }, [dispatch]);

  const toggleExpand = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Peringkat", "Nama Pelanggan", "Total Belanja", "Frekuensi Order", "Barang Sering Dibeli"];
    const tableRows = [];

    loyalUsersData.forEach((user, index) => {
      const uniqueItems = [...new Set(user.allItems.map(item => item.name))].slice(0, 5).join(", ");
      
      const rowData = [
        index + 1,
        user.name,
        `Rp ${user.totalSpent.toLocaleString("id-ID")}`,
        `${user.orderCount}x`,
        uniqueItems + (user.allItems.length > 5 ? "..." : "")
      ];
      tableRows.push(rowData);
    });

    const date = new Date();
    const fullDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      margin: { top: 45 },
      theme: "grid",
      styles: { font: "helvetica", fontSize: 9, cellPadding: 3, textColor: [0,0,0] },
      headStyles: { fillColor: [20, 20, 20], textColor: [255, 255, 255], fontStyle: "bold" },
      didDrawPage: function (data) {
        const logoWidth = 22; const logoHeight = 22;
        const margin = data.settings.margin.left;
        try { doc.addImage(janAgroLogoBase64, "JPEG", margin, 10, logoWidth, logoHeight, undefined, "FAST"); } catch (e) {}

        doc.setFontSize(14); doc.setFont("helvetica", "bold");
        doc.text("PT. Jan Agro Nusantara", margin + logoWidth + 5, 16);
        doc.setFontSize(10);
        doc.text(`Laporan Pelanggan Setia (Top Spenders)`, margin + logoWidth + 5, 22);
        
        doc.setDrawColor(0, 0, 0); doc.setLineWidth(1);
        doc.line(margin, 35, doc.internal.pageSize.getWidth() - data.settings.margin.right, 35);
      },
    });
    doc.save(`laporan_user_setia_${fullDate}.pdf`);
  };

  const groupItems = (items) => {
    const grouped = {};
    items.forEach(item => {
        if (grouped[item.name]) {
            grouped[item.name].quantity += item.quantity;
            grouped[item.name].totalPrice += (item.price * item.quantity);
        } else {
            grouped[item.name] = {
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.image,
                totalPrice: item.price * item.quantity
            };
        }
    });
    return Object.values(grouped).sort((a, b) => b.quantity - a.quantity); // Sort by quantity
  };

  return (
    <div className="bg-white min-h-screen pt-24 text-black font-sans pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-4 border-black pb-4 gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight">Top Loyal Customers</h1>
            <p className="text-gray-600 font-medium mt-1">Pelanggan dengan total belanja & frekuensi tertinggi.</p>
          </div>
          <div className="flex gap-3">
             <button
                onClick={handleExportPDF}
                className="flex items-center bg-white text-black border-2 border-black px-5 py-2.5 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
            >
                <FileText className="mr-2 h-5 w-5" /> EXPORT PDF
            </button>
            <Link
                to="/ceo"
                className="flex items-center bg-black text-white px-5 py-2.5 rounded-lg font-bold hover:bg-gray-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
            >
                <ArrowLeft className="mr-2 h-5 w-5" /> KEMBALI
            </Link>
          </div>
        </header>

        {loading ? (
             <div className="flex justify-center items-center h-64 border-2 border-black rounded-lg bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
             </div>
        ) : (
            <div className="space-y-6">
                {loyalUsersData.map((user, index) => (
                    <div key={user._id} className="border-2 border-black rounded-lg overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1">
                        <div 
                            className="p-6 bg-white flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer hover:bg-gray-50"
                            onClick={() => toggleExpand(user._id)}
                        >
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className={`flex-shrink-0 h-16 w-16 rounded-full border-2 border-black flex items-center justify-center text-xl font-black ${index < 3 ? 'bg-yellow-400' : 'bg-gray-200'}`}>
                                    #{index + 1}
                                </div>
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="h-16 w-16 rounded-full border-2 border-black object-cover" />
                                ) : (
                                    <div className="h-16 w-16 rounded-full border-2 border-black bg-black text-white flex items-center justify-center">
                                        <User size={32} />
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-xl font-black uppercase">{user.name}</h3>
                                    <p className="text-gray-500 font-medium text-sm">@{user.username} | {user.email}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 md:gap-8 w-full md:w-auto justify-start md:justify-end">
                                <div className="text-center min-w-[100px]">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Total Belanja</p>
                                    <p className="text-xl font-black flex items-center justify-center gap-1">
                                        <DollarSign size={18} className="text-green-600"/>
                                        Rp {user.totalSpent.toLocaleString('id-ID')}
                                    </p>
                                </div>
                                <div className="text-center min-w-[80px]">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Frekuensi</p>
                                    <p className="text-xl font-black flex items-center justify-center gap-1">
                                        <ShoppingBag size={18} />
                                        {user.orderCount}x
                                    </p>
                                </div>
                                <div className="text-center min-w-[120px] hidden sm:block">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Terakhir Order</p>
                                    <p className="text-lg font-bold flex items-center justify-center gap-1">
                                        <Calendar size={16} />
                                        {new Date(user.lastOrderDate).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: '2-digit'})}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {expandedUser === user._id && (
                            <div className="bg-gray-100 border-t-2 border-black p-6 animate-fade-in">
                                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <ShoppingBag className="text-black" size={20}/> Riwayat Barang yang Dibeli
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {groupItems(user.allItems).map((item, i) => (
                                        <div key={i} className="bg-white border border-black p-3 rounded flex items-center gap-3 shadow-sm">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover border border-gray-300 rounded" />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">No IMG</div>
                                            )}
                                            <div className="overflow-hidden">
                                                <p className="font-bold text-sm truncate" title={item.name}>{item.name}</p>
                                                <div className="flex justify-between items-center text-xs text-gray-600 mt-1">
                                                    <span className="bg-black text-white px-1.5 rounded font-bold">{item.quantity}x</span>
                                                    <span>Rp {item.totalPrice.toLocaleString('id-ID')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default LaporanUserSetiaCeo;