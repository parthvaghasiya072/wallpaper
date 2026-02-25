import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import Tags from "../../Admin/Pages/Tags";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// create Tag
export const createTag = createAsyncThunk(
    "tag/createTag",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/admin/createTag`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
)

export const getAllTags = createAsyncThunk(
    "tag/getAllTags",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/getAllTags`);
            return response.data; // Expected: { message: "...", tags: [...] }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
)

export const updateTag = createAsyncThunk(
    "tag/updateTag",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/admin/updateTagById/${id}`, data);
            return response.data; // Expected: { message: "...", tag: { ... } }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
)

export const deleteTag = createAsyncThunk(
    "tag/deleteTag",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_URL}/admin/deleteTagById/${id}`);
            return { id, ...response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
)

const tagSlice = createSlice({
    name: "tag",
    initialState: {
        tags: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createTag.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTag.fulfilled, (state, action) => {
                state.loading = false;
                // Backend returns { message, tags: { ... } }
                if (action.payload.tags) {
                    state.tags.push(action.payload.tags);
                }
                toast.success("Tag Created Successfully");
            })
            .addCase(createTag.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload || "Failed to create tag");
            })
            .addCase(getAllTags.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllTags.fulfilled, (state, action) => {
                state.loading = false;
                state.tags = action.payload.tags || [];
            })
            .addCase(getAllTags.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload || "Failed to fetch tags");
            })

            .addCase(updateTag.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTag.fulfilled, (state, action) => {
                state.loading = false;
                const updatedTag = action.payload.tag;
                if (updatedTag) {
                    state.tags = state.tags.map(tag =>
                        tag._id === updatedTag._id ? updatedTag : tag
                    );
                }
                toast.success("Tag Updated Successfully");
            })
            .addCase(updateTag.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload || "Failed to update tag");
            })

            .addCase(deleteTag.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTag.fulfilled, (state, action) => {
                state.loading = false;
                state.tags = state.tags.filter(tag => tag._id !== action.payload.id);
                toast.success("Tag Deleted Successfully");
            })
            .addCase(deleteTag.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload || "Failed to delete tag");
            })
    }
})

export default tagSlice.reducer;