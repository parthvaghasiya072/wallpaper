import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiX, FiEdit3, FiBox, FiImage,
    FiTrash2, FiDollarSign, FiCheck
} from 'react-icons/fi';

const AddProductModal = ({
    isOpen,
    onClose,
    formData,
    setFormData,
    handleSubmit,
    isDark,
    handlers
}) => {
    const {
        handleAddImageField,
        handleRemoveImageField,
        handleImageChange,
        handleAddPaperOption,
        handleRemovePaperOption,
        handlePaperOptionChange
    } = handlers;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[3rem] shadow-2xl ${isDark ? 'bg-[#0f172a] border border-slate-800' : 'bg-white'
                            }`}
                    >
                        {/* Modal Header */}
                        <div className={`flex items-center justify-between px-12 py-10 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                            <div>
                                <h2 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>New Artwork Asset</h2>
                                <p className={`text-sm font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Add a new masterpiece to the studio gallery.</p>
                            </div>
                            <button
                                onClick={onClose}
                                className={`p-4 rounded-2xl transition-all ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                            >
                                <FiX size={28} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-180px)] p-12 space-y-12 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* General Specs */}
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Artwork Heading</label>
                                        <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all focus-within:ring-4 focus-within:ring-indigo-500/10 ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                            <FiEdit3 className="text-slate-400" />
                                            <input required value={formData.titleName} onChange={(e) => setFormData({ ...formData, titleName: e.target.value })} type="text" placeholder="Visual Title" className="bg-transparent border-none outline-none text-sm w-full font-bold" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Art Category</label>
                                            <div className={`px-6 py-4 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                                <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="bg-transparent border-none outline-none text-sm w-full font-bold appearance-none">
                                                    <option value="" disabled>Select</option>
                                                    <option value="Abstract">Abstract</option>
                                                    <option value="Nature">Nature</option>
                                                    <option value="Futuristic">Futuristic</option>
                                                    <option value="Minimalist">Minimalist</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Units</label>
                                            <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                                <FiBox className="text-slate-400" />
                                                <input required value={formData.stocks} onChange={(e) => setFormData({ ...formData, stocks: e.target.value })} type="number" placeholder="00" className="bg-transparent border-none outline-none text-sm w-full font-bold" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Visual Narrative</label>
                                        <div className={`px-6 py-5 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                            <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="5" placeholder="Tell the story of this asset..." className="bg-transparent border-none outline-none text-sm w-full resize-none font-medium leading-relaxed" />
                                        </div>
                                    </div>
                                </div>

                                {/* Assets & Materials */}
                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Visual Assets (URLs)</label>
                                            <button type="button" onClick={handleAddImageField} className="text-[9px] font-black underline text-indigo-500 uppercase tracking-widest">+ Add Asset</button>
                                        </div>
                                        <div className="space-y-3">
                                            {formData.images.map((img, idx) => (
                                                <div key={idx} className="flex gap-2">
                                                    <div className={`flex-1 flex items-center gap-4 px-6 py-4 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                                        <FiImage className="text-slate-400" />
                                                        <input value={img} onChange={(e) => handleImageChange(idx, e.target.value)} type="text" placeholder={`Asset URL #${idx + 1}`} className="bg-transparent border-none outline-none text-xs w-full font-bold" />
                                                    </div>
                                                    {formData.images.length > 1 && (
                                                        <button type="button" onClick={() => handleRemoveImageField(idx)} className="p-4 text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all"><FiTrash2 size={18} /></button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Material Hierarchy</label>
                                            <button type="button" onClick={handleAddPaperOption} className="text-[9px] font-black underline text-indigo-500 uppercase tracking-widest">+ Add Material</button>
                                        </div>
                                        <div className="space-y-3">
                                            {formData.paperOptions.map((opt, index) => (
                                                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={index} className="flex items-center gap-3">
                                                    <div className={`flex-1 grid grid-cols-2 gap-3 px-5 py-4 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
                                                        <input required value={opt.paperType} onChange={(e) => handlePaperOptionChange(index, 'paperType', e.target.value)} placeholder="Type" className="bg-transparent border-none outline-none text-xs font-black flex-1" />
                                                        <div className="flex items-center gap-1 border-l border-slate-500/20 pl-3">
                                                            <FiDollarSign size={12} className="text-indigo-500" />
                                                            <input required value={opt.pricePerSqFt} onChange={(e) => handlePaperOptionChange(index, 'pricePerSqFt', e.target.value)} type="number" placeholder="Rate" className="bg-transparent border-none outline-none text-xs font-black w-full" />
                                                        </div>
                                                    </div>
                                                    {formData.paperOptions.length > 1 && (
                                                        <button type="button" onClick={() => handleRemovePaperOption(index)} className="p-4 text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all"><FiTrash2 size={18} /></button>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className={`flex items-center gap-4 pt-10 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className={`flex-1 px-8 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] px-8 py-5 bg-indigo-600 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-3"
                                >
                                    Catalog Masterpiece <FiCheck size={20} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddProductModal;
