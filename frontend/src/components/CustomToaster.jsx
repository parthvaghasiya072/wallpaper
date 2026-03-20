import React from 'react';
import toast, { Toaster, resolveValue } from 'react-hot-toast';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const CustomToaster = () => {
    return (
        <Toaster position="top-right" duration={4000}>
            {(t) => (
                <AnimatePresence>
                    {t.visible && (
                        <motion.div
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            className={`${t.visible ? 'animate-enter' : 'animate-leave'
                                } max-w-md w-full bg-white/95 backdrop-blur-xl pointer-events-auto flex ring-1 ring-black/5 rounded-[1.5rem] shadow-[0_25px_60px_-15px_rgba(249,115,22,0.2)] overflow-hidden border border-orange-100/50`}
                            style={{
                                borderLeft: `6px solid ${t.type === 'success' ? '#10B981' :
                                        t.type === 'error' ? '#EF4444' : '#F97316'
                                    }`
                            }}
                        >
                            <div className="flex-1 w-0 p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 pt-0.5">
                                        {t.type === 'success' ? (
                                            <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 shadow-inner">
                                                <FiCheckCircle size={20} />
                                            </div>
                                        ) : t.type === 'error' ? (
                                            <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 shadow-inner">
                                                <FiAlertCircle size={20} />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner">
                                                <FiInfo size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600/50 mb-0.5">
                                            {t.type === 'success' ? 'System Success' : t.type === 'error' ? 'System Error' : 'Notification'}
                                        </p>
                                        <p className="text-sm font-black text-primary italic leading-tight">
                                            {resolveValue(t.message, t)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex border-l border-gray-100">
                                <button
                                    onClick={() => toast.dismiss(t.id)}
                                    className="w-full border border-transparent rounded-none rounded-r-[1.5rem] p-4 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:bg-orange-50/50 transition-all group"
                                >
                                    <FiX size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </Toaster>
    );
};

export default CustomToaster;
