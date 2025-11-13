// import { createSlice } from "@reduxjs/toolkit";

// const intialState = {
//   isAuthenticated: false,
//   token: null,
//   user: null,
//   error: null,
//   status: "idle",
//   role: null,
// };

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";


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
      return res.data; // { token, user }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk("users/logoutUser", async () => {
  // If your backend has logout route, call it here
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
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload;
        });
        
        builder.addCase(fetchUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        builder.addCase(addUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addUser.fulfilled, (state, action) => {
            state.loading = false;
            state.users.push(action.payload);
            state.isAuthenticated = true;
            state.successMessage = action.payload.message;
        });
        builder.addCase(addUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        builder
          .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
          })  
          .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          .addCase(loginUser.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true; // ✅ add this line
        });
    }
});

export default userSlice.reducer;
