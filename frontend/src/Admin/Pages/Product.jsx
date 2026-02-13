import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts, createProduct, getSingleProduct, clearSelectedProduct, deleteProduct, updateProduct } from '../../redux/slices/product.slice';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import {
    FiPlus, FiGrid, FiList, FiTable,
    FiEye, FiEdit3, FiTrash2, FiLayers
} from 'react-icons/fi';

// Components
import CommonTable from '../Component/CommonTable';
import ProductDetailModal from '../Component/ProductDetailModal';
import AddProductModal from '../Component/AddProductModal';

const Product = () => {
    const { isDark } = useOutletContext();
    const dispatch = useDispatch();
    const { products, selectedProduct, loading, detailLoading, error, totalPages, currentPage, totalProducts } = useSelector((state) => state.product);

    const [viewType, setViewType] = useState('table');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        dispatch(getAllProducts({ page: 1, limit: rowsPerPage }));
    }, [dispatch]);

    // Handlers
    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        const data = new FormData();
        data.append('titleName', values.titleName);
        data.append('description', values.description);
        data.append('stocks', values.stocks);
        data.append('category', values.category);
        data.append('paperOptions', JSON.stringify(values.paperOptions));

        const existingImages = [];
        values.images.forEach((file) => {
            if (file instanceof File) {
                data.append('images', file);
            } else if (typeof file === 'string') {
                existingImages.push(file);
            }
        });
        data.append('existingImages', JSON.stringify(existingImages));

        if (editingProduct) {
            dispatch(updateProduct({ id: editingProduct._id, productData: data })).then((result) => {
                setSubmitting(false);
                if (result.meta.requestStatus === 'fulfilled') {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                    resetForm();
                }
            });
        } else {
            dispatch(createProduct(data)).then((result) => {
                setSubmitting(false);
                if (result.meta.requestStatus === 'fulfilled') {
                    setIsModalOpen(false);
                    resetForm();
                }
            });
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this catalog masterpiece? This action cannot be undone.')) {
            dispatch(deleteProduct(id));
        }
    };

    const productColumns = [
        {
            header: "Product",
            accessor: "titleName",
            render: (item) => (
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-[#132846]' : 'bg-slate-100'} w-12 h-12 flex-shrink-0 overflow-hidden`}>
                        <img src={item.images[0]?.startsWith('http') ? item.images[0] : `http://localhost:5000${item.images[0]}`} className="w-full h-full object-cover transition-transform duration-500 hover:scale-125" alt="" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className={` text-sm truncate ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{item.titleName}</span>
                        {/* <span className="text-[10px] opacity-40 truncate max-w-[150px] font-medium uppercase tracking-wider">{item.productId}</span> */}
                    </div>
                </div>
            )
        },
        {
            header: "Category",
            accessor: "titleName",
            render: (item) => (
                <div className="flex items-center gap-4">
                    <div className="flex flex-col min-w-0">
                        <span className={` text-sm truncate ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{item.category}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Inventory",
            accessor: "stocks",
            render: (item) => (
                <div className="flex flex-col gap-1 w-24">
                    <span className={`text-[16px] font-black ${item.stocks < 10 ? 'text-rose-500' : isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {String(item.stocks || 0).padStart(2, '0')}
                    </span>
                </div>
            )
        },
        {
            header: "Price",
            accessor: "paperOptions",
            render: (item) => (
                <span className={`text-sm font-black ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                    ${item.paperOptions?.length > 0 ? Math.min(...item.paperOptions.map(o => o.pricePerSqFt)) : 0}
                </span>
            )
        }
    ];

    return (
        <div className="">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8">
                <div className="flex flex-col">
                    <h1 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>WallArt Inventory</h1>
                    <p className="text-[10px]  opacity-30 uppercase tracking-[0.2em]">Management & Performance Metrics</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-1 p-1 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        {[
                            { type: 'grid', icon: FiGrid },
                            { type: 'table', icon: FiTable },
                            { type: 'list', icon: FiList }
                        ].map(({ type, icon: Icon }) => (
                            <button
                                key={type}
                                onClick={() => setViewType(type)}
                                className={`p-2 rounded flex items-center justify-center transition-all ${viewType === type ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-indigo-500'}`}
                            >
                                <Icon size={14} />
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-lg transition-all shadow-lg"
                    >
                        <FiPlus size={16} /> New Art
                    </button>
                </div>
            </div>

            <div className="w-full">
                {viewType === 'table' ? (
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-10 text-rose-500 font-bold">{error}</div>
                        ) : (
                            <CommonTable
                                columns={productColumns}
                                data={products}
                                isDark={isDark}
                                onView={(p) => { dispatch(getSingleProduct(p._id)); setActiveImageIndex(0); }}
                                onEdit={(p) => { setEditingProduct(p); setIsModalOpen(true); }}
                                onDelete={(p) => handleDelete(p._id)}
                                serverTotalPages={totalPages}
                                serverCurrentPage={currentPage}
                                totalRecordsCount={totalProducts}
                                onPageChange={(page) => dispatch(getAllProducts({ page, limit: rowsPerPage }))}
                                onRowsPerPageChange={(limit) => {
                                    setRowsPerPage(limit);
                                    dispatch(getAllProducts({ page: 1, limit }));
                                }}
                                itemsPerPage={rowsPerPage}
                            />
                        )}
                    </motion.div>
                ) : (
                    <div className={`grid ${viewType === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' : 'grid-cols-2'} gap-6`}>
                        {loading ? (
                            <div className="col-span-full flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : error ? (
                            <div className="col-span-full text-center py-10 text-rose-500 font-bold">{error}</div>
                        ) : (
                            <AnimatePresence>
                                {products.map((product) => (
                                    <motion.div
                                        key={product._id || product.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                        className={`group relative overflow-hidden rounded-xl border transition-all ${isDark ? 'bg-slate-800/40 border-slate-800 hover:border-indigo-500/30' : 'bg-white border-white shadow-sm hover:shadow-xl'}`}
                                    >
                                        <div className="h-48 overflow-hidden relative">
                                            <img src={product.images[0]?.startsWith('http') ? product.images[0] : `http://localhost:5000${product.images[0]}`} alt={product.titleName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute top-4 right-4 flex gap-2">
                                                {[
                                                    { icon: FiEye, action: () => { dispatch(getSingleProduct(product._id)); setActiveImageIndex(0); }, bg: 'hover:bg-slate-900' },
                                                    { icon: FiEdit3, action: () => { setEditingProduct(product); setIsModalOpen(true); }, bg: 'hover:bg-indigo-600' },
                                                    { icon: FiTrash2, action: () => handleDelete(product._id), bg: 'hover:bg-rose-600' }
                                                ].map(({ icon: Icon, action, bg }, i) => (
                                                    <button key={i} onClick={action} className={`p-2 bg-white/20 backdrop-blur-md rounded-xl text-white transition-all shadow-lg ${bg}`}>
                                                        <Icon size={16} />
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="absolute bottom-3 left-4">
                                                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px]  text-white uppercase tracking-widest">{product.category}</span>
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            <h3 className={` text-lg truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{product.titleName}</h3>
                                            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                                                <span className={`text-lg font-black ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>${product.paperOptions?.length > 0 ? Math.min(...product.paperOptions.map(o => o.pricePerSqFt)) : 0}/ft²</span>
                                                <span className={`text-xs  ${product.stocks < 10 ? 'text-rose-500' : 'text-emerald-500'}`}>{product.stocks} pcs</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                )}
            </div>

            <ProductDetailModal
                product={selectedProduct} isOpen={!!selectedProduct}
                onClose={() => dispatch(clearSelectedProduct())} isDark={isDark}
                activeImageIndex={activeImageIndex} setActiveImageIndex={setActiveImageIndex}
                loading={detailLoading}
            />

            <AddProductModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingProduct(null); }}
                isDark={isDark}
                onSubmitSuccess={handleSubmit}
                editData={editingProduct}
            />
        </div>
    );
};

export default Product;
