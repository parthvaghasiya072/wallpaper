import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const createAddress = createAsyncThunk(
    "address/createAddress",
    async (addressData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/user/createAddress`, addressData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Address not created")
        }
    }
)

export const getAllAddress = createAsyncThunk(
    "address/getAllAddress",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/user/getAllAddress?userId=${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Address not found")
        }
    }
)

export const getSingleAddressById = createAsyncThunk(
    "address/getSingleAddressById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/user/getSingleAddressById/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Address is not found.")
        }
    }
)

export const updateAddressById = createAsyncThunk(
    "address/updateAddressById",
    async ({ id, addressData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/user/updateAddressById/${id}`, addressData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Address not updated");
        }
    }
)

export const deleteAddressById = createAsyncThunk(
    "address/deleteAddressById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_URL}/user/deleteAddressById/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Address not deleted")
        }
    }
)

const initialState = {
    addresses: [],
    loading: false,
    error: null
}

const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Address
            .addCase(createAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAddress.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    state.addresses.push(action.payload.address);
                }
                toast.success("Address created successfully");
            })
            .addCase(createAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            // Get All Address
            .addCase(getAllAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload.address || [];
            })
            .addCase(getAllAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Single Address
            .addCase(getSingleAddressById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSingleAddressById.fulfilled, (state, action) => {
                state.loading = false;
                // You might want to store a single selected address if needed
            })
            .addCase(getSingleAddressById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Address
            .addCase(updateAddressById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAddressById.fulfilled, (state, action) => {
                state.loading = false;
                const updatedAddress = action.payload.address;
                const index = state.addresses.findIndex(addr => addr._id === updatedAddress._id);
                if (index !== -1) {
                    state.addresses[index] = updatedAddress;
                }
                toast.success("Address Updated Successfully.");
            })
            .addCase(updateAddressById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            // Delete Address
            .addCase(deleteAddressById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAddressById.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = state.addresses.filter((address) => address._id !== action.payload.id);
                toast.success("Address Deleted Successfully.");
            })
            .addCase(deleteAddressById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
    }
})

export const { clearError } = addressSlice.actions;
export default addressSlice.reducer;