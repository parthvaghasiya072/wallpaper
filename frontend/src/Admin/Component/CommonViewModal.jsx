import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const CommonViewModal = ({
    isOpen,
    onClose,
    isDark,
    title,
    subtitle,
    description,
    images = [], // Array of URLs
    stats = [], // Array of { label, value, icon, color, bg }
    tags = [], // Array of { label, className }
    children, // For custom content like lists
    loading = false
}) => {
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Reset active image when opening
    React.useEffect(() => {
        if (isOpen) setActiveImageIndex(0);
    }, [isOpen]);

    // Handle single image string
    const imageList = Array.isArray(images) ? images : (images ? [images] : []);

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `http://localhost:5000${path}`;
    };

    if (!isOpen) return null;

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
                        className={`relative w-full max-w-5xl min-h-[500px] max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row-reverse border border-white/5 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
                            }`}
                    >
                        {loading ? (
                            <div className="w-full h-full flex flex-col items-center justify-center space-y-4 py-20 lg:absolute lg:inset-0 z-20">
                                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                                <p className="text-[10px] uppercase font-black tracking-widest opacity-40">Loading details...</p>
                            </div>
                        ) : (
                            <>
                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-3xl border border-white/10 text-white hover:bg-rose-500 hover:border-rose-500 transition-all z-[60]"
                                >
                                    <FiX size={18} />
                                </button>

                                {/* Content Section (Right) */}
                                <div className={`w-full lg:w-1/2 flex flex-col h-full ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 sm:p-10 space-y-8">
                                        <div className="space-y-4">
                                            <div className="flex flex-wrap gap-2">
                                                {tags.map((tag, i) => (
                                                    <span key={i} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${tag.className}`}>
                                                        {tag.label}
                                                    </span>
                                                ))}
                                            </div>
                                            <div>
                                                {subtitle && <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">{subtitle}</p>}
                                                <h2 className="text-3xl font-black leading-tight tracking-tight">
                                                    {title}
                                                </h2>
                                            </div>
                                            <p className={`text-sm leading-relaxed font-medium opacity-70 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                {description}
                                            </p>
                                        </div>

                                        {/* Stats Grid */}
                                        {stats.length > 0 && (
                                            <div className="grid grid-cols-2 gap-4">
                                                {stats.map((stat, i) => (
                                                    <div key={i} className={`p-5 rounded-3xl border ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                                                        <div className={`flex items-center gap-2 mb-2 opacity-60 ${stat.color}`}>
                                                            {stat.icon && <stat.icon size={16} />}
                                                            <span className="text-[9px] font-black uppercase tracking-widest">{stat.label}</span>
                                                        </div>
                                                        <div className="text-xl font-black">{stat.value}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Custom Children */}
                                        {children && (
                                            <div className="space-y-4 pt-4 border-t border-dashed border-slate-500/20">
                                                {children}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Image Gallery Section (Left) */}
                                <div className={`w-full lg:w-1/2 relative group overflow-hidden min-h-[300px] lg:min-h-full border-b lg:border-b-0 lg:border-l lg:order-last transition-colors duration-500 ${isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                                        <AnimatePresence mode='wait'>
                                            {imageList.length > 0 ? (
                                                <motion.img
                                                    key={activeImageIndex}
                                                    initial={{ opacity: 0, scale: 1.1 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.5 }}
                                                    src={getImageUrl(imageList[activeImageIndex])}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                    alt={title}
                                                />
                                            ) : (
                                                <div className={`flex flex-col items-center justify-center w-full h-full relative overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
                                                    {/* Decorative Background Pattern */}
                                                    <div className="absolute inset-0 opacity-20">
                                                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply blur-3xl animate-blob" />
                                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-2000" />
                                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-4000" />
                                                    </div>

                                                    {/* Initials Avatar */}
                                                    {title ? (
                                                        <div className={`relative z-10 w-40 h-40 rounded-full flex items-center justify-center text-5xl font-black uppercase tracking-tighter backdrop-blur-md shadow-2xl border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white/40 border-white/40 text-slate-900'}`}>
                                                            {title.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center opacity-30 relative z-10">
                                                            <span className="text-xs font-black uppercase tracking-widest">No Visuals</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </AnimatePresence>

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent lg:hidden" />
                                    </div>

                                    {/* Gallery Controls */}
                                    {imageList.length > 1 && (
                                        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-30 opacity-0 group-hover:opacity-100 transition-all">
                                            <button
                                                disabled={activeImageIndex === 0}
                                                onClick={() => setActiveImageIndex(prev => prev - 1)}
                                                className={`w-10 h-10 flex items-center justify-center rounded-full ${isDark ? 'text-white bg-slate-800/20 border-slate-800' : 'text-black bg-slate-50 border-slate-100'} backdrop-blur-3xl border border-white/10 text-white transition-all pointer-events-auto disabled:opacity-0 hover:scale-110`}
                                            >
                                                <FiChevronLeft size={20} />
                                            </button>
                                            <button
                                                disabled={activeImageIndex === imageList.length - 1}
                                                onClick={() => setActiveImageIndex(prev => prev + 1)}
                                                className={`w-10 h-10 flex items-center justify-center rounded-full ${isDark ? 'text-white bg-slate-800/20 border-slate-800' : 'text-black bg-slate-50 border-slate-100'} backdrop-blur-3xl border border-white/10 text-white transition-all pointer-events-auto disabled:opacity-0 hover:scale-110`}
                                            >
                                                <FiChevronRight size={20} />
                                            </button>
                                        </div>
                                    )}

                                    {/* Dots Indicator */}
                                    {imageList.length > 1 && (
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                                            {imageList.map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`w-1.5 h-1.5 rounded-full transition-all ${idx === activeImageIndex ? 'bg-white w-4' : 'bg-white/40'}`}
                                                />
                                            ))}
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

export default CommonViewModal;
