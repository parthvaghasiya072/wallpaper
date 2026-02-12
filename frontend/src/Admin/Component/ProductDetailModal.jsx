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
    setActiveImageIndex
}) => {
    if (!product) return null;

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
                        className={`relative w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row border border-white/5 ${isDark ? 'bg-slate-900' : 'bg-white'
                            }`}
                    >
                        {/* Left: The Visual Gallery */}
                        <div className={`w-full lg:w-1/2 relative flex items-center justify-center group overflow-hidden border-b lg:border-b-0 lg:border-r transition-colors duration-500 ${isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-100'
                            }`}>
                            {/* Ambient Light Bleed */}
                            <AnimatePresence mode='wait'>
                                <motion.div
                                    key={activeImageIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.3 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0"
                                >
                                    <img
                                        src={product.images[activeImageIndex]}
                                        className="w-full h-full object-cover blur-[80px]"
                                        alt=""
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Product Image */}
                            <div className="relative z-10 w-full h-full flex items-center justify-center p-6 lg:p-12">
                                <AnimatePresence mode='wait'>
                                    <motion.img
                                        key={activeImageIndex}
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                        src={product.images[activeImageIndex]}
                                        className="max-w-full max-h-[400px] object-contain rounded-lg shadow-2xl border border-white/10"
                                        alt={product.titleName}
                                    />
                                </AnimatePresence>
                            </div>

                            {/* Controls */}
                            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-30 opacity-0 group-hover:opacity-100 transition-all">
                                <button
                                    disabled={activeImageIndex === 0}
                                    onClick={() => setActiveImageIndex(prev => prev - 1)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 text-white transition-all pointer-events-auto hover:bg-white hover:text-black disabled:opacity-0"
                                >
                                    <FiChevronLeft size={20} />
                                </button>
                                <button
                                    disabled={activeImageIndex === product.images.length - 1}
                                    onClick={() => setActiveImageIndex(prev => prev + 1)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 text-white transition-all pointer-events-auto hover:bg-white hover:text-black disabled:opacity-0"
                                >
                                    <FiChevronRight size={20} />
                                </button>
                            </div>

                            {/* Thumbnails */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-white/5 backdrop-blur-3xl rounded-[1.5rem] border border-white/10 z-30">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImageIndex(i)}
                                        className={`relative w-10 h-10 rounded-xl overflow-hidden transition-all ${activeImageIndex === i ? 'ring-2 ring-indigo-500 scale-110' : 'opacity-40 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" alt="" />
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={onClose}
                                className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 backdrop-blur-3xl border border-white/10 text-white hover:bg-rose-500 hover:border-rose-500 transition-all z-30"
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        {/* Right: Info Column */}
                        <div className={`w-full lg:w-1/2 flex flex-col h-full overflow-y-auto custom-scrollbar p-10 space-y-8 ${isDark ? 'text-slate-100' : 'text-slate-900'
                            }`}>
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
                                    {product.paperOptions.map((opt, i) => (
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
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProductDetailModal;
