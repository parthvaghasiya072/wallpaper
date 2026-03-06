import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Shop from '../pages/Shop';
import ProtectedRoute from '../components/ProtectedRoute';

const UserRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
                {/* Add protected user routes here (e.g. Profile, Orders) */}
                <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Fallback for undefined user paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default UserRoutes;
