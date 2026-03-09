import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");

// Get all users (role: user)
export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/getAllUsers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("response", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

// Get single user by ID
export const getUserById = createAsyncThunk(
    "user/getUserById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/getUser/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

// Update user (with optional image)
export const updateUser = createAsyncThunk(
    "user/updateUser",
    async ({ id, userData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/updateUser/${id}`, userData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

// Delete user
export const deleteUser = createAsyncThunk(
    "user/deleteUser",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/admin/deleteUserById/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return id; // Return the ID precisely for the filter logic in the reducer
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Could not delete user");
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState: {
        users: [],
        selectedUser: null,
        loading: false,
        detailLoading: false,
        error: null,
    },
    reducers: {
        clearSelectedUser: (state) => {
            state.selectedUser = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get All Users
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.data;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Single User
            .addCase(getUserById.pending, (state) => {
                state.detailLoading = true;
                state.error = null;
            })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.detailLoading = false;
                state.selectedUser = action.payload.data;
            })
            .addCase(getUserById.rejected, (state, action) => {
                state.detailLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            // Update User
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                const idx = state.users.findIndex(u => u._id === action.payload.data._id);
                if (idx !== -1) state.users[idx] = action.payload.data;
                if (state.selectedUser?._id === action.payload.data._id) {
                    state.selectedUser = action.payload.data;
                }
                toast.success("User updated successfully!");
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            // Delete User
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter(u => u._id !== action.payload);
                if (state.selectedUser?._id === action.payload) state.selectedUser = null;
                toast.success("User deleted successfully!");
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            });
    }
});

export const { clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;