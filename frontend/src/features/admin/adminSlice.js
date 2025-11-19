import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// THUNK: Mengambil semua pengguna
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin/get-all-users`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal mengambil data pengguna");
    }
  }
);

// THUNK: Memperbarui pengguna
export const editUser = createAsyncThunk(
  "admin/editUser",
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/admin/update-user/${id}`, userData);
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Gagal memperbarui pengguna";
      alert(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// THUNK: Menghapus pengguna
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/admin/delete-user/${id}`);
      return id; // Kembalikan ID agar kita bisa menghapusnya dari state
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal menghapus pengguna");
    }
  }
);

// THUNK: Mengubah status ban
export const toggleBanUser = createAsyncThunk(
  "admin/toggleBanUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/admin/toggle-ban/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal mengubah status ban");
    }
  }
);

// THUNK: Update checkout status (moved here per request)
export const updateCheckoutStatus = createAsyncThunk(
  "admin/updateCheckoutStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      // get token from localStorage (adjust key if you store it differently)
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.put(
        `${API_URL}/checkouts/${id}/status`,
        { status },
        { headers }
      );
      // expect response.data.data to be the updated checkout object
      return response.data.data;
    } catch (error) {
      // surface backend message when available
      const msg = error.response?.data?.message || error.message || "Gagal memperbarui status pesanan";
      return rejectWithValue(msg);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [], // pengguna
    checkouts: [], // checkout orders managed by admin slice now
    loading: false,
    error: null,
  },
  reducers: {
    // optional helper to set checkouts from fetched props
    setCheckouts(state, action) {
      state.checkouts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Reducers untuk fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reducers untuk editUser
      .addCase(editUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      // Reducers untuk deleteUser
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u._id !== action.payload);
      })
      // Reducers untuk toggleBanUser
      .addCase(toggleBanUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })

      // Reducers for updateCheckoutStatus (admin slice handles checkout status updates)
      .addCase(updateCheckoutStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCheckoutStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        if (!updated) return;
        const idx = state.checkouts.findIndex(c => c._id === updated._id);
        if (idx !== -1) {
          state.checkouts[idx] = { ...state.checkouts[idx], ...updated };
        } else {
          // If not already present, add to front
          state.checkouts.unshift(updated);
        }
      })
      .addCase(updateCheckoutStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });
  },
});

export const { setCheckouts } = adminSlice.actions;
export default adminSlice.reducer;