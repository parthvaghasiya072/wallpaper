import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api/user';

// Get Wishlist
export const getWishlist = createAsyncThunk(
    'wishlist/getWishlist',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.get(`${API_URL}/getWishlist`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Add to Wishlist
export const addToWishlist = createAsyncThunk(
    'wishlist/addToWishlist',
    async (productId, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.post(`${API_URL}/addToWishlist`, { productId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Added to wishlist');
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add to wishlist');
            return rejectWithValue(error.response.data);
        }
    }
);

// Remove from Wishlist
export const removeFromWishlist = createAsyncThunk(
    'wishlist/removeFromWishlist',
    async (productId, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.delete(`${API_URL}/removeFromWishlist/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Removed from wishlist');
            return response.data;
        } catch (error) {
            toast.error('Failed to remove from wishlist');
            return rejectWithValue(error.response.data);
        }
    }
);

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {
        clearWishlistState: (state) => {
            state.items = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Wishlist
            .addCase(getWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(getWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data ? action.payload.data.products : [];
            })
            .addCase(getWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add to Wishlist
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.items = action.payload.data ? action.payload.data.products : [];
            })
            // Remove from Wishlist
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.items = action.payload.data ? action.payload.data.products : [];
            });
    }
});

export const { clearWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;
