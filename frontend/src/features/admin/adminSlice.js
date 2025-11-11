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
  "admin/get-all-users",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin/get-all-users`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal mengambil data Users");
    }
  }
);

export const editUser = createAsyncThunk(
  "admin/update-user",
  async ({id, userData}, { rejectWithValue }) => {  
    try {
      const response = await axios.put(`${API_URL}/admin/update-user/${id}`, userData);
      alert("Edit user successful");
      return response.data.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Gagal Edit user";
      alert(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);


const adminSlice = createSlice({
    name: "admin",  
    initialState: {
        
      users: {
        userA: [],
        loading: false,
        error: null,
        successMessage: null,
        
        
      }
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(editUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(editUser.fulfilled, (state, action) => {
          const index = state.user.findIndex(u => u._id === action.payload._id)
            state.loading = false;
            if(index != -1){
              state.users[index] = action.payload
            }
            state.successMessage= action.payload.message
        });
          
        builder.addCase(editUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
            builder.addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
          });
          builder.addCase(fetchUsers.fulfilled, (state, action) => {
          state.loading = false;
          state.users.userA = action.payload;
        });
                
        builder.addCase(fetchUsers.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    }
});

export default adminSlice.reducer;
