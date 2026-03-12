import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const createOrder = createAsyncThunk(
    "order/createOrder",
    async (orderData, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.post(`${API_URL}/order/createOrder`, orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Order creation failed");
        }
    }
);

export const createStripeSession = createAsyncThunk(
    "order/createStripeSession",
    async ({ items, orderId }, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.post(`${API_URL}/order/create-checkout-session`, { items, orderId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Payment session failed");
        }
    }
);

const initialState = {
    currentOrder: null,
    orders: [],
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
            .addCase(createStripeSession.pending, (state) => {
                state.loading = true;
            })
            .addCase(createStripeSession.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createStripeSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            });
    }
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
