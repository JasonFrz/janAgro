import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Trash2, UserX, UserCheck } from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";
import EditUserModal from "./EditUserModal";
import { editUser, fetchUsers } from "../features/admin/adminSlice"
import { useDispatch,useSelector} from "react-redux";


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

function UserAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ErrorMessage,setErrorMessage] = useState({})
  const [editingUser, setEditingUser] = useState(null);
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    action: null,
    user: null,
  });
  const dispatch = useDispatch();

  const fetchAllUsers = async () => {
    try {
      const res = await dispatch(fetchUsers()).unwrap();
      setUsers(res);
    } catch (err) {
      console.error(err);
      setError("Server error fetching users");
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {

  fetchAllUsers();
}, [dispatch]); // <-- IMPORTANT


const handleUpdate = async () => {

  
  try {
      console.log("TES")
      const userData = await dispatch(editUser({id: userData._id, updatedData:userData})).unwrap()
      console.log("TES2")
      setUsers(userData.user)
  
    } catch (error) {
      setErrorMessage(error)
    }finally{ 
      // setErrorMessage(null)
      
  fetchAllUsers();
    }



  // try {
  //   const res = await axios.put(
  //     `http://localhost:3000/api/admin/update-user/${id}`,
  //     updatedData
  //   );
  //   if (res.data.success) {
  //     setUsers((prev) =>
  //       prev.map((u) => (u._id === id ? res.data.data : u))
  //     );
  //   } else {
  //     console.error("Update failed:", res.data.message);
  //   }
  // } catch (err) {
  //   console.error("Error updating user:", err);
  // }



};


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/delete-user/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleToggleBan = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/admin/toggle-ban/${id}`
      );
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

  // ✅ Loading & error
  if (loading) return <div className="text-gray-500 italic">Loading users...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const activeUsers = users.filter((u) => !u.isBanned);
  const bannedUsers = users.filter((u) => u.isBanned);

  const UserTable = ({ title, userList, isBannedList = false }) => (
    <div>
      <h3 className="text-lg font-semibold mb-3">
        {title} ({userList.length})
      </h3>
      {userList.length === 0 ? (
        <p className="text-gray-500 italic">No users in this category.</p>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alamat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userList.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-black">
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
                    >
                      <Edit size={16} />
                    </button>
                    {isBannedList ? (
                      <button
                        onClick={() => openConfirmation("unban", user)}
                        className="p-2 text-green-500 hover:text-green-700"
                      >
                        <UserCheck size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => openConfirmation("ban", user)}
                        className="p-2 text-yellow-500 hover:text-yellow-700"
                      >
                        <UserX size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => openConfirmation("delete", user)}
                      className="p-2 text-red-500 hover:text-red-700"
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
      title: "Delete User",
      message: `Are you sure you want to permanently delete @${confirmation.user?.username}?`,
      btnText: "Delete",
      btnColor: "bg-red-600 hover:bg-red-700",
    },
    ban: {
      title: "Ban User",
      message: `Are you sure you want to ban @${confirmation.user?.username}?`,
      btnText: "Ban User",
      btnColor: "bg-yellow-500 hover:bg-yellow-600",
    },
    unban: {
      title: "Unban User",
      message: `Are you sure you want to restore @${confirmation.user?.username}?`,
      btnText: "Unban User",
      btnColor: "bg-green-500 hover:bg-green-600",
    },
  };

  const details = confirmationDetails[confirmation.action] || {};

  return (
    <>
      {editingUser && (
        <EditUserModal
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
      <div className="bg-white shadow rounded-lg p-6 space-y-8">
        <h2 className="text-xl font-semibold">Users Management</h2>
        <UserTable title="Active Users" userList={activeUsers} />
        <UserTable
          title="Banned Users"
          userList={bannedUsers}
          isBannedList={true}
        />
      </div>
    </>
  );
}

export default UserAdmin;
