import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiPlus, FiImage, FiActivity } from 'react-icons/fi';
import CommonTable from '../Component/CommonTable';
import AddBannerModal from '../Component/AddBannerModel';
import CommonViewModal from '../Component/CommonViewModal';
import CommonDeleteModal from '../Component/CommonDeleteModal';
import {
    getAllBanners,
    createBanner,
    getSingleBanner,
    updateBannerById,
    deleteBannerById,
    clearSelectedBanner
} from "../../redux/slices/bannerSlice";

// Helper for image URL
const getImageUrl = (image) => {
    if (!image) return null;
    if (typeof image === 'string') {
        return image.startsWith('http') ? image : `http://localhost:5000${image}`;
    }
    return URL.createObjectURL(image);
};

const Banner = () => {
    const { isDark } = useOutletContext();
    const dispatch = useDispatch();

    const { banners, totalPages, currentPage, totalBanners, loading, detailLoading, selectedBanner, error } = useSelector((state) => state.banners);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setPage(1); // Reset to first page on search
    }, [searchTerm]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            dispatch(getAllBanners({ page, limit: rowsPerPage, search: searchTerm }));
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [dispatch, page, rowsPerPage, searchTerm]);

    const columns = useMemo(() => [
        {
            header: 'Banner',
            accessor: 'title',
            render: (item) => (
                <div className="flex items-center gap-4">
                    <div className={`w-20 h-10 rounded-md flex items-center justify-center overflow-hidden bg-slate-100 ${isDark ? 'bg-slate-800' : ''}`}>
                        {item.image ? (
                            <img
                                src={getImageUrl(item.image)}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <FiImage size={20} className="text-indigo-500" />
                        )}
                    </div>
                    <div>
                        <span className={`font-black text-sm tracking-tight block ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Description',
            accessor: 'description',
            render: (item) => (
                <span className={`text-xs opacity-60 line-clamp-1 max-w-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {item.description}
                </span>
            )
        }
    ], [isDark]);

    const handleOpenViewModal = (banner) => {
        dispatch(clearSelectedBanner());
        setIsViewModalOpen(true);
        dispatch(getSingleBanner(banner._id));
    };

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        dispatch(clearSelectedBanner());
    };

    const handleOpenAddModal = () => {
        setEditingBanner(null);
        setIsAddModalOpen(true);
    };

    const handleOpenEditModal = (banner) => {
        setEditingBanner(banner);
        setIsAddModalOpen(true);
    };

    const handleOpenDeleteModal = (banner) => {
        setBannerToDelete(banner);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!bannerToDelete) return;
        setDeleteLoading(true);
        dispatch(deleteBannerById(bannerToDelete._id)).then((res) => {
            if (res.meta.requestStatus === 'fulfilled') {
                setIsDeleteModalOpen(false);
                setBannerToDelete(null);
                // Refresh to ensure pagination stays in sync
                dispatch(getAllBanners({ page, limit: rowsPerPage, search: searchTerm }));
            }
            setDeleteLoading(false);
        });
    };

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        const data = new FormData();
        data.append('title', values.title);
        data.append('description', values.description);

        if (values.image instanceof File) {
            data.append('image', values.image);
        }

        if (editingBanner) {
            dispatch(updateBannerById({ id: editingBanner._id, data })).then((res) => {
                if (res.meta.requestStatus === 'fulfilled') {
                    setIsAddModalOpen(false);
                    resetForm();
                    setEditingBanner(null);
                    dispatch(getAllBanners({ page, limit: rowsPerPage, search: searchTerm }));
                }
                setSubmitting(false);
            });
        } else {
            dispatch(createBanner(data)).then((res) => {
                if (res.meta.requestStatus === 'fulfilled') {
                    setIsAddModalOpen(false);
                    resetForm();
                    setSearchTerm(''); // Show newest creation
                    dispatch(getAllBanners({ page: 1, limit: rowsPerPage, search: '' }));
                }
                setSubmitting(false);
            });
        }
    };

    return (
        <div className="">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className={`text-4xl font-black tracking-tighter flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Banner <span className="text-indigo-500">Hub</span>
                    </h1>
                    <p className="text-sm font-medium opacity-50 mt-1 uppercase tracking-[0.3em] flex items-center gap-2">
                        <span className="w-4 h-1 bg-indigo-500 rounded-full" /> Promo Management System
                    </p>
                </motion.div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button
                        onClick={handleOpenAddModal}
                        className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-3.5 bg-indigo-600 hover:bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                    >
                        <FiPlus size={18} /> New Banner
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
                                data={banners}
                                isDark={isDark}
                                onView={handleOpenViewModal}
                                onEdit={handleOpenEditModal}
                                onDelete={handleOpenDeleteModal}
                                searchPlaceholder="Scan banner hub..."
                                searchTerm={searchTerm}
                                onSearch={setSearchTerm}
                                serverTotalPages={totalPages}
                                serverCurrentPage={currentPage}
                                totalRecordsCount={totalBanners}
                                onPageChange={(newPage) => setPage(newPage)}
                                onRowsPerPageChange={(newLimit) => {
                                    setRowsPerPage(newLimit);
                                    setPage(1);
                                }}
                                itemsPerPage={rowsPerPage}
                            />
                        )}
                    </div>
                </motion.div>
            </div>

            <AddBannerModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                isDark={isDark}
                onSubmit={handleSubmit}
                editingBanner={editingBanner}
            />

            <CommonDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setBannerToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                isDark={isDark}
                loading={deleteLoading}
                title="Erase Banner?"
                message="This will permanently delete the promotional banner."
                itemName={bannerToDelete?.title}
            />

            <CommonViewModal
                isOpen={isViewModalOpen}
                onClose={handleCloseViewModal}
                isDark={isDark}
                loading={detailLoading}
                title={selectedBanner?.title}
                subtitle="Banner Profile"
                description={selectedBanner?.description}
                images={selectedBanner?.image ? [selectedBanner.image] : []}
                stats={[
                    { label: 'System ID', value: selectedBanner?._id?.substring(0, 8), icon: FiActivity, color: 'text-indigo-400' },
                    { label: 'Created On', value: selectedBanner?.createdAt ? new Date(selectedBanner.createdAt).toLocaleDateString() : 'N/A', icon: FiActivity, color: 'text-emerald-400' },
                    { label: 'Last Sync', value: selectedBanner?.updatedAt ? new Date(selectedBanner.updatedAt).toLocaleTimeString() : 'N/A', icon: FiActivity, color: 'text-amber-400' }
                ]}
            />
        </div>
    );
};

export default Banner;