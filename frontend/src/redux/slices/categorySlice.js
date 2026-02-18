import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/api";

export const getAllCategories = createAsyncThunk(
    "category/getAllCategories",
    async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/getAllCategory`, {
                params: { page, limit }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

export const createCategory = createAsyncThunk(
    "category/createCategory",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/admin/createCategory`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

export const deletecategory = createAsyncThunk(
    "category/deleteCategory",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/admin/deleteCategory/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

export const updateCategory = createAsyncThunk(
    "category/updateCategory",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/admin/updateCategory/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

export const getSingleCategory = createAsyncThunk(
    "category/getSingleCategory",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/getSingleCategory/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

const categorySlice = createSlice({
    name: "category",
    initialState: {
        categories: [],
        selectedCategory: null,
        totalCategories: 0,
        totalPages: 0,
        currentPage: 1,
        loading: false,
        detailLoading: false,
        error: null,
    },
    reducers: {
        clearSelectedCategory: (state) => {
            state.selectedCategory = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get All
            .addCase(getAllCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload.categories;
                state.totalCategories = action.payload.total;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(getAllCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                // Since we re-fetch after create, we don't strictly need to unshift here,
                // but doing it makes the UI feel snappier if re-fetch takes a moment.
                state.categories.unshift(action.payload);
                state.totalCategories += 1;
                toast.success("Category Created Successfully.");
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            // Delete
            .addCase(deletecategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletecategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = state.categories.filter((cat) => cat._id !== action.payload);
                state.totalCategories -= 1;
                toast.success("Category Deleted Successfully.");
            })
            .addCase(deletecategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            // Get Single
            .addCase(getSingleCategory.pending, (state) => {
                state.detailLoading = true;
                state.error = null;
            })
            .addCase(getSingleCategory.fulfilled, (state, action) => {
                state.detailLoading = false;
                state.selectedCategory = action.payload;
            })
            .addCase(getSingleCategory.rejected, (state, action) => {
                state.detailLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            // Update
            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload.category || action.payload;
                const index = state.categories.findIndex((cat) => cat._id === updated._id);
                if (index !== -1) {
                    state.categories[index] = updated;
                }
                toast.success("Category Updated Successfully.");
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            });
    }
});

export const { clearSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
