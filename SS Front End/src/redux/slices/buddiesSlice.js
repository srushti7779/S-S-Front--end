import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInterceptors from "@/utils/axiosInterceptor";
import { setUserToken } from "@/utils/helper";
import Router from "next/router";
import { toast } from "react-hot-toast";

const initialState = {
  data: "",
  loading: false,
  buddyList: "",
  invitedBuddy: "",
  buddListLoading: false,
};

export const postBuddyRequest = createAsyncThunk(
  "form/postBuddyRequest",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/buddies`;
    try {
      const response = await AxiosInterceptors.post(url, data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const createBuddyRequest = createAsyncThunk(
  "form/createBuddyRequest",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/buddies/create`;
    try {
      const response = await AxiosInterceptors.post(url, data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const getBuddyList = createAsyncThunk(
  "form/getBuddyList",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/buddies`;
    try {
      const response = await AxiosInterceptors.get(url);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const deleteBuddy = createAsyncThunk(
  "form/deleteBuddy",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/buddies/delete`;
    try {
      const response = await AxiosInterceptors.post(url, data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

const buddiesSlice = createSlice({
  name: "buddiesSlice",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(postBuddyRequest.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(postBuddyRequest.fulfilled, (state, { payload }) => {
        toast.success(payload.message);
        state.loading = false;
      })
      .addCase(postBuddyRequest.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload?.response?.data?.message);
      })
      .addCase(createBuddyRequest.pending, (state, { payload }) => {
        state.buddListLoading = true;
      })
      .addCase(createBuddyRequest.fulfilled, (state, { payload }) => {
        toast.success(payload.message);
        state.buddListLoading = false;
      })
      .addCase(createBuddyRequest.rejected, (state, { payload }) => {
        state.buddListLoading = false;
        toast.error(payload.message);
      })
      .addCase(getBuddyList.pending, (state, { payload }) => {
        state.buddListLoading = true;
      })
      .addCase(getBuddyList.fulfilled, (state, { payload }) => {
        state.buddyList = payload?.buddies;
        state.buddListLoading = false;
        state.invitedBuddy = payload?.invitations;
      })
      .addCase(getBuddyList.rejected, (state, { payload }) => {
        state.buddListLoading = false;
      })
      .addCase(deleteBuddy.pending, (state, { payload }) => {})
      .addCase(deleteBuddy.fulfilled, (state, { payload }) => {
        toast.success(payload.message);
      })
      .addCase(deleteBuddy.rejected, (state, { payload }) => {
        toast.error(payload?.response?.data?.message);
      });
  },
});

export default buddiesSlice.reducer;
