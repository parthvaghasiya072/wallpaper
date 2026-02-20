import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiAlertTriangle } from 'react-icons/fi';

const Backdrop = ({ onClose, isDark, children }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[500] flex items-center justify-center p-4 "
        style={{
            background: isDark ? 'rgba(2,6,23,0.8)' : 'rgba(15,23,42,0.6)',
            backdropFilter: 'blur(8px)',
        }}
        onClick={onClose}
    >
        {children}
    </motion.div>
);

const CommonDeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Deletion",
    message = "Are you sure you want to delete this item?",
    itemName,
    isDark,
    loading = false
}) => {

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape' && !loading) onClose(); };
        if (isOpen) window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, loading, onClose]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <Backdrop onClose={() => !loading && onClose()} isDark={isDark}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className={`relative w-full max-w-sm rounded-[2.5rem] p-8 text-center shadow-2xl overflow-hidden ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}
                    >
                        {/* Top colour stripe */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-orange-500" />

                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 transition-colors ${isDark ? 'bg-rose-500/10 text-rose-500' : 'bg-rose-50 text-rose-500'}`}>
                            <FiTrash2 size={36} />
                        </div>

                        <h3 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {title}
                        </h3>

                        <p className={`text-sm font-medium leading-relaxed mb-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {message}
                            {itemName && (
                                <span className={`block mt-1 font-bold ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>
                                    "{itemName}"
                                </span>
                            )}
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={onConfirm}
                                disabled={loading}
                                className="w-full py-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-rose-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <FiAlertTriangle size={16} /> Delete Permanently
                                    </>
                                )}
                            </button>
                            <button
                                onClick={onClose}
                                disabled={loading}
                                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </Backdrop>
            )}
        </AnimatePresence>
    );
};

export default CommonDeleteModal;
