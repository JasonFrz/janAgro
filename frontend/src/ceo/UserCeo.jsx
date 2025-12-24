import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Edit,
  Trash2,
  UserX,
  UserCheck,
  User,
  PlusCircle,
  FileText,
} from "lucide-react";
import ConfirmationModal from "./ConfirmationModalCeo";
import EditUserModalCeo from "./EditUserModalCeo";
import CreateAdminModal from "./CreateAdminModal";

const formatPhoneNumber = (phone) => {
  if (!phone) return "-";
  const digits = phone.replace(/\D/g, "");
  let formatted = "+62 ";
  if (digits.length > 4) {
    formatted += digits.substring(0, 4) + "-";
    if (digits.length > 8) {
      formatted += digits.substring(4, 8) + "-";
      formatted += digits.substring(8);
    } else {
      formatted += digits.substring(4);
    }
  } else {
    formatted += digits;
  }
  return formatted;
};

function UserCeo() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isCreateAdminModalOpen, setCreateAdminModalOpen] = useState(false);
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    action: null,
    user: null,
  });
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/get-all-users`);
        if (res.data.success) {
          setUsers(res.data.data);
        } else {
          setError("Gagal mengambil data pengguna");
        }
      } catch (err) {
        console.error(err);
        setError("Kesalahan server saat mengambil pengguna");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [API_URL]);

  const handleAdminAdded = (newAdmin) => {
    setUsers((prevUsers) => [newAdmin, ...prevUsers]);
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const res = await axios.put(
        `${API_URL}/admin/update-user/${id}`,
        updatedData
      );
      if (res.data.success) {
        setUsers((prev) => prev.map((u) => (u._id === id ? res.data.data : u)));
      }
    } catch (err) {
      console.error("Error memperbarui pengguna:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/admin/delete-user/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Error menghapus pengguna:", err);
    }
  };

  const handleToggleBan = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/admin/toggle-ban/${id}`);
      if (res.data.success) {
        setUsers((prev) => prev.map((u) => (u._id === id ? res.data.data : u)));
      }
    } catch (err) {
      console.error("Error toggling ban:", err);
    }
  };

  const openConfirmation = (action, user) => {
    setConfirmation({ isOpen: true, action, user });
  };

  const closeConfirmation = () => {
    setConfirmation({ isOpen: false, action: null, user: null });
  };

  const handleConfirm = () => {
    const { action, user } = confirmation;
    if (action === "delete") handleDelete(user._id);
    else if (action === "ban" || action === "unban") handleToggleBan(user._id);
    closeConfirmation();
  };

  // --- STYLING CONSTANTS (MANUAL TAILWIND) ---
  const thClass =
    "px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200";
  const tdClass =
    "px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200";
  const btnIcon = "p-2 rounded-full transition-colors duration-200";
  const btnCreate =
    "flex items-center justify-center px-4 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition-colors shadow-md w-full sm:w-auto";
  const btnReport =
    "flex items-center justify-center px-4 py-2 bg-white text-gray-900 font-bold rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors shadow-sm w-full sm:w-auto";

  if (loading)
    return <div className="text-gray-500 italic p-6">Memuat pengguna...</div>;
  if (error) return <div className="text-red-600 p-6 font-bold">{error}</div>;

  const activeUsers = users.filter((u) => !u.isBanned);
  const bannedUsers = users.filter((u) => u.isBanned);

  const UserTable = ({ title, userList, isBannedList = false }) => (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2 border-gray-200">
        {title}{" "}
        <span className="text-sm font-normal text-gray-500 ml-2">
          ({userList.length})
        </span>
      </h3>

      {userList.length === 0 ? (
        <p className="text-gray-500 italic py-4 bg-gray-50 rounded-lg text-center border border-gray-200">
          Tidak ada pengguna di kategori ini.
        </p>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className={thClass}>User</th>
                <th className={thClass}>Contact</th>
                <th className={thClass}>Address</th>
                <th className={thClass}>Role</th>
                <th className={thClass}>Joined</th>
                <th className={`${thClass} text-right`}>Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userList.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className={tdClass}>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover border border-gray-300"
                            src={user.avatar}
                            alt={user.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                            <User className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          @{user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={tdClass}>
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-xs text-gray-500">
                      {formatPhoneNumber(user.phone)}
                    </div>
                  </td>
                  <td className={tdClass}>
                    <div
                      className="max-w-xs truncate text-gray-600"
                      title={user.address}
                    >
                      {user.address || "-"}
                    </div>
                  </td>
                  <td className={tdClass}>
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                        user.role === "pemilik" || user.role === "owner"
                          ? "bg-purple-100 text-purple-800 border border-purple-200"
                          : user.role === "admin"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-green-100 text-green-800 border border-green-200"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className={tdClass}>
                    <span className="text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString("id-ID")}
                    </span>
                  </td>
                  <td className={`${tdClass} text-right`}>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className={`${btnIcon} text-blue-600 hover:bg-blue-50`}
                        title="Edit Pengguna"
                      >
                        <Edit size={18} />
                      </button>

                      {isBannedList ? (
                        <button
                          onClick={() => openConfirmation("unban", user)}
                          className={`${btnIcon} text-green-600 hover:bg-green-50`}
                          title="Buka Blokir"
                        >
                          <UserCheck size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => openConfirmation("ban", user)}
                          className={`${btnIcon} text-yellow-600 hover:bg-yellow-50`}
                          title="Blokir"
                        >
                          <UserX size={18} />
                        </button>
                      )}

                      <button
                        onClick={() => openConfirmation("delete", user)}
                        className={`${btnIcon} text-red-600 hover:bg-red-50`}
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const confirmationDetails = {
    delete: {
      title: "Hapus Pengguna",
      message: `Apakah Anda yakin ingin menghapus @${confirmation.user?.username} secara permanen?`,
      btnText: "Hapus",
      btnColor: "bg-red-600 hover:bg-red-700 text-white",
    },
    ban: {
      title: "Blokir Pengguna",
      message: `Apakah Anda yakin ingin memblokir @${confirmation.user?.username}?`,
      btnText: "Blokir",
      btnColor: "bg-yellow-500 hover:bg-yellow-600 text-white",
    },
    unban: {
      title: "Buka Blokir Pengguna",
      message: `Apakah Anda yakin ingin memulihkan @${confirmation.user?.username}?`,
      btnText: "Buka Blokir",
      btnColor: "bg-green-500 hover:bg-green-600 text-white",
    },
  };

  const details = confirmationDetails[confirmation.action] || {};

  return (
    // WRAPPER UTAMA: Force White Background & Text Black
    <div className="w-full min-h-screen bg-white text-gray-900 p-6 space-y-8 font-sans">
      {/* --- MODALS --- */}
      {editingUser && (
        <EditUserModalCeo
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleUpdate}
        />
      )}
      {isCreateAdminModalOpen && (
        <CreateAdminModal
          onClose={() => setCreateAdminModalOpen(false)}
          onAdminAdded={handleAdminAdded}
        />
      )}
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={closeConfirmation}
        onConfirm={handleConfirm}
        title={details.title}
        message={details.message}
        confirmButtonText={details.btnText}
        confirmButtonColor={details.btnColor}
      />

      {/* --- MAIN CARD --- */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              User Management
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage all registered users and admins.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate("/laporan-user-ceo")}
              className={btnReport}
            >
              <FileText size={18} className="mr-2" />
              Laporan User
            </button>
            <button
              onClick={() => setCreateAdminModalOpen(true)}
              className={btnCreate}
            >
              <PlusCircle size={18} className="mr-2" />
              Create Admin
            </button>
          </div>
        </div>

        {/* TABLES */}
        <UserTable title="Pengguna Aktif" userList={activeUsers} />
        <UserTable
          title="Pengguna Diblokir"
          userList={bannedUsers}
          isBannedList={true}
        />
      </div>
    </div>
  );
}

export default UserCeo;
