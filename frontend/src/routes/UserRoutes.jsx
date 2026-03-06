import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Shop from '../pages/Shop';
import ProductDetails from '../pages/ProductDetails';
import ProtectedRoute from '../components/ProtectedRoute';

const UserRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product-details/:id" element={<ProductDetails />} />

            <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
                <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default UserRoutes;
