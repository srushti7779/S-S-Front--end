import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInterceptors from "@/utils/axiosInterceptor";
import { setUserToken } from "@/utils/helper";
import Router from "next/router";
import { toast } from "react-hot-toast";

const initialState = {
  folderList: [],
  loading: false,
  folderData: null,
};

export const getUserFolders = createAsyncThunk(
  "user/getfolder",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/folders`;
    try {
      const response = await AxiosInterceptors.get(url);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const getUserFoldersData = createAsyncThunk(
  "user/getfolderData",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/folders/${data.id}`;
    try {
      const response = await AxiosInterceptors.get(url);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const deleteUserFoldersData = createAsyncThunk(
  "user/deletefolderData",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/folders/${data.id}`;
    try {
      const response = await AxiosInterceptors.delete(url);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const postUserFolders = createAsyncThunk(
  "user/postfolder",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/folders`;
    try {
      const response = await AxiosInterceptors.post(url, data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const putUserFolders = createAsyncThunk(
  "user/putfolder",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/folders/${data.id}`;
    try {
      const response = await AxiosInterceptors.put(url, { name: data.name });
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

const folderSlice = createSlice({
  name: "folderSlice",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getUserFolders.pending, (state, { payload }) => {})
      .addCase(getUserFolders.fulfilled, (state, { payload }) => {
        state.folderList = payload.data;
      })
      .addCase(getUserFolders.rejected, (state, { payload }) => {})
      .addCase(postUserFolders.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(postUserFolders.fulfilled, (state, { payload }) => {
        toast.success(payload.message);
        state.loading = false;
      })
      .addCase(postUserFolders.rejected, (state, { payload }) => {
        toast.error(payload.message);
        state.loading = false;
      })
      .addCase(deleteUserFoldersData.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(deleteUserFoldersData.fulfilled, (state, { payload }) => {
        toast.success(payload.message);
        state.loading = false;
      })
      .addCase(deleteUserFoldersData.rejected, (state, { payload }) => {
        toast.error(payload.message);
        state.loading = false;
      })
      .addCase(putUserFolders.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(putUserFolders.fulfilled, (state, { payload }) => {
        toast.success(payload.message);
        state.loading = false;
      })
      .addCase(putUserFolders.rejected, (state, { payload }) => {
        toast.error(payload.message);
        state.loading = false;
      })
      .addCase(getUserFoldersData.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(getUserFoldersData.fulfilled, (state, { payload }) => {
        state.folderData = payload.data;
        state.loading = false;
      })
      .addCase(getUserFoldersData.rejected, (state, { payload }) => {
        toast.error(payload.message);
        state.loading = false;
      });
  },
});

export default folderSlice.reducer;
