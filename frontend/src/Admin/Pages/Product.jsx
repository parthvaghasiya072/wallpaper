import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import {
    FiPlus,
    FiSearch,
    FiGrid,
    FiList,
    FiImage,
    FiTrash2,
    FiEdit3,
    FiX,
    FiCheck,
    FiPaperclip,
    FiDollarSign,
    FiBox,
    FiChevronDown,
    FiFilter
} from 'react-icons/fi';

const Product = () => {
    const { isDark } = useOutletContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewType, setViewType] = useState('grid');

    // Form State
    const [formData, setFormData] = useState({
        titleName: '',
        description: '',
        stocks: '',
        category: '',
        images: [],
        paperOptions: [{ paperType: '', pricePerSqFt: '' }]
    });

    // Mock Data for Demo
    const [products, setProducts] = useState([
        {
            id: 1,
            titleName: 'Abstract Ocean Blue',
            category: 'Abstract',
            stocks: 45,
            description: 'A deep blue abstract ocean wallpaper for modern homes.',
            images: ['https://images.unsplash.com/photo-1541701494587-cb58502866ab'],
            paperOptions: [{ paperType: 'Premium Silk', pricePerSqFt: 15 }]
        },
        {
            id: 2,
            titleName: 'Mountain Sunset',
            category: 'Nature',
            stocks: 12,
            description: 'Beautiful sunset over the mountains in vivid colors.',
            images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b'],
            paperOptions: [{ paperType: 'Vinyl Matte', pricePerSqFt: 22 }]
        }
    ]);

    const handleAddPaperOption = () => {
        setFormData({
            ...formData,
            paperOptions: [...formData.paperOptions, { paperType: '', pricePerSqFt: '' }]
        });
    };

    const handleRemovePaperOption = (index) => {
        const newOptions = [...formData.paperOptions];
        newOptions.splice(index, 1);
        setFormData({ ...formData, paperOptions: newOptions });
    };

    const handlePaperOptionChange = (index, field, value) => {
        const newOptions = [...formData.paperOptions];
        newOptions[index][field] = value;
        setFormData({ ...formData, paperOptions: newOptions });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally dispatch to Redux or call an API
        const newProduct = {
            ...formData,
            id: Date.now(),
            images: formData.images.length > 0 ? formData.images : ['https://via.placeholder.com/300']
        };
        setProducts([newProduct, ...products]);
        setIsModalOpen(false);
        setFormData({
            titleName: '',
            description: '',
            stocks: '',
            category: '',
            images: [],
            paperOptions: [{ paperType: '', pricePerSqFt: '' }]
        });
    };

    return (
        <div className="space-y-8 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 transition-all shadow-sm">
                <div className="flex flex-col">
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Product Management</h1>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Manage your wallpaper collection and pricing.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <FiSearch className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="bg-transparent border-none outline-none text-sm w-48"
                        />
                    </div>

                    <div className={`flex items-center gap-1 p-1 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <button
                            onClick={() => setViewType('grid')}
                            className={`p-2 rounded-lg ${viewType === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                        >
                            <FiGrid />
                        </button>
                        <button
                            onClick={() => setViewType('list')}
                            className={`p-2 rounded-lg ${viewType === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                        >
                            <FiList />
                        </button>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
                    >
                        <FiPlus /> Add Wallpaper
                    </button>
                </div>
            </div>

            {/* Products Grid */}
            <div className={`grid ${viewType === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
                <AnimatePresence>
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`group relative overflow-hidden rounded-[2rem] border transition-all ${isDark ? 'bg-slate-800/40 border-slate-800 hover:border-indigo-500/30' : 'bg-white border-white shadow-sm hover:shadow-xl hover:shadow-indigo-500/5'
                                }`}
                        >
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={product.images[0]}
                                    alt={product.titleName}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-indigo-600 transition-all">
                                        <FiEdit3 size={16} />
                                    </button>
                                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-rose-600 transition-all">
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                                <div className="absolute bottom-3 left-4">
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-widest">
                                        {product.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <h3 className={`font-bold text-lg truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{product.titleName}</h3>
                                    <p className={`text-xs mt-1 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{product.description}</p>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">Low Price</span>
                                        <span className={`text-lg font-black ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                            ${Math.min(...product.paperOptions.map(o => o.pricePerSqFt))}/ft²
                                        </span>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">Stock</span>
                                        <span className={`text-sm font-bold ${product.stocks < 10 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                            {product.stocks} pcs
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Add Product Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className={`relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl ${isDark ? 'bg-[#0f172a] border border-slate-800' : 'bg-white border-white'
                                }`}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-10 py-8 border-b border-slate-200 dark:border-slate-800">
                                <div>
                                    <h2 className={`text-2xl font-black title-font ${isDark ? 'text-white' : 'text-slate-900'}`}>New Wallpaper</h2>
                                    <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Add an artistic masterpiece to your collection.</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className={`p-3 rounded-2xl transition-all ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-180px)] p-10 space-y-8 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Title */}
                                    <div className="space-y-2">
                                        <label className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Wallpaper Title</label>
                                        <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                                            }`}>
                                            <FiEdit3 className="text-slate-400" />
                                            <input
                                                required
                                                value={formData.titleName}
                                                onChange={(e) => setFormData({ ...formData, titleName: e.target.value })}
                                                type="text"
                                                placeholder="e.g., Midnight Forest"
                                                className="bg-transparent border-none outline-none text-sm w-full"
                                            />
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <div className="space-y-2">
                                        <label className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Category</label>
                                        <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                                            }`}>
                                            <FiGrid className="text-slate-400" />
                                            <select
                                                required
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="bg-transparent border-none outline-none text-sm w-full appearance-none pr-8"
                                            >
                                                <option value="" disabled>Select Category</option>
                                                <option value="Abstract">Abstract</option>
                                                <option value="Nature">Nature</option>
                                                <option value="Cyberpunk">Cyberpunk</option>
                                                <option value="Minimalist">Minimalist</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Stock */}
                                    <div className="space-y-2">
                                        <label className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Available Stocks</label>
                                        <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                                            }`}>
                                            <FiBox className="text-slate-400" />
                                            <input
                                                required
                                                value={formData.stocks}
                                                onChange={(e) => setFormData({ ...formData, stocks: e.target.value })}
                                                type="number"
                                                placeholder="Quantity"
                                                className="bg-transparent border-none outline-none text-sm w-full"
                                            />
                                        </div>
                                    </div>

                                    {/* Images (Placeholder for now) */}
                                    <div className="space-y-2">
                                        <label className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Wallpaper Preview URL</label>
                                        <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                                            }`}>
                                            <FiImage className="text-slate-400" />
                                            <input
                                                value={formData.images[0] || ''}
                                                onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                                                type="text"
                                                placeholder="https://..."
                                                className="bg-transparent border-none outline-none text-sm w-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Artwork Description</label>
                                    <div className={`px-5 py-3 rounded-2xl border transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                                        }`}>
                                        <textarea
                                            required
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows="3"
                                            placeholder="Tell a story about this wallpaper..."
                                            className="bg-transparent border-none outline-none text-sm w-full resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Paper Options (Dynamic) */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Paper & Pricing Options</label>
                                        <button
                                            type="button"
                                            onClick={handleAddPaperOption}
                                            className="text-[10px] font-black uppercase bg-indigo-600/10 text-indigo-500 px-3 py-1 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
                                        >
                                            + Add Material
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {formData.paperOptions.map((opt, index) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                key={index}
                                                className="flex items-center gap-3"
                                            >
                                                <div className={`flex-1 flex gap-3 px-4 py-2 rounded-xl border ${isDark ? 'bg-slate-900/40 border-slate-700' : 'bg-slate-100 border-slate-200'
                                                    }`}>
                                                    <input
                                                        required
                                                        value={opt.paperType}
                                                        onChange={(e) => handlePaperOptionChange(index, 'paperType', e.target.value)}
                                                        placeholder="e.g., Silk"
                                                        className="bg-transparent border-none outline-none text-xs font-bold flex-1"
                                                    />
                                                    <div className="w-px h-6 bg-slate-700/20" />
                                                    <div className="flex items-center gap-1">
                                                        <FiDollarSign size={12} className="text-slate-400" />
                                                        <input
                                                            required
                                                            value={opt.pricePerSqFt}
                                                            onChange={(e) => handlePaperOptionChange(index, 'pricePerSqFt', e.target.value)}
                                                            type="number"
                                                            placeholder="0.00"
                                                            className="bg-transparent border-none outline-none text-xs font-bold w-16"
                                                        />
                                                    </div>
                                                </div>
                                                {formData.paperOptions.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemovePaperOption(index)}
                                                        className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="flex items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className={`flex-1 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                            }`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-3"
                                    >
                                        Register Artwork <FiCheck size={18} />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Product;
