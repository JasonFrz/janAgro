import { createSlice } from "@reduxjs/toolkit";

const intialState = {
  isAuthenticated: false,
  token: null,
  user: null,
  error: null,
  status: "idle",
  role: null,
};
