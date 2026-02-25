import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Get All Hero Sections
export const getHeroSections = createAsyncThunk(
    "hero/getHeroSections",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/getHeroSections`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

// Create Hero Section
export const createHeroSection = createAsyncThunk(
    "hero/createHeroSection",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/admin/createHeroSection`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

// Update Hero Section
export const updateHeroSection = createAsyncThunk(
    "hero/updateHeroSection",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/admin/updateHeroSection/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

// Delete Hero Section
export const deleteHeroSection = createAsyncThunk(
    "hero/deleteHeroSection",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/admin/deleteHeroSection/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

const heroSlice = createSlice({
    name: "hero",
    initialState: {
        heroSections: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get All
            .addCase(getHeroSections.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getHeroSections.fulfilled, (state, action) => {
                state.loading = false;
                state.heroSections = action.payload.data;
            })
            .addCase(getHeroSections.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createHeroSection.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createHeroSection.fulfilled, (state, action) => {
                state.loading = false;
                state.heroSections = action.payload.data;
                toast.success("Slide added successfully.");
            })
            .addCase(createHeroSection.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            // Update
            .addCase(updateHeroSection.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateHeroSection.fulfilled, (state, action) => {
                state.loading = false;
                state.heroSections = action.payload.data;
                toast.success("Slide updated successfully.");
            })
            .addCase(updateHeroSection.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            // Delete
            .addCase(deleteHeroSection.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteHeroSection.fulfilled, (state, action) => {
                state.loading = false;
                state.heroSections = state.heroSections.filter(item => item._id !== action.payload);
                toast.success("Slide deleted successfully.");
            })
            .addCase(deleteHeroSection.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            });
    }
});

export default heroSlice.reducer;
