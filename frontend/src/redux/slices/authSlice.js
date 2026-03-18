import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/user/login`, userData);
            // Extracts ID whether it's flat or nested in a 'data' property
            const user = response.data.data || response.data;
            const userId = user._id || user.id;
            const token = user.token;

            // Storing both the full object and specifically the ID/Token for easy access
            localStorage.setItem('user', JSON.stringify(response.data));
            if (userId) localStorage.setItem('userId', userId);
            if (token) localStorage.setItem('token', token);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/user/register`, userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    }
);

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/user/forgot-password`, { email });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    }
);

export const verifyOTP = createAsyncThunk(
    'auth/verifyOTP',
    async ({ email, otp }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/user/verify-otp`, { email, otp });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (resetData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/user/reset-password`, resetData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    }
);

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    userId: localStorage.getItem('userId') || null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.userId = null;
            state.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('userId');
            localStorage.removeItem('token');
            toast.success('Logged out successfully');
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const user = action.payload.data || action.payload;
                state.isLoading = false;
                state.user = action.payload;
                state.userId = user._id || user.id;
                state.token = user.token;
                toast.success(`Welcome back, ${user.firstName}!`);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
                toast.success('Registration successful! Please login.');
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            // Update auth state when user profile is updated in userSlice
            .addCase('user/updateUser/fulfilled', (state, action) => {
                state.user = action.payload.data;
                localStorage.setItem('user', JSON.stringify(action.payload.data));
            })
            // Forgot Password Flows
            .addCase(forgotPassword.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.isLoading = false;
                toast.success('OTP sent to your email!');
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(action.payload);
            })
            .addCase(verifyOTP.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyOTP.fulfilled, (state) => {
                state.isLoading = false;
                toast.success('OTP verified!');
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(action.payload);
            })
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.isLoading = false;
                toast.success('Password reset successfully! Please login.');
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(action.payload);
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
