import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Admin from '../Admin/Pages/Admin';
import Product from '../Admin/Pages/Product';
import AdminLayout from '../Admin/Layout/AdminLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import Category from '../Admin/Pages/Category';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route element={<AdminLayout />}>
                    <Route index element={<Admin />} />
                    <Route path="products" element={<Product />} />
                    <Route path="category" element={<Category />} />
                    {/* Add more admin category routes here */}
                </Route>
            </Route>
            {/* Fallback for undefined admin paths */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
    );
};

export default AdminRoutes;
