import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as adminService from "../../services/adminService";

export const bootstrapAdmin = createAsyncThunk("adminAuth/bootstrap", async (_, { rejectWithValue }) => {
  try {
    return await adminService.adminMe();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const loginAdmin = createAsyncThunk("adminAuth/login", async (payload, { rejectWithValue }) => {
  try {
    return await adminService.adminLogin(payload);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const logoutAdmin = createAsyncThunk("adminAuth/logout", async () => {
  try {
    await adminService.adminLogout();
  } catch {
    // ignore
  }
});

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState: {
    admin: null,
    isLoading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(bootstrapAdmin.fulfilled, (state, action) => {
        state.admin = action.payload;
        state.isLoading = false;
      })
      .addCase(bootstrapAdmin.rejected, (state) => {
        state.admin = null;
        state.isLoading = false;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.admin = action.payload;
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.error = action.payload || "Login failed";
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.admin = null;
      });
  },
});

export default adminAuthSlice.reducer;
