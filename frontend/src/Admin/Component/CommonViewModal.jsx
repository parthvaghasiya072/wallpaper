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
                        className={`relative w-full max-w-5xl md:min-h-[600px] max-h-[92vh] overflow-hidden rounded-3xl lg:rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] flex flex-col md:flex-row border border-white/5 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
                            }`}
                    >
                        {loading ? (
                            <div className="w-full h-full flex flex-col items-center justify-center space-y-4 py-20 lg:absolute lg:inset-0 z-20">
                                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                                <p className="text-[10px] uppercase font-black tracking-widest opacity-40">Loading details...</p>
                            </div>
                        ) : (
                            <>
                                {/* Close Button - Accessible z-index and positioning */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900/40 backdrop-blur-3xl border border-white/10 text-white hover:bg-rose-500 hover:border-rose-500 transition-all z-[70] shadow-2xl"
                                >
                                    <FiX size={18} />
                                </button>

                                {/* 1. Image Gallery Section (Top on mobile, Left on tablet+) */}
                                <div className={`w-full md:w-1/2 relative group overflow-hidden h-[300px] sm:h-[400px] md:h-auto border-b md:border-b-0 md:border-r transition-colors duration-500 ${isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
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
                                                    <div className="absolute inset-0 opacity-20">
                                                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply blur-3xl animate-blob" />
                                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-2000" />
                                                    </div>
                                                    {title ? (
                                                        <div className={`relative z-10 w-32 h-32 lg:w-40 lg:h-40 rounded-full flex items-center justify-center text-4xl lg:text-5xl font-black uppercase tracking-tighter backdrop-blur-md shadow-2xl border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white/40 border-white/40 text-slate-900'}`}>
                                                            {title.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-30">No Visualization</span>
                                                    )}
                                                </div>
                                            )}
                                        </AnimatePresence>
                                        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                    </div>

                                    {/* Gallery Controls */}
                                    {imageList.length > 1 && (
                                        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-30 md:opacity-0 group-hover:opacity-100 transition-all">
                                            <button
                                                disabled={activeImageIndex === 0}
                                                onClick={() => setActiveImageIndex(prev => prev - 1)}
                                                className={`w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center rounded-full bg-slate-900/30 backdrop-blur-3xl border border-white/10 text-white transition-all pointer-events-auto disabled:opacity-0 hover:scale-110 shadow-lg`}
                                            >
                                                <FiChevronLeft size={18} />
                                            </button>
                                            <button
                                                disabled={activeImageIndex === imageList.length - 1}
                                                onClick={() => setActiveImageIndex(prev => prev + 1)}
                                                className={`w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center rounded-full bg-slate-900/30 backdrop-blur-3xl border border-white/10 text-white transition-all pointer-events-auto disabled:opacity-0 hover:scale-110 shadow-lg`}
                                            >
                                                <FiChevronRight size={18} />
                                            </button>
                                        </div>
                                    )}

                                    {/* Dots Indicator */}
                                    {imageList.length > 1 && (
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
                                            {imageList.map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`h-1 rounded-full transition-all ${idx === activeImageIndex ? 'bg-white w-5' : 'bg-white/40 w-1.5'}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* 2. Content Section (Bottom on mobile, Right on tablet+) */}
                                <div className={`w-full md:w-1/2 flex flex-col min-h-0 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                                    <div className="relative flex-1 flex flex-col min-h-0">
                                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 space-y-8">
                                            <div className="space-y-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {tags.map((tag, i) => (
                                                        <span key={i} className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border ${tag.className}`}>
                                                            {tag.label}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="pr-12 md:pr-0">
                                                    {subtitle && <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1 lg:mb-2">{subtitle}</p>}
                                                    <h2 className="text-2xl md:text-3xl font-black leading-tight tracking-tight">
                                                        {title}
                                                    </h2>
                                                </div>
                                                <p className={`text-xs md:text-sm leading-relaxed font-medium opacity-70 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    {description}
                                                </p>
                                            </div>

                                            {/* Stats Grid - Responsive columns */}
                                            {stats.length > 0 && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                                                    {stats.map((stat, i) => (
                                                        <div key={i} className={`p-4 lg:p-5 rounded-2xl lg:rounded-3xl border transition-colors ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                                                            <div className={`flex items-center gap-2 mb-1.5 lg:mb-2 opacity-60 ${stat.color}`}>
                                                                {stat.icon && <stat.icon size={14} className="lg:size-[16px]" />}
                                                                <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest">{stat.label}</span>
                                                            </div>
                                                            <div className="text-lg lg:text-xl font-black truncate" title={stat.value.toString()}>
                                                                {stat.value}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Custom Children */}
                                            {children && (
                                                <div className="space-y-4 pt-4 border-t border-dashed border-slate-500/10">
                                                    {children}
                                                </div>
                                            )}
                                        </div>

                                        {/* Bottom Scroll Indicator Gradient */}
                                        <div className={`absolute bottom-0 left-0 right-0 h-10 pointer-events-none z-10 ${isDark ? 'bg-gradient-to-t from-slate-900 to-transparent' : 'bg-gradient-to-t from-white to-transparent'}`} />
                                    </div>
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
