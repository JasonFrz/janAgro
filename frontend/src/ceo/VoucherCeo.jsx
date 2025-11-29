import React, { useState } from "react";
import { Edit, Trash2, Plus, FileText, Users } from "lucide-react";
import ConfirmationModalCeo from "./ConfirmationModalCeo";
import { useNavigate } from "react-router-dom";
import VoucherModalCeo from "./VoucherModalCeo";

function VoucherCeo({ vouchers, onAdd, onUpdate, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [voucherToDelete, setVoucherToDelete] = useState(null);
  const navigate = useNavigate();
  const handleOpenModal = (voucher = null) => {
    setEditingVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVoucher(null);
  };

  const handleOpenConfirm = (voucher) => {
    setVoucherToDelete(voucher);
    setIsConfirmOpen(true);
  };

  const handleDelete = () => {
    onDelete(voucherToDelete._id);
    setIsConfirmOpen(false);
    setVoucherToDelete(null);
  };

  const handleSaveVoucher = (voucherData) => {
    if (editingVoucher) {
      onUpdate(editingVoucher._id, voucherData);
    } else {
      onAdd(voucherData);
    }
  };

  return (
    <>
      <VoucherModalCeo
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveVoucher}
        voucher={editingVoucher}
      />
      <ConfirmationModalCeo
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Voucher"
        message={`Are you sure you want to permanently delete the voucher "${voucherToDelete?.code}"? This action cannot be undone.`}
        confirmButtonText="Yes, Delete It"
        confirmButtonColor="bg-red-700 hover:bg-red-800"
      />
      <div className="bg-white text-black shadow-lg rounded-lg p-6 border-2 border-black">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b-2 border-black gap-4">
          <h2 className="text-2xl font-bold">Voucher Management</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate("/laporan-voucher-ceo")}
              className="flex items-center justify-center space-x-2 bg-white text-black border-2 border-black py-2 px-4 rounded-md font-bold hover:bg-gray-100 transition-transform w-full sm:w-auto"
            >
              <FileText size={20} />
              <span>Laporan Voucher</span>
            </button>

            <button
              onClick={() => handleOpenModal()}
              className="flex items-center justify-center space-x-2 bg-black text-white py-2 px-4 rounded-md font-bold hover:bg-gray-800 transition-transform hover:scale-105 w-full sm:w-auto"
            >
              <Plus size={20} />
              <span>Add New Voucher</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto max-h-96 border-2 border-black rounded-lg">
          <table className="min-w-full divide-y-2 divide-black">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-black uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y-2 divide-gray-300">
              {vouchers.length > 0 ? (
                vouchers.map((voucher) => (
                  <tr key={voucher._id}>
                    <td className="px-6 py-4 whitespace-nowrap font-mono font-extrabold text-black">
                      {voucher.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                      {voucher.discountPercentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                      {voucher.currentUses} / {voucher.maxUses}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs rounded-md font-bold border-2 ${
                          voucher.isActive &&
                          voucher.currentUses < voucher.maxUses
                            ? "bg-green-100 text-green-800 border-green-800"
                            : "bg-red-500 text-gray-800 border-red-950"
                        }`}
                      >
                        {voucher.isActive &&
                        voucher.currentUses < voucher.maxUses
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleOpenModal(voucher)}
                        className="p-2 text-black hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleOpenConfirm(voucher)}
                        className="p-2 text-red-700 hover:bg-red-100 rounded-full transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-12 text-gray-500 font-semibold italic"
                  >
                    No active vouchers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default VoucherCeo;
