import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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

export const fetchCheckouts = createAsyncThunk(
  "admin/fetchCheckouts",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(`${API_URL}/checkouts/all`, { headers });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchCeoReport = createAsyncThunk(
  "admin/fetchCeoReport",
  async ({ year, month }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(`${API_URL}/checkouts/ceo-report`, { 
        headers,
        params: { year, month } 
      });
      
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchUserReport = createAsyncThunk(
  "admin/fetchUserReport",
  async (params, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(`${API_URL}/users/user-report`, { 
        headers,
        params 
      });
      
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchLoyalUsersReport = createAsyncThunk(
  "admin/fetchLoyalUsersReport",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(`${API_URL}/checkouts/loyal-users-report`, { headers });
      
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

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

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/admin/delete-user/${id}`);
      return id; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal menghapus pengguna");
    }
  }
);

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

export const updateCheckoutStatus = createAsyncThunk(
  "admin/updateCheckoutStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.put(
        `${API_URL}/checkouts/${id}/status`,
        { status },
        { headers }
      );
      return response.data.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Gagal memperbarui status pesanan";
      return rejectWithValue(msg);
    }
  }
);

export const decideCancellation = createAsyncThunk(
  "admin/decideCancellation",
  async ({ orderId, decision }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:3000/api/checkouts/cancel/decision/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);

      return { orderId, decision, deleted: data.deleted, order: data.order, message: data.message };
    } catch (err) {
      return rejectWithValue({ message: err.message });
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [], 
    checkouts: [], 
    ceoReportData: [], 
    userReportData: [], 
    loyalUsersData: [],
    loading: false,
    error: null,
  },
  reducers: {
    setCheckouts(state, action) {
      state.checkouts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(fetchCheckouts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCheckouts.fulfilled, (state, action) => {
        state.loading = false;
        state.checkouts = action.payload;
      })
      .addCase(fetchCheckouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCeoReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCeoReport.fulfilled, (state, action) => {
        state.loading = false;
        state.ceoReportData = action.payload; 
      })
      .addCase(fetchCeoReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserReport.fulfilled, (state, action) => {
        state.loading = false;
        state.userReportData = action.payload;
      })
      .addCase(fetchUserReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLoyalUsersReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoyalUsersReport.fulfilled, (state, action) => {
        state.loading = false;
        state.loyalUsersData = action.payload;
      })
      .addCase(fetchLoyalUsersReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u._id !== action.payload);
      })
      .addCase(toggleBanUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
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
          state.checkouts.unshift(updated);
        }
      })
      .addCase(updateCheckoutStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      })
      .addCase(decideCancellation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(decideCancellation.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.deleted) {
             state.checkouts = state.checkouts.filter(o => o._id !== action.payload.orderId);
        } else {
            state.checkouts = state.checkouts.map((o) => 
                o._id === action.payload.orderId ? action.payload.order : o
            );
        }
      })
      .addCase(decideCancellation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to process cancellation";
      });
  },
});

export const { setCheckouts } = adminSlice.actions;
export default adminSlice.reducer;