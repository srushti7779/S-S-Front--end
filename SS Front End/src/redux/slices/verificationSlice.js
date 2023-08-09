import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInterceptors from "@/utils/axiosInterceptor";
import Router from "next/router";
import { toast } from "react-hot-toast";

const initialState = {
  data: "",
  loading: false,
};

export const getVerification = createAsyncThunk(
  "form/getVerification",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/verification`;
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

const verificationSlice = createSlice({
  name: "verificationSlice",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getVerification.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(getVerification.fulfilled, (state, { payload }) => {
        state.data = payload?.data;
        toast.success("Verification completed");
        state.loading = false;
      })
      .addCase(getVerification.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error("User already verified");
        Router.push("/home");
      });
  },
});

export default verificationSlice.reducer;
