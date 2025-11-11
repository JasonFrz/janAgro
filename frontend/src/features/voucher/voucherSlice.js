import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const fetchVouchers = createAsyncThunk(
  "vouchers/get-all-vouchers",
  async (_, { rejectWithValue }) => {   
    try {
        const response = await axios.get(`${API_URL}/vouchers/get-all-vouchers`);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Gagal mengambil data voucher");
    }}
);

const voucherSlice = createSlice({
  name: "vouchers",
  initialState: {
    vouchers: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchVouchers.pending, (state) => {
      state.error = null;
    });
    builder.addCase(fetchVouchers.fulfilled, (state, action) => {
      state.vouchers = action.payload;
    });
    builder.addCase(fetchVouchers.rejected, (state, action) => {
      state.error = action.payload;
    });
    
  },
});

export default voucherSlice.reducer;