import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInterceptors from "@/utils/axiosInterceptor";
import { setUserToken } from "@/utils/helper";
import Router from "next/router";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

const initialState = {
  user: {
    id: "",
  },
  userProfile: "",
  permissions: [],
  message: null,
  loading: false,
  otpLoading: false,
  profileLoading: false,
};

export const authUserLogin = createAsyncThunk(
  "auth/authLogin",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`;
    try {
      const response = await AxiosInterceptors.post(url, data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const authUserGoogleLogin = createAsyncThunk(
  "auth/authGoogleLogin",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth//login-google`;
    try {
      const response = await AxiosInterceptors.post(url, data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const authUserForgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forgot-password`;
    try {
      const response = await AxiosInterceptors.post(url, data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const authUserChangePassword = createAsyncThunk(
  "auth/ChangePassword",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/change-password`;
    try {
      const response = await AxiosInterceptors.post(url, data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const authUserRegister = createAsyncThunk(
  "auth/authRegister",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`;
    try {
      const response = await AxiosInterceptors.post(url, data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const authVerifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/2fa`;
    try {
      const response = await AxiosInterceptors.post(url, data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const authResendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/resend`;
    try {
      const response = await AxiosInterceptors.post(url, data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const authPostUserProfile = createAsyncThunk(
  "auth/userPostProfile",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`;
    try {
      const response = await AxiosInterceptors.post(url, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const authGetUserProfile = createAsyncThunk(
  "auth/userGetProfile",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`;
    try {
      const response = await AxiosInterceptors.get(url);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(authUserLogin.pending, (state, { payload }) => {
        state.loading = true;
        state.user = null;
      })
      .addCase(authUserLogin.fulfilled, (state, { payload }) => {
        state.user = { id: payload.id };
        state.loading = false;
        state.otpLoading = false;
        state.isAuthenticated = true;
        localStorage.setItem("user_id", payload.id);
        toast.success(payload.message);
        Router.push("/auth/verify-otp");
      })
      .addCase(authUserLogin.rejected, (state, { payload }) => {
        state.loading = false;
        state.user = null;
        toast.error(payload?.response?.data?.message);
      })
      .addCase(authUserGoogleLogin.pending, (state, { payload }) => {
        state.loading = true;
        state.user = null;
      })
      .addCase(authUserGoogleLogin.fulfilled, (state, { payload }) => {
        console.log(payload);
        // state.user = { id: payload.id };
        // state.loading = false;
        // state.otpLoading = false;
        // state.isAuthenticated = true;
        // localStorage.setItem("user_id", payload.id);
        // toast.success(payload.message);
        // Router.push("/auth/verify-otp");
      })
      .addCase(authUserGoogleLogin.rejected, (state, { payload }) => {
        console.log(payload);
        // state.loading = false;
        // state.user = null;
        // toast.error(payload?.response?.data?.message);
      })
      .addCase(authUserRegister.pending, (state, { payload }) => {
        state.loading = true;
        state.user = null;
      })
      .addCase(authUserRegister.fulfilled, (state, { payload }) => {
        state.user = { id: payload.id };
        state.loading = false;
        state.otpLoading = false;
        state.isAuthenticated = true;
        localStorage.setItem("user_id", payload.id);
        toast.success(payload.message);
        Router.push("/auth/verify-otp");
      })
      .addCase(authUserRegister.rejected, (state, { payload }) => {
        state.loading = false;
        state.user = null;
        toast.error(payload?.response?.data?.message);
      })
      .addCase(authVerifyOtp.pending, (state, { payload }) => {
        state.otpLoading = true;
        state.user = null;
      })
      .addCase(authVerifyOtp.fulfilled, (state, { payload }) => {
        state.otpLoading = true;
        Router.push("/home");
        setUserToken(payload.token);
        toast.success("OTP verified successfully");
      })
      .addCase(authVerifyOtp.rejected, (state, { payload }) => {
        state.otpLoading = false;
        state.user = null;
        toast.error(payload?.response?.data?.message);
      })
      .addCase(authResendOtp.pending, (state, { payload }) => {})
      .addCase(authResendOtp.fulfilled, (state, { payload }) => {
        toast.success(payload.message);
      })
      .addCase(authResendOtp.rejected, (state, { payload }) => {
        toast.error(payload?.response?.data?.message);
      })
      .addCase(authPostUserProfile.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(authPostUserProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        Cookies.set("profile", payload.message);
        Router.push("/home");
        toast.success(payload.message);
      })
      .addCase(authPostUserProfile.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload?.response?.data?.message);
      })
      .addCase(authGetUserProfile.pending, (state, { payload }) => {
        state.profileLoading = true;
      })
      .addCase(authGetUserProfile.fulfilled, (state, { payload }) => {
        state.profileLoading = false;
        if (process.browser && !localStorage.getItem("profile")) {
          localStorage.setItem("profile", JSON.stringify(payload.data));
        }
        state.userProfile = payload.data;
      })
      .addCase(authGetUserProfile.rejected, (state, { payload }) => {
        state.profileLoading = false;
      })
      .addCase(authUserForgotPassword.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(authUserForgotPassword.fulfilled, (state, { payload }) => {
        state.loading = false;
        toast.success(payload.message);
        Router.push("/auth/change-password");
      })
      .addCase(authUserForgotPassword.rejected, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(authUserChangePassword.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(authUserChangePassword.fulfilled, (state, { payload }) => {
        state.loading = false;
        toast.success(payload.message);
        Router.push("/auth/login");
      })
      .addCase(authUserChangePassword.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload?.response?.data?.message);
      });
  },
});

export default userAuthSlice.reducer;
