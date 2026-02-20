import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiX, FiCheck, FiType, FiAlignLeft } from 'react-icons/fi';

const TagSchema = Yup.object().shape({
    tagTitle: Yup.string()
        .required('Tag title is required')
        .min(2, 'Too short'),
    tagDescription: Yup.string()
        .required('Description is required')
        .min(5, 'Description too short'),
});

const ErrorText = ({ children }) => (
    <div className="text-[10px] text-rose-500 font-black uppercase tracking-widest mt-1 ml-2">
        {children}
    </div>
);

const AddTagModal = ({ isOpen, onClose, isDark, onSubmit, editingItem }) => {
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
                        className={`relative w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl p-10 ${isDark ? 'bg-[#0f172a] border border-slate-800' : 'bg-white'}`}
                    >
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {editingItem ? 'Update' : 'Add'} <span className="text-indigo-500">Tag</span>
                                </h2>
                                <p className="text-[10px] uppercase font-bold tracking-widest opacity-40">Classification Metadata</p>
                            </div>
                            <button onClick={onClose} className="p-3 rounded-xl hover:bg-rose-500/10 text-rose-500 transition-all">
                                <FiX size={24} />
                            </button>
                        </div>

                        <Formik
                            enableReinitialize={true}
                            initialValues={{
                                tagTitle: editingItem?.tagTitle || '',
                                tagDescription: editingItem?.tagDescription || '',
                            }}
                            validationSchema={TagSchema}
                            onSubmit={(values, actions) => {
                                onSubmit(values, actions);
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form className="space-y-8">
                                    <div className="space-y-6">
                                        {/* Tag Title */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-tighter opacity-30 px-2">Tag Title</label>
                                            <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all focus-within:ring-4 focus-within:ring-indigo-500/10 ${isDark ? 'bg-slate-900/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                                                <FiType className="text-slate-400" />
                                                <Field name="tagTitle" placeholder="Ex: Texture, Modern, etc." className="bg-transparent border-none outline-none text-sm w-full font-bold" />
                                            </div>
                                            <ErrorMessage name="tagTitle" component={ErrorText} />
                                        </div>

                                        {/* Tag Description */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-tighter opacity-30 px-2">Description</label>
                                            <div className={`px-6 py-5 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                                                <div className="flex items-start gap-4">
                                                    <FiAlignLeft className="text-slate-400 mt-1" />
                                                    <Field as="textarea" name="tagDescription" rows="4" placeholder="Briefly describe the tag's purpose..." className="bg-transparent border-none outline-none text-sm w-full resize-none font-medium leading-relaxed" />
                                                </div>
                                            </div>
                                            <ErrorMessage name="tagDescription" component={ErrorText} />
                                        </div>
                                    </div>

                                    <button
                                        type="submit" disabled={isSubmitting}
                                        className="w-full py-5 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Syncing...' : (editingItem ? 'Update Tag' : 'Add Tag')}
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

export default AddTagModal;
