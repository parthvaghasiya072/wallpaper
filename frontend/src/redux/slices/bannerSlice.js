import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const createBanner = createAsyncThunk(
    "banner/createBanner",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/admin/createBanner`, data);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

export const getAllBanners = createAsyncThunk(
    "banner/getAllBanners",
    async ({ page = 1, limit = 10, search = "" } = {}, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/getAllBanners`, {
                params: { page, limit, search }
            });
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

export const getSingleBanner = createAsyncThunk(
    "banner/getSingleBanner",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/admin/getSingleBanner/${id}`);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

export const updateBannerById = createAsyncThunk(
    "banner/updateBannerById",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/admin/updateBannerById/${id}`, data);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

export const deleteBannerById = createAsyncThunk(
    "banner/deleteBannerById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_URL}/admin/deleteBannerById/${id}`);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

const bannerSlice = createSlice({
    name: "banner",
    initialState: {
        banners: [],
        selectedBanner: null,
        totalBanners: 0,
        totalPages: 0,
        currentPage: 1,
        loading: false,
        detailLoading: false,
        error: null
    },
    reducers: {
        setSelectedBanner: (state, action) => {
            state.selectedBanner = action.payload;
        },
        clearSelectedBanner: (state) => {
            state.selectedBanner = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Banner
            .addCase(createBanner.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBanner.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && state.banners) {
                    state.banners.unshift(action.payload);
                    state.totalBanners += 1;
                }
                toast.success("Banner created successfully");
            })
            .addCase(createBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            // Get All Banners
            .addCase(getAllBanners.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllBanners.fulfilled, (state, action) => {
                state.loading = false;
                state.banners = action.payload.banners;
                state.totalBanners = action.payload.totalBanners;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(getAllBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Single Banner
            .addCase(getSingleBanner.pending, (state) => {
                state.detailLoading = true;
                state.error = null;
            })
            .addCase(getSingleBanner.fulfilled, (state, action) => {
                state.detailLoading = false;
                state.selectedBanner = action.payload;
            })
            .addCase(getSingleBanner.rejected, (state, action) => {
                state.detailLoading = false;
                state.error = action.payload;
            })

            //Update banner
            .addCase(updateBannerById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBannerById.fulfilled, (state, action) => {
                state.loading = false;
                const updatedBanner = action.payload.banner || action.payload;
                const index = state.banners.findIndex((banner) => banner._id === updatedBanner._id);
                if (index !== -1) {
                    state.banners[index] = updatedBanner;
                }
                toast.success("Banner updated successfully");
            })
            .addCase(updateBannerById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            //Delete banner
            .addCase(deleteBannerById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBannerById.fulfilled, (state, action) => {
                state.loading = false;
                state.banners = state.banners.filter((banner) => banner._id !== action.meta.arg);
                state.totalBanners -= 1;
                toast.success("Banner deleted successfully");
            })
            .addCase(deleteBannerById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
    }
});

export const { setSelectedBanner, clearSelectedBanner } = bannerSlice.actions;
export default bannerSlice.reducer;