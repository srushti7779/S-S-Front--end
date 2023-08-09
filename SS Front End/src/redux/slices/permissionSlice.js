import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInterceptors from "@/utils/axiosInterceptor";
import { setUserToken } from "@/utils/helper";
import Router from "next/router";
import { toast } from "react-hot-toast";

const initialState = {
  data: "",
  loading: false,
  permissionList: "",
  sharedData: null,
};

export const postPermission = createAsyncThunk(
  "form/postPermission",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/permissions`;
    try {
      const response = await AxiosInterceptors.post(url, data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const deletePermission = createAsyncThunk(
  "form/deletePermission",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/permissions/${data.id}/${data.buddyId}`;
    try {
      const response = await AxiosInterceptors.delete(url);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const getPermissionList = createAsyncThunk(
  "form/getPermissionList",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/permissions`;
    try {
      const response = await AxiosInterceptors.get(url, {
        params: data,
      });
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const getSharedWithMe = createAsyncThunk(
  "form/getSharedWithMe",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/permissions/shared-with-me`;
    try {
      const response = await AxiosInterceptors.get(url, {
        params: data,
      });
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

const permissionSlice = createSlice({
  name: "permissionSlice",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getPermissionList.pending, (state, { payload }) => {
        state.loading = true;
        state.permissionList = [];
      })
      .addCase(getPermissionList.fulfilled, (state, { payload }) => {
        state.permissionList = payload?.data;
        state.loading = false;
      })
      .addCase(getPermissionList.rejected, (state, { payload }) => {
        state.permissionList = [];
        state.loading = false;
      })
      .addCase(getSharedWithMe.pending, (state, { payload }) => {
        state.loading = true;
        state.sharedData = null;
      })
      .addCase(getSharedWithMe.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.sharedData = payload.data;
      })
      .addCase(getSharedWithMe.rejected, (state, { payload }) => {
        state.loading = false;
        state.sharedData = null;
      })
      .addCase(postPermission.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(postPermission.fulfilled, (state, { payload }) => {
        toast.success(payload.message);
        state.loading = false;
      })
      .addCase(postPermission.rejected, (state, { payload }) => {
        toast.error(payload.response.data.message);
        state.loading = false;
      })
      .addCase(deletePermission.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(deletePermission.fulfilled, (state, { payload }) => {
        toast.success(payload.message);
        state.loading = false;
      })
      .addCase(deletePermission.rejected, (state, { payload }) => {
        toast.error(payload.message);
        state.loading = false;
      });
  },
});

export default permissionSlice.reducer;
