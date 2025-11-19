// src/features/user/userSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// --- Bagian AsyncThunk Anda tetap sama ---
export const fetchUsers = createAsyncThunk(
  "users/get-all-users",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/users/get-all-users`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal mengambil data Users");
    }
  }
);

export const addUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {  
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      alert(response.data.message);
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Gagal menambahkan user";
      alert(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const loginUser = createAsyncThunk(
  "users/loginUser",
  async ({ identifier, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        identifier,
        password,
      });
      // Simpan token ke localStorage saat login berhasil
      localStorage.setItem('token', res.data.token); 
      return res.data; // { token, user }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk("users/logoutUser", async () => {
  // Hapus token dari localStorage saat logout
  localStorage.removeItem('token');
  return null;
});


const userSlice = createSlice({
    name: "users",  
    initialState: {
        users: [],
        loading: false,
        error: null,
        isAuthenticated: false,
        token: null,
        user: null,
        successMessage: null,
    },
    // --- PERBAIKAN UTAMA DI SINI ---
    // Tambahkan reducer untuk action sinkron
    reducers: {
        // Reducer ini akan dipanggil dari App.jsx untuk mengisi ulang state
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        // Reducer untuk membersihkan state saat logout
        clearCredentials: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        }
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
            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
                // state.isAuthenticated tidak perlu di-set di sini karena register tidak otomatis login
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })  
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            // Tambahkan case untuk logoutUser
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            });
    }
});

// --- EKSPOR ACTION BARU YANG SUDAH DIBUAT ---
export const { setCredentials, clearCredentials } = userSlice.actions;

export default userSlice.reducer;