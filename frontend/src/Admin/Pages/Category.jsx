import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
    FiPlus, FiEdit3, FiTrash2, FiBox,
    FiX, FiCheck, FiImage, FiType, FiFileText,
    FiLayers
} from 'react-icons/fi';

import CommonTable from '../Component/CommonTable';
import { createCategory, getAllCategories } from '../../redux/slices/categorySlice';

// --- VALIDATION SCHEMA ---
const CategorySchema = Yup.object().shape({
    categoryName: Yup.string()
        .required('Category name is required')
        .min(2, 'Too short'),
    categoryDescription: Yup.string()
        .required('Description is required')
        .min(5, 'Description too short'),
    categoryStatus: Yup.string().oneOf(['Active', 'Inactive']).required('Status is required'),
    categoryImage: Yup.mixed().required('Category image is required')
});

const ErrorText = ({ children }) => (
    <div className="text-[10px] text-rose-500 font-black uppercase tracking-widest mt-1 ml-2">
        {children}
    </div>
);

const Category = () => {
    const { isDark } = useOutletContext();
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.category);
    console.log("categories", categories);

    useEffect(() => {
        dispatch(getAllCategories());
    }, [dispatch]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // --- TABLE COLUMNS ---
    const columns = [
        {
            header: 'categoryName',
            accessor: 'categoryName',
            render: (item) => (
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                        {item.categoryImage ? (
                            <img
                                src={typeof item.categoryImage === 'string' ? (item.categoryImage.startsWith('http') ? item.categoryImage : `http://localhost:5000${item.categoryImage}`) : URL.createObjectURL(item.categoryImage)}
                                alt={item.categoryName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <FiLayers size={20} className="text-indigo-500" />
                        )}
                    </div>
                    <div>
                        <span className={`font-black text-sm tracking-tight block ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.categoryName}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'categoryStatus',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${item.categoryStatus === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${item.categoryStatus === 'Active' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {item.categoryStatus}
                    </span>
                </div>
            )
        }
    ];

    // --- HANDLERS ---
    const handleOpenAddModal = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleOpenDeleteModal = (category) => {
        setCategoryToDelete(category);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        const data = new FormData();
        data.append('categoryName', values.categoryName);
        data.append('categoryDescription', values.categoryDescription);
        data.append('categoryStatus', values.categoryStatus);

        if (values.categoryImage instanceof File) {
            data.append('categoryImage', values.categoryImage);
        }

        dispatch(createCategory(data)).then((res) => {
            if (res.meta.requestStatus === 'fulfilled') {
                setIsModalOpen(false);
                resetForm();
            }
            setSubmitting(false);
        });
    };

    const confirmDelete = () => {
        // Implementation for deleteCategory will go here
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="p-4 sm:p-8">
            {/* HEADER SECTION - Same as Product Layout */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className={`text-4xl font-black tracking-tighter flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Category Vault
                    </h1>
                    <p className="text-sm font-medium opacity-50 mt-1 uppercase tracking-[0.3em] flex items-center gap-2">
                        <span className="bg-indigo-500/30" /> Inventory Classification Matrix
                    </p>
                </motion.div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button
                        onClick={handleOpenAddModal}
                        className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-3.5 bg-indigo-600 hover:bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                    >
                        <FiPlus size={18} /> New Category
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT SECTION */}
            <div className="w-full">
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className={`rounded-md  overflow-hidden ${isDark ? 'bg-[#0f172a] border-white/5 shadow-black' : 'bg-white border-slate-100 shadow-slate-200/40'}`}>
                        <CommonTable
                            columns={columns}
                            data={categories}
                            isDark={isDark}
                            onEdit={handleOpenEditModal}
                            onDelete={handleOpenDeleteModal}
                            searchPlaceholder="Scan category matrix..."

                            // Server-side ready props
                            serverTotalPages={1}
                            serverCurrentPage={1}
                            totalRecordsCount={categories.length}
                            onPageChange={(page) => console.log('Page Changed:', page)}
                            onRowsPerPageChange={(limit) => {
                                setRowsPerPage(limit);
                                console.log('Limit Changed:', limit);
                            }}
                            itemsPerPage={rowsPerPage}
                        />
                    </div>
                </motion.div>
            </div>

            {/* UNITY MODAL: ADD / EDIT */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className={`relative w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl p-10 ${isDark ? 'bg-[#0f172a] border border-slate-800' : 'bg-white'}`}
                        >
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {editingCategory ? 'Update' : 'Initialize'} <span className="text-indigo-500">Category</span>
                                    </h2>
                                    <p className="text-[10px] uppercase font-bold tracking-widest opacity-40">System Metadata Profile</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 rounded-xl hover:bg-rose-500/10 text-rose-500 transition-all">
                                    <FiX size={24} />
                                </button>
                            </div>

                            <Formik
                                initialValues={{
                                    categoryName: editingCategory?.categoryName || '',
                                    categoryDescription: editingCategory?.categoryDescription || '',
                                    categoryStatus: editingCategory?.categoryStatus || 'Active',
                                    categoryImage: editingCategory?.categoryImage || null
                                }}
                                validationSchema={CategorySchema}
                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting, setFieldValue, values }) => (
                                    <Form className="space-y-8">
                                        <div className="space-y-6">
                                            {/* Image Upload Area */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest opacity-30 px-2 text-center block">Category Visual Asset</label>
                                                <div className={`relative h-48 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center overflow-hidden group transition-all cursor-pointer ${isDark ? 'bg-slate-900/50 border-slate-800 hover:border-indigo-500/50' : 'bg-slate-50 border-slate-200 hover:border-indigo-500/50'}`}>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                        onChange={(e) => setFieldValue('categoryImage', e.target.files[0])}
                                                    />

                                                    {values.categoryImage ? (
                                                        <img
                                                            src={typeof values.categoryImage === 'string' ? (values.categoryImage.startsWith('http') ? values.categoryImage : `http://localhost:5000${values.categoryImage}`) : URL.createObjectURL(values.categoryImage)}
                                                            className="w-full h-full object-cover p-2 rounded-[1.8rem]"
                                                            alt="Preview"
                                                        />
                                                    ) : (
                                                        <div className="text-center group-hover:scale-110 transition-transform duration-500">
                                                            <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                                                <FiImage size={30} />
                                                            </div>
                                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Drop classification asset</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <ErrorMessage name="categoryImage" component={ErrorText} />
                                            </div>

                                            {/* Name Input */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-tighter opacity-30 px-2">Label Name</label>
                                                <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all focus-within:ring-4 focus-within:ring-indigo-500/10 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                                    <FiType className="text-slate-400" />
                                                    <Field name="categoryName" placeholder="Ex: Abstract Art" className="bg-transparent border-none outline-none text-sm w-full font-bold" />
                                                </div>
                                                <ErrorMessage name="categoryName" component={ErrorText} />
                                            </div>

                                            {/* Status Select */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-tighter opacity-30 px-2">Activation State</label>
                                                <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                                    <FiCheck className="text-slate-400" />
                                                    <Field as="select" name="categoryStatus" className="bg-transparent border-none outline-none text-sm w-full font-bold appearance-none">
                                                        <option value="Active">Active</option>
                                                        <option value="Inactive">Inactive</option>
                                                    </Field>
                                                </div>
                                                <ErrorMessage name="categoryStatus" component={ErrorText} />
                                            </div>

                                            {/* Description Textarea */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-tighter opacity-30 px-2">Operational Scope</label>
                                                <div className={`px-6 py-5 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                                    <Field as="textarea" name="categoryDescription" rows="3" placeholder="Briefly describe this category scope..." className="bg-transparent border-none outline-none text-sm w-full resize-none font-medium leading-relaxed" />
                                                </div>
                                                <ErrorMessage name="categoryDescription" component={ErrorText} />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-5 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Syncing...' : (editingCategory ? 'Update Matrix' : 'Initialize Category')}
                                            <FiCheck size={18} />
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* DELETE CONFIRMATION MODAL */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`relative w-full max-w-sm rounded-[2.5rem] p-10 text-center ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}
                        >
                            <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <FiTrash2 size={40} />
                            </div>
                            <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Confirm Deletion</h3>
                            <p className="text-sm opacity-50 mt-2 font-medium">This action will permanently purge <span className="text-rose-500 font-bold">{categoryToDelete?.categoryName}</span> from the system.</p>

                            <div className="flex flex-col gap-3 mt-10">
                                <button
                                    onClick={confirmDelete}
                                    className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-rose-500/20"
                                >
                                    Erase Data
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Category;
