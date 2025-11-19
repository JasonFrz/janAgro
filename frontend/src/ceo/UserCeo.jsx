import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Trash2, UserX, UserCheck, User, PlusCircle } from "lucide-react";
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

  const API_URL = import.meta.env.VITE_API_URL;
  const BASE_SERVER_URL = API_URL.replace("/api", "");

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

  if (loading)
    return <div className="text-gray-500 italic">Memuat pengguna...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const activeUsers = users.filter((u) => !u.isBanned);
  const bannedUsers = users.filter((u) => u.isBanned);

  const UserTable = ({ title, userList, isBannedList = false }) => (
    <div>
      <h3 className="text-lg font-bold mb-3">
        {title} ({userList.length})
      </h3>
      {userList.length === 0 ? (
        <p className="text-gray-500 italic">
          Tidak ada pengguna di kategori ini.
        </p>
      ) : (
        <div className="overflow-x-auto max-h-96 overflow-y-auto border-2 border-black rounded-lg">
          <table className="min-w-full divide-y-2 divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y-2 divide-gray-300">
              {userList.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {user.avatar ? (
                          <img
                            className="h-12 w-12 rounded-full object-cover"
                            src={`${BASE_SERVER_URL}/${user.avatar}`}
                            alt={user.name}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-8 w-8 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-black">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{user.email}</div>
                    <div className="text-sm text-gray-500">
                      {formatPhoneNumber(user.phone)}
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate"
                    title={user.address}
                  >
                    {user.address || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                        user.role === "pemilik"
                          ? "bg-purple-200 text-purple-800"
                          : user.role === "admin"
                          ? "bg-blue-200 text-blue-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="p-2 text-gray-500 hover:text-black"
                      title="Edit Pengguna"
                    >
                      <Edit size={16} />
                    </button>
                    {isBannedList ? (
                      <button
                        onClick={() => openConfirmation("unban", user)}
                        className="p-2 text-green-500 hover:text-green-700"
                        title="Buka Blokir Pengguna"
                      >
                        <UserCheck size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => openConfirmation("ban", user)}
                        className="p-2 text-yellow-500 hover:text-yellow-700"
                        title="Blokir Pengguna"
                      >
                        <UserX size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => openConfirmation("delete", user)}
                      className="p-2 text-red-500 hover:text-red-700"
                      title="Hapus Pengguna"
                    >
                      <Trash2 size={16} />
                    </button>
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
      btnColor: "bg-red-600 hover:bg-red-700",
    },
    ban: {
      title: "Blokir Pengguna",
      message: `Apakah Anda yakin ingin memblokir @${confirmation.user?.username}?`,
      btnText: "Blokir",
      btnColor: "bg-yellow-500 hover:bg-yellow-600",
    },
    unban: {
      title: "Buka Blokir Pengguna",
      message: `Apakah Anda yakin ingin memulihkan @${confirmation.user?.username}?`,
      btnText: "Buka Blokir",
      btnColor: "bg-green-500 hover:bg-green-600",
    },
  };

  const details = confirmationDetails[confirmation.action] || {};

  return (
    <>
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
      <div className="bg-white border-2 border-black rounded-lg p-6 space-y-8 shadow-xl">
        <div className="flex justify-between items-center pb-4 border-b-2 border-black">
          <h2 className="text-2xl font-black">User Management</h2>
          <button
            onClick={() => setCreateAdminModalOpen(true)}
            className="flex items-center justify-center px-4 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
          >
            <PlusCircle size={20} className="mr-2" />
            Create Admin
          </button>
        </div>
        <UserTable title="Pengguna Aktif" userList={activeUsers} />
        <UserTable
          title="Pengguna Diblokir"
          userList={bannedUsers}
          isBannedList={true}
        />
      </div>
    </>
  );
}

export default UserCeo;
