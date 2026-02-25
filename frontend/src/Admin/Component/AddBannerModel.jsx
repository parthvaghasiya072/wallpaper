import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
    FiX, FiCheck, FiImage, FiType
} from 'react-icons/fi';

const getImageUrl = (image) => {
    if (!image) return null;
    if (typeof image === 'string') {
        return image.startsWith('http') ? image : `http://localhost:5000${image}`;
    }
    return URL.createObjectURL(image);
};

const ErrorText = ({ children }) => (
    <div className="text-[10px] text-rose-500 font-black uppercase tracking-widest mt-1 ml-2">
        {children}
    </div>
);

const AddBannerModal = ({ isOpen, onClose, isDark, onSubmit, editingBanner }) => {
    const fileInputRef = useRef(null);

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    const BannerSchema = Yup.object().shape({
        title: Yup.string()
            .required('Title is required')
            .min(2, 'Too short'),
        description: Yup.string()
            .required('Description is required')
            .min(5, 'Description too short'),
        image: Yup.mixed()
            .test('required', 'Banner image is required', function (value) {
                return !!value;
            })
            .test('file-size', 'Image exceeds the 10MB limit', function (value) {
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
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`relative w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl p-10 ${isDark ? 'bg-[#0f172a] border border-slate-800' : 'bg-white'}`}
                    >
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {editingBanner ? 'Update' : 'Add'} <span className="text-indigo-500">Banner</span>
                                </h2>
                                <p className="text-[10px] uppercase font-bold tracking-widest opacity-40">Section Promotional Asset</p>
                            </div>
                            <button onClick={onClose} className="p-3 rounded-xl hover:bg-rose-500/10 text-rose-500 transition-all">
                                <FiX size={24} />
                            </button>
                        </div>

                        <Formik
                            enableReinitialize={true}
                            initialValues={{
                                title: editingBanner?.title || '',
                                description: editingBanner?.description || '',
                                image: editingBanner?.image || null
                            }}
                            validationSchema={BannerSchema}
                            onSubmit={onSubmit}
                        >
                            {({ isSubmitting, setFieldValue, values }) => (
                                <Form className="space-y-8">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex flex-col items-center">
                                                <label className="text-[10px] font-black uppercase tracking-widest opacity-30 px-2 text-center block">Banner Image</label>
                                                <span className="text-[8px] font-bold text-indigo-500/60 uppercase tracking-widest">Max 10MB limit</span>
                                            </div>
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className={`relative h-48 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center overflow-hidden group transition-all cursor-pointer ${isDark ? 'bg-slate-900/50 border-slate-800 hover:border-indigo-500/50' : 'bg-slate-50 border-slate-200 hover:border-indigo-500/50'}`}
                                            >
                                                <input
                                                    ref={fileInputRef}
                                                    type="file" accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => setFieldValue('image', e.target.files[0])}
                                                />
                                                {values.image ? (
                                                    <img
                                                        src={getImageUrl(values.image)}
                                                        className="w-full h-full object-cover p-2 rounded-[1.8rem]"
                                                        alt="Preview"
                                                    />
                                                ) : (
                                                    <div className="text-center group-hover:scale-110 transition-transform duration-500">
                                                        <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                                            <FiImage size={30} />
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Upload banner asset</span>
                                                    </div>
                                                )}
                                            </div>
                                            <ErrorMessage name="image" component={ErrorText} />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-tighter opacity-30 px-2">Banner Title</label>
                                            <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all focus-within:ring-4 focus-within:ring-indigo-500/10 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                                <FiType className="text-slate-400" />
                                                <Field name="title" placeholder="Ex: New Summer Collection" className="bg-transparent border-none outline-none text-sm w-full font-bold" />
                                            </div>
                                            <ErrorMessage name="title" component={ErrorText} />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-tighter opacity-30 px-2">Description</label>
                                            <div className={`px-6 py-5 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                                <Field as="textarea" name="description" rows="3" placeholder="Describe the promotion..." className="bg-transparent border-none outline-none text-sm w-full resize-none font-medium leading-relaxed" />
                                            </div>
                                            <ErrorMessage name="description" component={ErrorText} />
                                        </div>
                                    </div>

                                    <button
                                        type="submit" disabled={isSubmitting}
                                        className="w-full py-5 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Syncing...' : (editingBanner ? 'Update Banner' : 'Add Banner')}
                                        <FiCheck size={18} />
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

export default AddBannerModal;
