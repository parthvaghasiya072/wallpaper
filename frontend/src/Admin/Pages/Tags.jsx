import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { FiPlus, FiTag, FiHash, FiInfo } from 'react-icons/fi';
import CommonTable from '../Component/CommonTable';
import AddTagModal from '../Component/AddTagModal';
import CommonDeleteModal from '../Component/CommonDeleteModal';
import CommonViewModal from '../Component/CommonViewModal';
import { useEffect } from 'react';
import { getAllTags, createTag, updateTag, deleteTag } from '../../redux/slices/tagslice';
import { useDispatch, useSelector } from 'react-redux';

const Tags = () => {
    const dispatch = useDispatch();
    const { isDark } = useOutletContext();

    useEffect(() => {
        dispatch(getAllTags());
    }, [dispatch]);

    const { tags, loading, error } = useSelector((state) => state.tag);


    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [viewItem, setViewItem] = useState(null);

    // ─── Handlers ─────────────────────────────────────────────────────────────────
    const handleOpenAdd = () => {
        setEditingItem(null);
        setIsAddModalOpen(true);
    };

    const handleEdit = (tag) => {
        setEditingItem(tag);
        setIsAddModalOpen(true);
    };

    const handleView = (tag) => {
        setViewItem(tag);
    };

    const handleDeleteInit = (tag) => {
        setItemToDelete(tag);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        dispatch(deleteTag(itemToDelete._id));
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
    };

    const handleFormSubmit = async (values, { setSubmitting }) => {
        try {
            if (editingItem) {
                await dispatch(updateTag({ id: editingItem._id, data: values })).unwrap();
            } else {
                await dispatch(createTag(values)).unwrap();
            }
            setIsAddModalOpen(false);
        } catch (err) {
            console.error("Failed to submit form:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            header: 'Identity',
            accessor: 'tagTitle',
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                        <FiHash size={14} />
                    </div>
                    <span className={`font-black tracking-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {item.tagTitle}
                    </span>
                </div>
            )
        },
        {
            header: 'Scope',
            accessor: 'tagDescription',
            render: (item) => (
                <p className={`text-xs truncate max-w-[200px] md:max-w-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {item.tagDescription}
                </p>
            )
        },
        {
            header: 'Timestamp',
            accessor: 'createdAt',
            render: (item) => (
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                    {new Date(item.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                </span>
            )
        }
    ];

    return (
        <div className="p-0 sm:p-2">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ${isDark ? 'bg-slate-900 text-indigo-400 border border-slate-800' : 'bg-white text-indigo-600'}`}>
                        <FiTag size={28} />
                    </div>
                    <div>
                        <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Tags Registry
                        </h1>
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-30">Classification Management System</p>
                    </div>
                </div>

                <button
                    onClick={handleOpenAdd}
                    className="flex items-center justify-center gap-3 px-6 py-3 bg-indigo-600 hover:bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                >
                    <FiPlus size={18} /> Register New Tag
                </button>
            </div>

            {/* Table Container */}
            {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-[2rem] overflow-hidden border ${isDark ? 'bg-[#0f172a] border-slate-800 shadow-2xl' : 'bg-white border-slate-100 shadow-xl'}`}
            >
                <CommonTable
                    columns={columns}
                    data={tags}
                    isDark={isDark}
                    onEdit={handleEdit}
                    onView={handleView}
                    onDelete={handleDeleteInit}
                    searchPlaceholder="Search tags by title or scope..."
                    itemsPerPage={5}
                />
            </motion.div> */}
            <div className="w-full">
                {loading ? (
                    <div className="flex justify-center items-center h-80">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-[10px] uppercase font-black tracking-widest opacity-30">Loading Canvas...</span>
                        </div>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                        <CommonTable
                            columns={columns}
                            data={tags}
                            isDark={isDark}
                            onEdit={handleEdit}
                            onView={handleView}
                            onDelete={handleDeleteInit}
                            searchPlaceholder="Filter tags..."
                            itemsPerPage={5}
                        />
                    </motion.div>
                )}
            </div>

            {/* Form Modal */}
            <AddTagModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                isDark={isDark}
                onSubmit={handleFormSubmit}
                editingItem={editingItem}
            />

            {/* Delete Modal */}
            <CommonDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                isDark={isDark}
                title="Discard Tag?"
                message="This will remove the classification tag permanently. All associated products will lose this reference."
                itemName={itemToDelete?.tagTitle}
            />

            {/* View Modal */}
            <CommonViewModal
                isOpen={!!viewItem}
                onClose={() => setViewItem(null)}
                isDark={isDark}
                title={viewItem?.tagTitle}
                subtitle="Tag Profile"
                description={viewItem?.tagDescription}
                tags={[
                    { label: 'Classification', className: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/10' }
                ]}
                stats={[
                    { label: 'Created On', value: viewItem ? new Date(viewItem.createdAt).toLocaleDateString() : 'N/A', icon: FiInfo, color: 'text-slate-400' }
                ]}
            />
        </div>
    );
};

export default Tags;