// src/features/cart/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// ✅ Update quantity (uses your /update-quantity route)
export const updateCartQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const token = getState().users?.token;
      const response = await axios.put(
        `${API_URL}/cart/update-quantity`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data; // updated cart
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal memperbarui kuantitas.");
    }
  }
);

// ✅ Remove item (uses your /remove/:productId route)
export const removeCartItem = createAsyncThunk(
  "cart/removeItem",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const token = getState().users?.token;
      const response = await axios.delete(`${API_URL}/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data; // updated cart
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal menghapus item.");
    }
  }
);


export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().users.token;
      if (!token) return rejectWithValue("User not logged in.");

      const res = await axios.get(`${API_URL}/cart/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Gagal memuat keranjang");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || action.payload; // ensures correct format
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items || action.payload;
      })
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.items || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
