import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories } from '../../redux/slices/categorySlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
    FiX, FiEdit3, FiBox, FiImage,
    FiTrash2, FiDollarSign, FiCheck, FiPlus, FiChevronDown, FiLayers
} from 'react-icons/fi';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const validationSchema = Yup.object().shape({
    titleName: Yup.string()
        .required('Title is required')
        .min(3, 'Title too short'),
    category: Yup.string()
        .required('Category is required'),
    description: Yup.string()
        .required('Description is required')
        .min(10, 'Description too short'),
    images: Yup.array()
        .test('at-least-one', 'At least one artwork image is required', (value) => {
            return value && value.some(img => img !== null);
        })
        .test('file-size', 'Image exceeds the 10MB limit', (value) => {
            if (!value) return true;
            return value.every(img => {
                if (img instanceof File) {
                    return img.size <= MAX_FILE_SIZE;
                }
                return true;
            });
        }),
    paperOptions: Yup.array().of(
        Yup.object().shape({
            paperType: Yup.string().required('Type is required'),
            pricePerSqFt: Yup.number().required('Rate is required').min(0, 'Cannot be negative'),
            stocks: Yup.number().required('Stock units required').min(0, 'Cannot be negative'),
        })
    )
});

const ErrorText = ({ children }) => (
    <div className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mt-1 ml-2">
        {children}
    </div>
);

const AddProductModal = ({
    isOpen,
    onClose,
    isDark,
    onSubmitSuccess,
    editData = null
}) => {
    const dispatch = useDispatch();
    const { categories = [] } = useSelector((state) => state.category || {});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            dispatch(getAllCategories({ limit: 100 }));
        }
    }, [dispatch, isOpen]);

    const isEdit = !!editData;

    const initialValues = editData ? {
        titleName: editData.titleName,
        description: editData.description,
        category: editData.category,
        images: editData.images?.length > 0 ? editData.images : [null],
        paperOptions: editData.paperOptions?.length > 0
            ? editData.paperOptions.map(opt => ({
                paperType: opt.paperType || '',
                pricePerSqFt: opt.pricePerSqFt || '',
                stocks: opt.stocks || ''
            }))
            : [{ paperType: '', pricePerSqFt: '', stocks: '' }]
    } : {
        titleName: '',
        description: '',
        category: '',
        images: [null],
        paperOptions: [{ paperType: '', pricePerSqFt: '', stocks: '' }]
    };

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
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={(values, { setSubmitting, resetForm }) => {
                                onSubmitSuccess(values, { setSubmitting, resetForm });
                            }}
                        >
                            {({ values, setFieldValue, isSubmitting }) => (
                                <Form className="flex flex-col h-full">
                                    {/* Modal Header */}
                                    <div className={`flex items-center justify-between px-12 py-10 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                                        <div>
                                            <h2 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{isEdit ? 'Refine Masterpiece' : 'New Artwork Asset'}</h2>
                                            <p className={`text-sm font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{isEdit ? 'Update the details of your existing gallery asset.' : 'Add a new masterpiece to the studio gallery using Formik.'}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className={`p-4 rounded-2xl transition-all ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                                        >
                                            <FiX size={28} />
                                        </button>
                                    </div>

                                    {/* Modal Body */}
                                    <div className="overflow-y-auto max-h-[calc(90vh-250px)] p-12 space-y-12 custom-scrollbar">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            {/* General Specs */}
                                            <div className="space-y-8">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Artwork Heading</label>
                                                    <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all focus-within:ring-4 focus-within:ring-indigo-500/10 ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                                        <FiEdit3 className="text-slate-400" />
                                                        <Field name="titleName" placeholder="Visual Title" className="bg-transparent border-none outline-none text-sm w-full font-bold" />
                                                    </div>
                                                    <ErrorMessage name="titleName" component={ErrorText} />
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-3 relative">
                                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Art Category</label>
                                                        <div className="relative">
                                                            <button
                                                                type="button"
                                                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all ${isDark
                                                                    ? 'bg-slate-900/50 border-slate-700'
                                                                    : 'bg-slate-50 border-slate-200'
                                                                    } ${isDropdownOpen ? '' : ''}`}
                                                            >
                                                                <div className="flex items-center gap-2 overflow-hidden">
                                                                    <FiLayers className="text-slate-400" />
                                                                    <span className={`text-sm font-bold truncate max-w-[120px] ${values.category ? (isDark ? 'text-white' : 'text-slate-900') : 'text-slate-400'}`}>
                                                                        {values.category || 'Category'}
                                                                    </span>
                                                                </div>
                                                                <FiChevronDown className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                                            </button>

                                                            <AnimatePresence>
                                                                {isDropdownOpen && (
                                                                    <>
                                                                        <div className="fixed inset-0 z-[10]" onClick={() => setIsDropdownOpen(false)} />
                                                                        <motion.div
                                                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                            className={`absolute left-0 right-0 top-full mt-3 z-[11] p-1 rounded-[1.5rem] shadow-2xl border ${isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-100'
                                                                                }`}
                                                                        >
                                                                            <div className="max-h-60 overflow-y-auto custom-scrollbar flex flex-col gap-1">
                                                                                {categories.map((cat) => (
                                                                                    <button
                                                                                        key={cat._id}
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            setFieldValue('category', cat.categoryName);
                                                                                            setIsDropdownOpen(false);
                                                                                        }}
                                                                                        className={`w-full text-left px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all ${values.category === cat.categoryName
                                                                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-black'
                                                                                            : isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-orange-50 hover:text-orange-600'
                                                                                            }`}
                                                                                    >
                                                                                        {cat.categoryName}
                                                                                    </button>
                                                                                ))}
                                                                            </div>
                                                                        </motion.div>
                                                                    </>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                        <ErrorMessage name="category" component={ErrorText} />
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Visual Narrative</label>
                                                    <div className={`px-6 py-5 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                                        <Field as="textarea" name="description" rows="5" placeholder="Tell the story of this asset..." className="bg-transparent border-none outline-none text-sm w-full resize-none font-medium leading-relaxed" />
                                                    </div>
                                                    <ErrorMessage name="description" component={ErrorText} />
                                                </div>
                                            </div>

                                            {/* Assets & Materials */}
                                            <div className="space-y-10">
                                                <div className="space-y-4">
                                                    <FieldArray name="images">
                                                        {({ push, remove }) => (
                                                            <>
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex flex-col">
                                                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Visual Assets (Gallery)</label>
                                                                        <span className="text-[8px] font-bold text-indigo-500/60 uppercase tracking-widest">Max 10MB per artwork</span>
                                                                    </div>
                                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{values.images.filter(img => img).length} Assets Selected</span>
                                                                </div>
                                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                                    {values.images.map((img, idx) => (
                                                                        <div key={idx} className={`relative aspect-square rounded-3xl overflow-hidden border-2 transition-all group ${img ? 'border-indigo-500/20' : 'border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500/50'}`}>
                                                                            {img ? (
                                                                                <>
                                                                                    <img
                                                                                        src={typeof img === 'string' ? (img.startsWith('http') ? img : `http://localhost:5000${img}`) : URL.createObjectURL(img)}
                                                                                        alt="Preview"
                                                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                                                    />
                                                                                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => remove(idx)}
                                                                                            className="p-3 bg-rose-500 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all"
                                                                                        >
                                                                                            <FiTrash2 size={16} />
                                                                                        </button>
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                <div className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 dark:bg-slate-900/30">
                                                                                    <FiImage size={24} className="text-slate-400 group-hover:text-indigo-500 transition-colors mb-1" />
                                                                                    <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400 group-hover:text-indigo-500">Add File</span>
                                                                                    <input
                                                                                        type="file"
                                                                                        accept="image/*"
                                                                                        onChange={(e) => setFieldValue(`images.${idx}`, e.target.files[0])}
                                                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ))}

                                                                    {/* Automatically add a new slot button if the current items are filled or if array is empty */}
                                                                    {(values.images.length === 0 || (values.images.length > 0 && values.images[values.images.length - 1] !== null)) && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => push(null)}
                                                                            className="aspect-square rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center hover:border-indigo-500/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-all group"
                                                                        >
                                                                            <FiPlus size={24} className="text-slate-400 group-hover:text-indigo-500" />
                                                                            <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400 group-hover:text-indigo-500 mt-1">More Art</span>
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                <ErrorMessage name="images" component={ErrorText} />
                                                            </>
                                                        )}
                                                    </FieldArray>
                                                </div>

                                                <div className="space-y-4">
                                                    <FieldArray name="paperOptions">
                                                        {({ push, remove }) => (
                                                            <>
                                                                <div className="flex items-center justify-between">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Material Hierarchy</label>
                                                                    <button type="button" onClick={() => push({ paperType: '', pricePerSqFt: '', stocks: '' })} className="text-[9px] font-black underline text-indigo-500 uppercase tracking-widest transition-all hover:text-indigo-400 flex items-center gap-1">
                                                                        <FiPlus size={10} /> Add Material
                                                                    </button>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    {values.paperOptions.map((_, index) => (
                                                                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={index} className="flex flex-col gap-3">
                                                                            <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
                                                                                <div className="flex-[2]">
                                                                                    <Field name={`paperOptions.${index}.paperType`} placeholder="Type (e.g. Matte)" className="bg-transparent border-none outline-none text-xs font-black w-full" />
                                                                                </div>
                                                                                <div className="flex-1 flex items-center gap-1 border-l border-slate-500/20 pl-3">
                                                                                    <FiDollarSign size={12} className="text-indigo-500" />
                                                                                    <Field name={`paperOptions.${index}.pricePerSqFt`} type="number" placeholder="Rate" className="bg-transparent border-none outline-none text-xs font-black w-full" />
                                                                                </div>
                                                                                <div className="flex-1 flex items-center gap-1 border-l border-slate-500/20 pl-3">
                                                                                    <FiBox size={12} className="text-orange-500" />
                                                                                    <Field name={`paperOptions.${index}.stocks`} type="number" placeholder="Stock" className="bg-transparent border-none outline-none text-xs font-black w-full" />
                                                                                </div>
                                                                                {values.paperOptions.length > 1 && (
                                                                                    <button type="button" onClick={() => remove(index)} className="p-3 text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all">
                                                                                        <FiTrash2 size={18} />
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        </motion.div>
                                                                    ))}
                                                                </div>
                                                            </>
                                                        )}
                                                    </FieldArray>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Footer */}
                                    <div className={`flex items-center gap-4 px-12 py-10 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className={`flex-1 px-8 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                        >
                                            Discard
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-[2] px-8 py-5 bg-indigo-600 hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-3"
                                        >
                                            {isSubmitting ? 'Processing...' : (isEdit ? 'Update Masterpiece' : 'Catalog Masterpiece')} <FiCheck size={20} />
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddProductModal;
