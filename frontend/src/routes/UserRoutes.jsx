import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import ProtectedRoute from '../components/ProtectedRoute';

const UserRoutes = () => {
    return (
        <Routes>
            <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
                <Route path="/" element={<Home />} />
                {/* Add more user routes here */}
            </Route>
            {/* Fallback for undefined user paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default UserRoutes;
