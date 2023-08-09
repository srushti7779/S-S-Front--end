import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInterceptors from "@/utils/axiosInterceptor";
import { setUserToken } from "@/utils/helper";
import Router from "next/router";
import { toast } from "react-hot-toast";

const initialState = {
  fileList: [],
  fileLoading: false,
  getFileLoading: false,
  deleteFileLoading: false,
  fileData: null,
  fileName: null,
};

export const getUserfiles = createAsyncThunk(
  "user/getfiles",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/files`;
    try {
      const response = await AxiosInterceptors.get(url);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const deleteUserfiles = createAsyncThunk(
  "user/deletefiles",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${data.id}`;
    try {
      const response = await AxiosInterceptors.delete(url);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const renameUserfiles = createAsyncThunk(
  "user/renameUserfiles",
  async (data, { rejectWithValue }) => {
    const { id, ...fileData } = data;
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${id}`;
    try {
      const response = await AxiosInterceptors.put(url, fileData);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const getFileData = createAsyncThunk(
  "user/getFileData",
  async (data, { rejectWithValue }) => {
    const { id, ...fileData } = data;
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${data.id}`;
    try {
      const response = await AxiosInterceptors.get(url);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const viewUserfiles = createAsyncThunk(
  "user/viewfiles",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/view/${data.id}`;
    try {
      const response = await AxiosInterceptors.get(url);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const postUserfiles = createAsyncThunk(
  "user/postfiles",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/files`;
    try {
      const response = await AxiosInterceptors.post(url, data, {
        "Content-Type": "multipart/form-data",
      });
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

const fileSlice = createSlice({
  name: "fileSlice",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getUserfiles.pending, (state, { payload }) => {
        state.getFileLoading = true;
      })
      .addCase(getUserfiles.fulfilled, (state, { payload }) => {
        state.fileList = payload.data;
        state.getFileLoading = false;
      })
      .addCase(getUserfiles.rejected, (state, { payload }) => {
        state.getFileLoading = false;
      })
      .addCase(getFileData.pending, (state, { payload }) => {
        state.getFileLoading = true;
      })
      .addCase(getFileData.fulfilled, (state, { payload }) => {
        state.fileName = payload.data;
        state.getFileLoading = false;
      })
      .addCase(getFileData.rejected, (state, { payload }) => {
        state.getFileLoading = false;
      })
      .addCase(postUserfiles.pending, (state, { payload }) => {
        state.fileLoading = true;
      })
      .addCase(postUserfiles.fulfilled, (state, { payload }) => {
        toast.success(payload.message);
        state.fileLoading = false;
      })
      .addCase(postUserfiles.rejected, (state, { payload }) => {
        toast.error(payload.message);
        state.fileLoading = false;
      })
      .addCase(renameUserfiles.pending, (state, { payload }) => {
        state.fileLoading = true;
      })
      .addCase(renameUserfiles.fulfilled, (state, { payload }) => {
        toast.success(payload.message);
        state.fileLoading = false;
      })
      .addCase(renameUserfiles.rejected, (state, { payload }) => {
        toast.error(payload.message);
        state.fileLoading = false;
      })
      .addCase(deleteUserfiles.pending, (state, { payload }) => {
        state.deleteFileLoading = true;
      })
      .addCase(deleteUserfiles.fulfilled, (state, { payload }) => {
        toast.success(payload.message);
        state.deleteFileLoading = false;
      })
      .addCase(deleteUserfiles.rejected, (state, { payload }) => {
        toast.error(payload.message);
        state.deleteFileLoading = false;
      })
      .addCase(viewUserfiles.pending, (state, { payload }) => {
        state.fileLoading = true;
        state.fileData = null;
      })
      .addCase(viewUserfiles.fulfilled, (state, { payload }) => {
        state.fileData = payload.data;
        state.fileLoading = false;
      })
      .addCase(viewUserfiles.rejected, (state, { payload }) => {
        state.fileData = null;
        state.fileLoading = false;
      });
  },
});

export default fileSlice.reducer;
