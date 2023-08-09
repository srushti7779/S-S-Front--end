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
  planList: [],
  isloading: false,
  planData: {},
};

export const postPaymentIntent = createAsyncThunk(
  "form/postPaymentIntent",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments`;
    try {
      const response = await AxiosInterceptors.post(url, data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const getStripeKey = createAsyncThunk(
  "form/getStripeKey",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/${data.type}-config`;
    try {
      const response = await AxiosInterceptors.get(url);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const getPlans = createAsyncThunk(
  "form/getPlans",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/plans`;
    try {
      const response = await AxiosInterceptors.get(url);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const getPlansActivity = createAsyncThunk(
  "form/getPlansActivity",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/plans-activity`;
    try {
      const response = await AxiosInterceptors.get(url);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const verifySessionId = createAsyncThunk(
  "form/verifySessionId",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/completion?session_id=${data.session_id}`;
    try {
      const response = await AxiosInterceptors.get(url);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const postPlansActivity = createAsyncThunk(
  "form/postPlansActivity",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/plans-activity`;
    try {
      const response = await AxiosInterceptors.post(url, data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const getTransactionList = createAsyncThunk(
  "form/getTransactionList",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/transaction-list`;
    try {
      const response = await AxiosInterceptors.get(url);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const getPaymentInvoice = createAsyncThunk(
  "form/getPaymentInvoice",
  async (data, { rejectWithValue }) => {
    const urlo = `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/invoice/${data.id}`;
    try {
      const response = await AxiosInterceptors.get(urlo, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "invoice.pdf";
      link.click();
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const putPlansActivity = createAsyncThunk(
  "form/putPlansActivity",
  async (data, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/plans-activity`;
    try {
      const response = await AxiosInterceptors.put(url, data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

const paymentSlice = createSlice({
  name: "paymentSlice",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getPlans.pending, (state, { payload }) => {
        state.loading = true;
        state.planList = [];
      })
      .addCase(getPlans.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.planList = payload.products.data;
      })
      .addCase(getPlans.rejected, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(getTransactionList.pending, (state, { payload }) => {
        state.loading = true;
        state.transacitonList = [];
      })
      .addCase(getTransactionList.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.transacitonList = payload.data.data;
      })
      .addCase(getTransactionList.rejected, (state, { payload }) => {
        state.transacitonList = [];
        state.loading = false;
      })
      .addCase(getPaymentInvoice.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(getPaymentInvoice.fulfilled, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(getPaymentInvoice.rejected, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(getPlansActivity.pending, (state, { payload }) => {
        // state.loading = true;
        state.planData = [];
      })
      .addCase(getPlansActivity.fulfilled, (state, { payload }) => {
        // state.loading = false;
        state.planData = payload.data;
      })
      .addCase(getPlansActivity.rejected, (state, { payload }) => {
        // state.loading = false;
      })
      .addCase(postPaymentIntent.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(postPaymentIntent.fulfilled, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(postPaymentIntent.rejected, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(putPlansActivity.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(putPlansActivity.fulfilled, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(putPlansActivity.rejected, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(postPlansActivity.pending, (state, { payload }) => {
        state.isloading = true;
      })
      .addCase(postPlansActivity.fulfilled, (state, { payload }) => {
        state.isloading = false;
      })
      .addCase(postPlansActivity.rejected, (state, { payload }) => {
        state.isloading = false;
        toast.error(payload?.response?.data?.message);
      })
      .addCase(getStripeKey.pending, (state, { payload }) => {
        state.loading = true;
        state.data = null;
      })
      .addCase(getStripeKey.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.data = payload.publishableKey;
      })
      .addCase(getStripeKey.rejected, (state, { payload }) => {
        state.loading = false;
        state.data = null;
      });
  },
});

export default paymentSlice.reducer;
