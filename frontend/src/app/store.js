import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/products/productSlice";
import userReducer from "../features/user/userSlice";
import adminReducer from "../features/admin/adminSlice";
import voucherReducer from "../features/voucher/voucherSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    users: userReducer,
    admin: adminReducer,
    vouchers: voucherReducer,
  },
});