import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus, FiLayers, FiX, FiInfo, FiActivity } from 'react-icons/fi';
import CommonTable from '../Component/CommonTable';
import AddCategoryModal from '../Component/AddCategoryModal';
import CommonViewModal from '../Component/CommonViewModal';
import CommonDeleteModal from '../Component/CommonDeleteModal';
import {
    getAllCategories,
    createCategory,
    deletecategory,
    updateCategory,
    getSingleCategory,
    clearSelectedCategory
} from "../../redux/slices/categorySlice";

// Helper for image URL
const getImageUrl = (image) => {
    if (!image) return null;
    if (typeof image === 'string') {
        return image.startsWith('http') ? image : `http://localhost:5000${image}`;
    }
    return URL.createObjectURL(image);
};

const Category = () => {
    const { isDark } = useOutletContext();
    const dispatch = useDispatch();

    const { categories, totalPages, currentPage, totalCategories, loading, detailLoading, selectedCategory, error } = useSelector((state) => state.category);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        dispatch(getAllCategories({ page, limit: rowsPerPage }));
    }, [dispatch, page, rowsPerPage]);

    const columns = useMemo(() => [
        {
            header: 'Category',
            accessor: 'categoryName',
            render: (item) => (
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-md flex items-center justify-center  overflow-hidden`}>
                        {item.categoryImage ? (
                            <img
                                src={getImageUrl(item.categoryImage)}
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
    ], [isDark]);

    const handleOpenViewModal = (category) => {
        dispatch(getSingleCategory(category._id));
    };

    const handleOpenAddModal = () => {
        setEditingCategory(null);
        setIsAddModalOpen(true);
    };

    const handleOpenEditModal = (category) => {
        setEditingCategory(category);
        setIsAddModalOpen(true);
    };

    const handleOpenDeleteModal = (category) => {
        setCategoryToDelete(category);
        setIsDeleteModalOpen(true);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (newLimit) => {
        setRowsPerPage(newLimit);
        setPage(1);
    };

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        const data = new FormData();
        data.append('categoryName', values.categoryName);
        data.append('categoryDescription', values.categoryDescription);
        data.append('categoryStatus', values.categoryStatus);

        if (values.categoryImage instanceof File) {
            data.append('categoryImage', values.categoryImage);
        } else if (typeof values.categoryImage === 'string') {
            data.append('categoryImage', values.categoryImage);
        }

        const action = editingCategory
            ? updateCategory({ id: editingCategory._id, data })
            : createCategory(data);

        dispatch(action).then((res) => {
            if (res.meta.requestStatus === 'fulfilled') {
                setIsAddModalOpen(false);
                resetForm();
                dispatch(getAllCategories({ page, limit: rowsPerPage }));
            }
            setSubmitting(false);
        });
    };

    const handleDeleteConfirm = () => {
        if (!categoryToDelete) return;
        // setDeleteLoading(true); // Assuming the action is fast, or we can use the promise state
        dispatch(deletecategory(categoryToDelete._id)).then((res) => {
            if (res.meta.requestStatus === 'fulfilled') {
                dispatch(getAllCategories({ page, limit: rowsPerPage }));
            }
            // setDeleteLoading(false);
            setIsDeleteModalOpen(false);
        });
    };

    return (
        <div className="">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className={`text-4xl font-black tracking-tighter flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Category Vault
                    </h1>
                    <p className="text-sm font-medium opacity-50 mt-1 uppercase tracking-[0.3em] flex items-center gap-2">
                        <span className="w-4 h-1 bg-indigo-500 rounded-full" /> Inventory Classification Matrix
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

            <div className="w-full">
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className={`rounded-md overflow-hidden ${isDark ? 'bg-[#0f172a] border-white/5 shadow-black' : 'bg-white border-slate-100 shadow-slate-200/40'}`}>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-10 text-rose-500 font-bold">{error}</div>
                        ) : (
                            <CommonTable
                                columns={columns}
                                data={categories}
                                isDark={isDark}
                                onView={handleOpenViewModal}
                                onEdit={handleOpenEditModal}
                                onDelete={handleOpenDeleteModal}
                                searchPlaceholder="Scan category matrix..."
                                serverTotalPages={totalPages}
                                serverCurrentPage={currentPage}
                                totalRecordsCount={totalCategories}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                itemsPerPage={rowsPerPage}
                            />
                        )}
                    </div>
                </motion.div>
            </div>

            <AddCategoryModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                isDark={isDark}
                onSubmit={handleSubmit}
                editingCategory={editingCategory}
            />

            <CommonDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                isDark={isDark}
                loading={deleteLoading} // Note: Redux action is async but we aren't tracking local loading state for it here explicitly beyond assuming dispatch return.
                title="Erase Cluster?"
                message="This will permanently delete the category classification."
                itemName={categoryToDelete?.categoryName}
            />

            <CommonViewModal
                isOpen={!!selectedCategory || detailLoading}
                onClose={() => dispatch(clearSelectedCategory())}
                isDark={isDark}
                title={selectedCategory?.categoryName}
                subtitle="Category Profile"
                description={selectedCategory?.categoryDescription}
                images={selectedCategory?.categoryImage ? [selectedCategory.categoryImage] : []}
                loading={detailLoading}
                tags={[
                    {
                        label: selectedCategory?.categoryStatus,
                        className: selectedCategory?.categoryStatus === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10'
                            : 'bg-rose-500/10 text-rose-500 border-rose-500/10'
                    }
                ]}
                stats={[
                    { label: 'System ID', value: selectedCategory?._id, icon: FiActivity, color: 'text-indigo-400' }
                ]}
            />
        </div>
    );
};

export default Category;