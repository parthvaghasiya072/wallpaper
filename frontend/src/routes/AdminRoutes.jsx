import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Admin from '../Admin/Pages/Admin';
import Product from '../Admin/Pages/Product';
import AdminLayout from '../Admin/Layout/AdminLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import Category from '../Admin/Pages/Category';
import HeroSection from '../Admin/Pages/HeroSection';
import HomePage from '../Admin/Pages/HomePage'; // Import HomePage
import Users from '../Admin/Pages/User';
import Tags from '../Admin/Pages/Tags';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route element={<AdminLayout />}>
                    <Route index element={<Admin />} />
                    <Route path="products" element={<Product />} />
                    <Route path="category" element={<Category />} />
                    <Route path="users" element={<Users />} />
                    <Route path="home" element={<HomePage />} /> {/* Restore Home Page */}
                    <Route path="home/hero" element={<HeroSection />} />
                    <Route path="home/tags" element={<Tags />} />
                </Route>
            </Route>
            {/* Fallback for undefined admin paths */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
    );
};

export default AdminRoutes;