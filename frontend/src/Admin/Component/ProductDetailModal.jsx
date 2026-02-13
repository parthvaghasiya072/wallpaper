import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiX, FiChevronLeft, FiChevronRight,
    FiBox, FiActivity, FiPaperclip
} from 'react-icons/fi';

const ProductDetailModal = ({
    product,
    isOpen,
    onClose,
    isDark,
    activeImageIndex,
    setActiveImageIndex,
    loading
}) => {
    if (!isOpen) return null;

    // Helper to handle image paths (both local and external)
    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `http://localhost:5000${path}`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
                    {/* Immersive Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={`relative w-full max-w-4xl min-h-[500px] max-h-[85vh] overflow-hidden rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row-reverse border border-white/5 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
                            }`}
                    >
                        {loading ? (
                            <div className="w-full h-full flex flex-col items-center justify-center space-y-4 py-20">
                                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                                <p className="text-[10px] uppercase font-black tracking-widest opacity-40">Fetching Masterpiece...</p>
                            </div>
                        ) : !product ? (
                            <div className="w-full h-full flex items-center justify-center py-20">
                                <p className="text-sm opacity-40 italic">Asset not found.</p>
                            </div>
                        ) : (
                            <>
                                {/* Global Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-3xl border border-white/10 text-white hover:bg-rose-500 hover:border-rose-500 transition-all z-[60]"
                                >
                                    <FiX size={18} />
                                </button>

                                {/* Image Section (Appears on Right) */}
                                <div className={`w-full lg:w-1/2 flex flex-col h-full overflow-y-auto custom-scrollbar p-10 space-y-8 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                                    <div className="space-y-4">
                                        <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 rounded-full text-[9px] font-black uppercase tracking-widest">
                                            {product.category}
                                        </span>
                                        <h2 className="text-3xl font-black leading-tight tracking-tight">
                                            {product.titleName}
                                        </h2>
                                        <p className={`text-sm leading-relaxed font-medium opacity-70 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                            {product.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
                                            <div className="flex items-center gap-2 mb-2 text-indigo-400 opacity-60">
                                                <FiBox size={16} />
                                                <span className="text-[9px] font-black uppercase tracking-widest">Inventory</span>
                                            </div>
                                            <div className="text-2xl font-black">{product.stocks} <span className="text-[10px] font-bold opacity-30">PCS</span></div>
                                        </div>
                                        <div className="p-5 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                                            <div className="flex items-center gap-2 mb-2 text-emerald-400 opacity-60">
                                                <FiActivity size={16} />
                                                <span className="text-[9px] font-black uppercase tracking-widest">Status</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                <span className="text-lg font-black uppercase tracking-tight">Active</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Material Pricing</h4>
                                        <div className="space-y-2">
                                            {product.paperOptions?.map((opt, i) => (
                                                <div
                                                    key={i}
                                                    className={`flex items-center justify-between p-4 rounded-2xl border ${isDark ? 'bg-slate-800/20 border-slate-800' : 'bg-slate-50 border-slate-100'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                                            <FiPaperclip size={18} />
                                                        </div>
                                                        <span className="text-sm font-black">{opt.paperType}</span>
                                                    </div>
                                                    <span className={`text-xl font-black ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                                        ${opt.pricePerSqFt} <span className="text-[10px] opacity-30">/FT²</span>
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={onClose}
                                        className="w-full py-4 bg-indigo-600 hover:bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center"
                                    >
                                        Close Details
                                    </button>
                                </div>

                                {/* Info Section (Appears on Left) */}
                                <div className={`w-full lg:w-1/2 relative group overflow-hidden border-b lg:border-b-0 lg:border-l transition-colors duration-500 ${isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                                        <AnimatePresence mode='wait'>
                                            <motion.img
                                                key={activeImageIndex}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                src={getImageUrl(product.images[activeImageIndex])}
                                                className="w-full h-full object-cover"
                                                alt={product.titleName}
                                            />
                                        </AnimatePresence>
                                    </div>

                                    {/* Gallery Controls */}
                                    {product.images.length > 1 && (
                                        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-30 opacity-0 group-hover:opacity-100 transition-all">
                                            <button
                                                disabled={activeImageIndex === 0}
                                                onClick={() => setActiveImageIndex(prev => prev - 1)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-full ${isDark ? 'text-white bg-slate-800/20 border-slate-800' : 'text-black bg-slate-50 border-slate-100'} backdrop-blur-3xl border border-white/10 text-white transition-all pointer-events-auto  disabled:opacity-0`}
                                            >
                                                <FiChevronLeft size={20} />
                                            </button>
                                            <button
                                                disabled={activeImageIndex === product.images.length - 1}
                                                onClick={() => setActiveImageIndex(prev => prev + 1)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-full ${isDark ? 'text-white bg-slate-800/20 border-slate-800' : 'text-black bg-slate-50 border-slate-100'} backdrop-blur-3xl border border-white/10 text-white transition-all pointer-events-auto  disabled:opacity-0`}
                                            >
                                                <FiChevronRight size={20} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProductDetailModal;
