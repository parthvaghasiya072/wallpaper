import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/api";

export const getAllCategories = createAsyncThunk(
    "category/getALLCategoriy",
    async (_, { rejectWithValue }) => {
        try{
            const response = await axios.get(`${API_URL}/getAllCategory`);
            return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data?.message || "Failed to fetch categories");
        }
    }
)

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

const categorySlice = createSlice({
    name: "category",
    initialState: {
        categories: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createCategory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories.push(action.payload);
                toast.success("Category Created Successfully.");
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            .addCase(getAllCategories.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories = action.payload;
            })
            .addCase(getAllCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    }
});

export default categorySlice.reducer;
