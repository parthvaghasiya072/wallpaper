import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { FiPlus, FiImage } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import CommonTable from '../Component/CommonTable';
import AddHeroSectionModal from '../Component/AddHeroSectionModal';
import CommonDeleteModal from '../Component/CommonDeleteModal';
import CommonViewModal from '../Component/CommonViewModal';
import { getHeroSections, deleteHeroSection } from '../../redux/slices/heroSlice';

const HeroSection = () => {
    const { isDark } = useOutletContext();
    const dispatch = useDispatch();
    const { heroSections, loading } = useSelector((state) => state.hero || { heroSections: [], loading: false });

    // Modals state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [viewItem, setViewItem] = useState(null);

    useEffect(() => {
        dispatch(getHeroSections());
    }, [dispatch]);

    // ─── Handlers ─────────────────────────────────────────────────────────────────
    const handleOpenAdd = () => {
        setEditingItem(null);
        setIsAddModalOpen(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsAddModalOpen(true);
    };

    const handleView = (item) => {
        setViewItem(item);
    };

    const handleDeleteInit = (item) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (itemToDelete) {
            dispatch(deleteHeroSection(itemToDelete._id)).then(() => {
                setIsDeleteModalOpen(false);
                setItemToDelete(null);
            });
        }
    };

    const columns = [
        {
            header: 'Visual',
            accessor: 'image',
            render: (item) => (
                <div className={`p-2 rounded-lg ${isDark ? 'bg-[#132846]' : 'bg-slate-100'} w-24 h-16 flex-shrink-0 overflow-hidden`}>
                    <img
                        src={item.image?.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-md transition-transform duration-500 hover:scale-125"
                    />
                </div>
            )
        },
        {
            header: 'Content',
            accessor: 'title',
            render: (item) => (
                <div className="flex flex-col gap-1">
                    <span className={`font-black text-sm tracking-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{item.title}</span>
                    <span className={`text-[11px] truncate max-w-xs font-medium leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {item.description}
                    </span>
                </div>
            )
        }
    ];

    return (
        <div className="">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8">
                <div className="flex flex-col">
                    <h1 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>
                        Hero Canvas
                    </h1>
                    <p className="text-[10px] opacity-30 uppercase tracking-[0.2em]">
                        Management & Homepage Rotation
                    </p>
                </div>

                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-lg transition-all shadow-lg"
                >
                    <FiPlus size={16} /> New Slide
                </button>
            </div>

            {/* Table */}
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
                            data={heroSections}
                            isDark={isDark}
                            onEdit={handleEdit}
                            onView={handleView}
                            onDelete={handleDeleteInit}
                            searchPlaceholder="Filter hero slides..."
                            itemsPerPage={5}
                        />
                    </motion.div>
                )}
            </div>

            {/* Modals */}
            <AddHeroSectionModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                isDark={isDark}
                editingItem={editingItem}
            />

            <CommonDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                isDark={isDark}
                loading={false}
                title="Remove Slide?"
                message="This will remove the slide from the homepage rotation."
                itemName={itemToDelete?.title}
            />

            <CommonViewModal
                isOpen={!!viewItem}
                onClose={() => setViewItem(null)}
                isDark={isDark}
                title={viewItem?.title}
                subtitle="Hero Banner"
                description={viewItem?.description}
                images={viewItem?.image ? [viewItem.image] : []}
                stats={[]}
            />
        </div>
    );
};

export default HeroSection;