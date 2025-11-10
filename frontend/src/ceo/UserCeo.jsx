import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Trash2, UserX, UserCheck } from "lucide-react";
import ConfirmationModal from "./ConfirmationModalCeo"; 
import EditUserModalCeo from "./EditUserModalCeo";   

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
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    action: null,
    user: null,
  });

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

  const handleUpdate = async (id, updatedData) => {
    try {
      const res = await axios.put(
        `${API_URL}/admin/update-user/${id}`,
        updatedData
      );
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? res.data.data : u))
        );
      } else {
        console.error("Pembaruan gagal:", res.data.message);
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
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? res.data.data : u))
        );
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

  if (loading) return <div className="text-gray-500 italic">Memuat pengguna...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const activeUsers = users.filter((u) => !u.isBanned);
  const bannedUsers = users.filter((u) => u.isBanned);

  const UserTable = ({ title, userList, isBannedList = false }) => (
    <div>
      <h3 className="text-lg font-bold mb-3">
        {title} ({userList.length})
      </h3>
      {userList.length === 0 ? (
        <p className="text-gray-500 italic">No user in this category.</p>
      ) : (
        // ===== PERUBAHAN DI SINI =====
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
                    <div className="text-sm font-bold text-black">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      @{user.username}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{user.email}</div>
                    <div className="text-sm text-gray-500">
                      {formatPhoneNumber(user.no_telp)}
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate"
                    title={user.alamat}
                  >
                    {user.alamat || "-"}
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
        <h2 className="text-2xl font-black pb-4 border-b-2 border-black">User Management</h2>
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