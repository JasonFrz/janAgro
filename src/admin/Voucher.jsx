import React, { useState, useEffect } from 'react';
import { X, Tag, Percent, User, Edit, Trash2, Plus, AlertTriangle } from 'lucide-react'; 
import ConfirmationModal from './ConfirmationModal';

const VoucherModal = ({ isOpen, onClose, onSave, voucher }) => {
  const isEditMode = Boolean(voucher);
  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: '',
    maxUses: '',
    isActive: true,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      if (isEditMode) {
        setFormData({
          code: voucher.code,
          discountPercentage: voucher.discountPercentage,
          maxUses: voucher.maxUses,
          isActive: voucher.isActive,
        });
      } else {
        setFormData({ code: '', discountPercentage: '', maxUses: '', isActive: true });
      }
    }
  }, [voucher, isOpen]);

  const handleSave = () => {
    if (!formData.code.trim() || !formData.discountPercentage || !formData.maxUses) {
      setError('Semua kolom wajib diisi.');
      return;
    }
    if (parseInt(formData.discountPercentage, 10) <= 0 || parseInt(formData.discountPercentage, 10) > 100) {
      setError('Diskon harus antara 1 dan 100.');
      return;
    }
    if (parseInt(formData.maxUses, 10) <= 0) {
      setError('Penggunaan maksimal harus lebih dari 0.');
      return;
    }

    onSave(isEditMode ? voucher.id : null, formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">{isEditMode ? 'Edit Voucher' : 'Add New Voucher'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
        </div>
        <div className="space-y-4">
          {error && <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200 text-sm">{error}</div>}
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Voucher Code</label><div className="relative"><Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className="w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-black" /></div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage (%)</label><div className="relative"><Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><input type="number" value={formData.discountPercentage} onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })} className="w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-black" /></div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Maximum Uses</label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><input type="number" value={formData.maxUses} onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })} className="w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-black" /></div></div>
          <div className="flex items-center"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black" /><label className="ml-2 block text-sm text-gray-900">Voucher Active</label></div>
          <div className="flex space-x-4 pt-4"><button onClick={onClose} className="w-full border border-gray-300 py-3 rounded-md hover:bg-gray-50">Cancel</button><button onClick={handleSave} className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800">Save Voucher</button></div>
        </div>
      </div>
    </div>
  );
};

function Voucher({ vouchers, onAdd, onUpdate, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [voucherToDelete, setVoucherToDelete] = useState(null);

  const handleOpenModal = (voucher = null) => {
    setEditingVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleOpenConfirm = (voucher) => {
    setVoucherToDelete(voucher);
    setIsConfirmOpen(true);
  };

  const handleDelete = () => {
    onDelete(voucherToDelete.id);
    setIsConfirmOpen(false);
    setVoucherToDelete(null);
  };
  
  const handleSaveVoucher = (voucherId, data) => {
      if (editingVoucher) {
        onUpdate(voucherId, data);
      } else {
        onAdd(null, data);
      }
  };

  return (
    <>
      <VoucherModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveVoucher} voucher={editingVoucher} />
      <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleDelete} title="Delete Voucher" message={`Are you sure you want to delete the voucher "${voucherToDelete?.code}"?`} confirmButtonText="Delete" confirmButtonColor="bg-red-600 hover:bg-red-700" />

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Voucher Management</h2>
          <button onClick={() => handleOpenModal()} className="flex items-center space-x-2 bg-black text-white py-2 px-4 rounded-md font-medium hover:bg-gray-800">
            <Plus size={16} />
            <span>Add Voucher</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vouchers.length > 0 ? vouchers.map(voucher => (
                <tr key={voucher.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-black">{voucher.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{voucher.discountPercentage}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{voucher.currentUses} / {voucher.maxUses}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${voucher.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                      {voucher.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => handleOpenModal(voucher)} className="p-2 text-gray-500 hover:text-black"><Edit size={16} /></button>
                    <button onClick={() => handleOpenConfirm(voucher)} className="p-2 text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500">No vouchers found.</td>
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