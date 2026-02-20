import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/product.slice';
import categoryReducer from './slices/categorySlice';
import userReducer from './slices/userSlice';
import heroReducer from './slices/heroSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        category: categoryReducer,
        user: userReducer,
        hero: heroReducer,
    },
});

