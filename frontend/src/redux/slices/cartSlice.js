import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api/user';

// Add to Cart
export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (cartData, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.post(`${API_URL}/addToCart`, cartData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Added to gallery collection');
            return response.data.cart;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add to collection');
            return rejectWithValue(error.response.data);
        }
    }
);

// Get Cart
export const getCart = createAsyncThunk(
    'cart/getCart',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.get(`${API_URL}/getCart`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.cart;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    },
    {
        condition: (_, { getState }) => {
            const { loading, initialized } = getState().cart;
            if (loading || initialized) {
                console.log('getCart call cancelled: already loading or initialized');
                return false;
            }
            console.log('getCart call proceeding...');
        }
    }
);

// Update Cart Item (New)
export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async (updateData, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.put(`${API_URL}/updateCart`, updateData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.cart;
        } catch (error) {
            toast.error('Failed to update quantity');
            return rejectWithValue(error.response.data);
        }
    }
);

// Remove from Cart
export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (cartItemId, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.delete(`${API_URL}/removeFromCart/${cartItemId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Removed from collection');
            return response.data.cart;
        } catch (error) {
            toast.error('Failed to remove item');
            return rejectWithValue(error.response.data);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        totalAmount: 0,
        loading: false,
        initialized: false,
        error: null
    },
    reducers: {
        clearCartState: (state) => {
            state.items = [];
            state.totalAmount = 0;
            state.initialized = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Add to Cart
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.totalAmount = action.payload.totalAmount;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Cart
            .addCase(getCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCart.fulfilled, (state, action) => {
                state.loading = false;
                state.initialized = true;
                if (action.payload) {
                    state.items = action.payload.items;
                    state.totalAmount = action.payload.totalAmount;
                }
            })
            .addCase(getCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Remove from Cart
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.totalAmount = action.payload.totalAmount;
            })
            // Update Cart Item
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.totalAmount = action.payload.totalAmount;
            });
    }
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
