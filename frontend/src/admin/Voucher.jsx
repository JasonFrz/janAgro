import React, { useState } from "react";
import { X, Tag, Percent, User, Edit, Trash2, Plus } from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";
import VoucherModal from "./VoucherModal";

function Voucher({ vouchers, onAdd, onUpdate, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [voucherToDelete, setVoucherToDelete] = useState(null);

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
      <VoucherModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveVoucher}
        voucher={editingVoucher}
      />
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Voucher"
        message={`Are you sure you want to delete the voucher "${voucherToDelete?.code}"?`}
        confirmButtonText="Delete"
        confirmButtonColor="bg-red-600 hover:bg-red-700"
      />
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Voucher Management</h2>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 bg-black text-white py-2 px-4 rounded-md font-medium hover:bg-gray-800"
          >
            <Plus size={16} />
            <span>Add Voucher</span>
          </button>
        </div>
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vouchers.length > 0 ? (
                vouchers.map((voucher) => (
                  <tr key={voucher._id}>
                    {" "}
                    {/* <-- Gunakan _id */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-black">
                      {voucher.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {voucher.discountPercentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {voucher.currentUses} / {voucher.maxUses}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          voucher.isActive &&
                          voucher.currentUses < voucher.maxUses
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-600"
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
                        className="p-2 text-gray-500 hover:text-black"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleOpenConfirm(voucher)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500">
                    No vouchers found.
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

export default Voucher;
                        