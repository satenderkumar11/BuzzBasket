import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HOST_URL } from "../store/constant";

// Helper function for API calls
const makeApiRequest = async (url, options = {}) => {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw { ...data, status: response.status };
  }

  return data;
};

export const createOrderThunk = createAsyncThunk(
  "order/create",
  async (orderData, { rejectWithValue }) => {
    try {
      const data = await makeApiRequest(`${HOST_URL}/orders`, {
        method: "POST",
        body: JSON.stringify(orderData),
      });
      return data.savedOrder;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchOrdersByUser = createAsyncThunk(
  "order/fetchOrdersByUser",
  async (id, { rejectWithValue }) => {
    try {
      return await makeApiRequest(`${HOST_URL}/orders/user/${id}`);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchOrderByIdThunk = createAsyncThunk(
  "order/fetchOrderById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await makeApiRequest(`${HOST_URL}/orders/${id}`);
      return data.order;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createPaymentThunk = createAsyncThunk(
  "order/createPayment",
  async (orderData, { rejectWithValue }) => {
    try {
      const orderDataForPayment = {
        order_amount: orderData.totalAmount,
        order_currency: "INR",
        customer_details: {
          customer_id: orderData.user,
          customer_phone: "9999999999",
        },
        order_meta: {
          payment_methods: "cc,dc,upi"
        },
      };

      return await makeApiRequest(`${HOST_URL}/payment`, {
        method: "POST",
        body: JSON.stringify(orderDataForPayment),
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const verifyPaymentThunk = createAsyncThunk(
  "order/verifyPayment",
  async (orderId, { rejectWithValue }) => {
    try {
      return await makeApiRequest(`${HOST_URL}/payment/verify`, {
        method: "POST",
        body: JSON.stringify({ orderId }),
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  orders: null,
  order: null,
  paymentDetails: null,
  paymentStatus: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetPaymentState: (state) => {
      state.paymentDetails = null;
      state.paymentStatus = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.order = action.payload;
        state.loading = false;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Fetch Orders by User
      .addCase(fetchOrdersByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByUser.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrdersByUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Fetch Order by ID
      .addCase(fetchOrderByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByIdThunk.fulfilled, (state, action) => {
        state.order = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrderByIdThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Create Payment
      .addCase(createPaymentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentDetails = null;
      })
      .addCase(createPaymentThunk.fulfilled, (state, action) => {
        state.paymentDetails = action.payload;
        state.loading = false;
      })
      .addCase(createPaymentThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Verify Payment
      .addCase(verifyPaymentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPaymentThunk.fulfilled, (state, action) => {
        state.paymentStatus = action.payload;
        state.loading = false;
      })
      .addCase(verifyPaymentThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { resetPaymentState, clearError } = orderSlice.actions;
export default orderSlice.reducer;