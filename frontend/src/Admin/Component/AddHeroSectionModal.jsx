import React, { useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiImage, FiType, FiAlignLeft, FiCheck } from 'react-icons/fi';

const AddHeroSectionModal = ({ isOpen, onClose, isDark, editingItem, onSubmit }) => {
    const fileInputRef = useRef(null);

    const getImageUrl = (image) => {
        if (!image) return null;
        if (typeof image === 'string') {
            return image.startsWith('http') ? image : `http://localhost:5000${image}`;
        }
        return URL.createObjectURL(image);
    };

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    const HeroSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        description: Yup.string().required('Description is required'),
        image: Yup.mixed()
            .test("required", "Image is required", (value) => {
                // If value is a string, it means it's an existing image (Edit mode)
                // If it's a File, it's a new upload
                return !!value;
            })
            .test('file-size', 'Image exceeds the 10MB limit', (value) => {
                if (value instanceof File) {
                    return value.size <= MAX_FILE_SIZE;
                }
                return true;
            })
    });

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className={`relative w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden z-10 ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}
                    >
                        {/* Header */}
                        <div className={`px-8 py-6 border-b flex justify-between items-center ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50'}`}>
                            <div>
                                <h3 className={`font-black text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>{editingItem ? 'Update' : 'Add'} Hero Slide</h3>
                                <p className="text-[10px] uppercase font-bold tracking-widest opacity-40">Homepage Banner</p>
                            </div>
                            <button onClick={onClose} className={`p-3 rounded-xl transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                                <FiX size={20} />
                            </button>
                        </div>

                        <Formik
                            initialValues={{
                                title: editingItem?.title || '',
                                description: editingItem?.description || '',
                                image: editingItem?.image || null
                            }}
                            validationSchema={HeroSchema}
                            onSubmit={onSubmit}
                            enableReinitialize={true}
                        >
                            {({ isSubmitting, setFieldValue, values, errors, touched }) => (
                                <Form className="p-8 space-y-6">
                                    {/* Image Upload */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center px-2">
                                            <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Banner Visual</label>
                                            <span className="text-[8px] font-bold text-indigo-500/60 uppercase tracking-widest">Max 10MB limit</span>
                                        </div>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`relative group h-40 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${isDark
                                                ? 'border-slate-800 bg-slate-900/50 hover:border-indigo-500/50'
                                                : 'border-slate-200 bg-slate-50 hover:border-indigo-400'
                                                } ${errors.image ? 'border-rose-500' : ''}`}
                                        >
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={(event) => setFieldValue("image", event.currentTarget.files[0])}
                                                className="hidden"
                                            />

                                            {values.image ? (
                                                <div className="relative w-full h-full">
                                                    <img
                                                        src={getImageUrl(values.image)}
                                                        className="w-full h-full object-cover opacity-80"
                                                        alt="Preview"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-white text-xs font-bold uppercase tracking-widest">Change Image</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${isDark ? 'bg-slate-800 text-indigo-400' : 'bg-white text-indigo-600 shadow-sm'}`}>
                                                        <FiImage size={24} />
                                                    </div>
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Upload Banner</span>
                                                </div>
                                            )}
                                        </div>
                                        {errors.image && touched.image && (
                                            <div className="text-[10px] text-rose-500 font-bold uppercase tracking-wider pl-2">{errors.image}</div>
                                        )}
                                    </div>

                                    {/* Title Input */}
                                    <div className="space-y-2">
                                        <label className={`text-[10px] font-black uppercase tracking-widest px-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Heading Title</label>
                                        <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all focus-within:ring-4 focus-within:ring-indigo-500/10 ${isDark ? 'bg-slate-900/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                                            <FiType className="text-slate-400 shrink-0" />
                                            <Field
                                                type="text"
                                                name="title"
                                                placeholder="Enter main heading..."
                                                className="bg-transparent border-none outline-none text-sm font-bold w-full placeholder:text-slate-500 placeholder:font-normal"
                                            />
                                        </div>
                                        <ErrorMessage name="title" component="div" className="text-[10px] text-rose-500 font-bold uppercase tracking-wider pl-2" />
                                    </div>

                                    {/* Description Input */}
                                    <div className="space-y-2">
                                        <label className={`text-[10px] font-black uppercase tracking-widest px-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Subtext / Description</label>
                                        <div className={`flex items-start gap-3 px-5 py-4 rounded-2xl border transition-all focus-within:ring-4 focus-within:ring-indigo-500/10 ${isDark ? 'bg-slate-900/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                                            <FiAlignLeft className="text-slate-400 shrink-0 mt-1" />
                                            <Field
                                                as="textarea"
                                                name="description"
                                                placeholder="Enter supporting text..."
                                                rows={3}
                                                className="bg-transparent border-none outline-none text-sm font-medium w-full resize-none placeholder:text-slate-500 placeholder:font-normal leading-relaxed"
                                            />
                                        </div>
                                        <ErrorMessage name="description" component="div" className="text-[10px] text-rose-500 font-bold uppercase tracking-wider pl-2" />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? 'Syncing...' : <><FiCheck size={18} /> {editingItem ? 'Update' : 'Publish'} Slide</>}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddHeroSectionModal;
