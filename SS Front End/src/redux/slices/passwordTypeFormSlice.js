import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInterceptors from "@/utils/axiosInterceptor";
import { setUserToken } from "@/utils/helper";
import Router from "next/router";
import { toast } from "react-hot-toast";

const initialState = {
  data: "",
  loading: false,
  formList: null,
  allowedList: null,
};

export const postPasswordForm = createAsyncThunk(
  "form/PostPasswordForm",
  async (data, { rejectWithValue }) => {
    const { formType, ...formData } = data;
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/password-type/${formType}`;
    try {
      const response = await AxiosInterceptors.post(url, formData);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const putPasswordForm = createAsyncThunk(
  "form/PutPasswordForm",
  async (data, { rejectWithValue }) => {
    const { formType, id, ...formData } = data;
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/password-type/${formType}/${id}`;
    try {
      const response = await AxiosInterceptors.put(url, formData);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const renameForm = createAsyncThunk(
  "form/renameForm",
  async (data, { rejectWithValue }) => {
    const { formType, id, ...formData } = data;
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/password-type/${formType}/rename/${id}`;
    try {
      const response = await AxiosInterceptors.put(url, formData);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const getPasswordFormData = createAsyncThunk(
  "form/getPasswordFormData",
  async (data, { rejectWithValue }) => {
    const { formType, id } = data;
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/password-type/${formType}/${id}`;
    try {
      const response = await AxiosInterceptors.get(url);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const deletePasswordForm = createAsyncThunk(
  "form/deletePasswordForm",
  async (data, { rejectWithValue }) => {
    const { formType, id } = data;
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/password-type/${formType}/${id}`;
    try {
      const response = await AxiosInterceptors.delete(url);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const getPasswordFormDeatils = createAsyncThunk(
  "form/getPasswordFormDeatils",
  async (formType, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/password-type/${formType}`;
    try {
      const response = await AxiosInterceptors.get(url);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

const passwordFormSlice = createSlice({
  name: "passwordFormSlice",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(postPasswordForm.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(postPasswordForm.fulfilled, (state, { payload }) => {
        toast.success(payload.message);
        state.loading = false;
        Router.push("/home/passwords");
      })
      .addCase(postPasswordForm.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload?.response?.data?.message);
      })
      .addCase(putPasswordForm.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(putPasswordForm.fulfilled, (state, { payload }) => {
        toast.success(payload.message);
        state.loading = false;
      })
      .addCase(putPasswordForm.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload.message);
      })
      .addCase(renameForm.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(renameForm.fulfilled, (state, { payload }) => {
        toast.success(payload.message);
        state.loading = false;
      })
      .addCase(renameForm.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload.message);
      })
      .addCase(getPasswordFormData.pending, (state, { payload }) => {
        state.loading = true;
        state.data = null;
      })
      .addCase(getPasswordFormData.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.data = payload.data;
      })
      .addCase(getPasswordFormData.rejected, (state, { payload }) => {
        state.loading = false;
        state.data = null;
      })
      .addCase(getPasswordFormDeatils.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(getPasswordFormDeatils.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.allowedList = payload?.allowedData;
        state.formList = payload?.data;
      })
      .addCase(getPasswordFormDeatils.rejected, (state, { payload }) => {
        state.loading = false;
      });
  },
});

export default passwordFormSlice.reducer;
