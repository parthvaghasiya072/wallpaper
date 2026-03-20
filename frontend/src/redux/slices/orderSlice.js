import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const createOrder = createAsyncThunk(
    "order/createOrder",
    async (orderData, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.post(`${API_URL}/user/create-order`, orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            const url = `${API_URL}/user/create-order`;
            console.error(`Axios createOrder error at ${url}:`, error);
            const message = error.response?.data?.message || `404: Route not found at ${url}`;
            return rejectWithValue(message);
        }
    }
);

export const createPaymentIntent = createAsyncThunk(
    "order/createPaymentIntent",
    async ({ orderId }, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.post(`${API_URL}/user/create-payment-intent`, { orderId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("Axios createPaymentIntent error:", error);
            const message = error.response?.data?.message || error.message || "Payment intent failed";
            return rejectWithValue(message);
        }
    }
);

export const updatePaymentStatus = createAsyncThunk(
    "order/updatePaymentStatus",
    async (paymentData, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.post(`${API_URL}/user/update-payment-status`, paymentData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("Axios updatePaymentStatus error:", error);
            const message = error.response?.data?.message || error.message || "Payment update failed";
            return rejectWithValue(message);
        }
    }
);

export const getMyOrders = createAsyncThunk(
    "order/getMyOrders",
    async (_, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.get(`${API_URL}/user/my-orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("Axios getMyOrders error:", error);
            const message = error.response?.data?.message || error.message || "Failed to fetch orders";
            return rejectWithValue(message);
        }
    }
);

export const getMyConfirmedOrders = createAsyncThunk(
    "order/getMyConfirmedOrders",
    async (_, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.get(`${API_URL}/user/my-confirmed-orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("Axios getMyConfirmedOrders error:", error);
            const message = error.response?.data?.message || error.message || "Failed to fetch confirmed orders";
            return rejectWithValue(message);
        }
    }
);

export const getSingleConfirmedOrder = createAsyncThunk(
    "order/getSingleConfirmedOrder",
    async (id, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.get(`${API_URL}/user/get-confirmed-order/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("Axios getSingleConfirmedOrder error:", error);
            const message = error.response?.data?.message || error.message || "Failed to fetch order";
            return rejectWithValue(message);
        }
    }
);

export const returnOrder = createAsyncThunk(
    "order/returnOrder",
    async (returnData, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.post(`${API_URL}/user/return-order`, returnData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("Axios returnOrder error:", error);
            const message = error.response?.data?.message || error.message || "Failed to return order";
            return rejectWithValue(message);
        }
    }
);

export const getUserReturnOrders = createAsyncThunk(
    "order/getUserReturnOrders",
    async (_, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.get(`${API_URL}/user/my-return-orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("Axios getUserReturnOrders error:", error);
            const message = error.response?.data?.message || error.message || "Failed to fetch return orders";
            return rejectWithValue(message);
        }
    }
);

const initialState = {
    currentOrder: null,
    orders: [],
    confirmedOrders: [],
    returnOrders: [],
    loading: false,
    error: null
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        resetOrderState: (state) => {
            state.currentOrder = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload.order;
                toast.success("Order placed successfully!");
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            .addCase(createPaymentIntent.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPaymentIntent.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createPaymentIntent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            .addCase(updatePaymentStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePaymentStatus.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updatePaymentStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            .addCase(getMyOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
            })
            .addCase(getMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getMyConfirmedOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMyConfirmedOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.confirmedOrders = action.payload.orders;
            })
            .addCase(getMyConfirmedOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getSingleConfirmedOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSingleConfirmedOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload.order;
            })
            .addCase(getSingleConfirmedOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(returnOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(returnOrder.fulfilled, (state) => {
                state.loading = false;
                toast.success("Order return request submitted!");
            })
            .addCase(returnOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            .addCase(getUserReturnOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserReturnOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.returnOrders = action.payload.orders;
            })
            .addCase(getUserReturnOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
