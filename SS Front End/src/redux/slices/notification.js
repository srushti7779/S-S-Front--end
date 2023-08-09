import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInterceptors from "@/utils/axiosInterceptor";
import { removeUserToken, setUserToken } from "@/utils/helper";
import Router from "next/router";
import { toast } from "react-hot-toast";

const initialState = {
  data: "",
  loading: false,
  notificationList: "",
};

// export const postBuddyRequest = createAsyncThunk(
//   "form/postBuddyRequest",
//   async (data, { rejectWithValue }) => {
//     const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/buddies`;
//     try {
//       const response = await AxiosInterceptors.post(url, data);
//       return response.data;
//     } catch (error) {
//       throw rejectWithValue(error);
//     }
//   }
// );

export const getNotificationList = createAsyncThunk(
  "form/getNotificationList",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications`;
    try {
      const response = await AxiosInterceptors.get(url);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

// export const deleteBuddy = createAsyncThunk(
//   "form/deleteBuddy",
//   async (data, { rejectWithValue }) => {
//     const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/buddies/delete`;
//     try {
//       const response = await AxiosInterceptors.post(url, data);
//       return response.data;
//     } catch (error) {
//       throw rejectWithValue(error);
//     }
//   }
// );

const notificationSlice = createSlice({
  name: "notificationSlice",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getNotificationList.pending, (state, { payload }) => {
        state.loading = true;
        state.notificationList = "";
      })
      .addCase(getNotificationList.fulfilled, (state, { payload }) => {
        state.notificationList = payload?.data;
        state.loading = false;
      })
      .addCase(getNotificationList.rejected, (state, { payload }) => {
        state.loading = false;
        if (payload?.response?.data?.message === "User does not exist") {
          removeUserToken();
          Router.push("/");
        }
        state.notificationList = "";
      });
  },
});

export default notificationSlice.reducer;
