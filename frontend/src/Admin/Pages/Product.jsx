import React, { useState } from 'react';
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
    const [viewType, setViewType] = useState('table');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewDetailProduct, setViewDetailProduct] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const [formData, setFormData] = useState({
        titleName: '',
        description: '',
        stocks: '',
        category: '',
        images: [''],
        paperOptions: [{ paperType: '', pricePerSqFt: '' }]
    });

    const [products, setProducts] = useState([
        {
            id: 1, titleName: 'Ethereal Blue Waves', category: 'Abstract', stocks: 45,
            description: 'Dive into the deep tranquil blues of this abstract wave masterpiece.',
            images: ['https://images.unsplash.com/photo-1541701494587-cb58502866ab'],
            paperOptions: [{ paperType: 'Premium Silk', pricePerSqFt: 15 }]
        },
        {
            id: 2, titleName: 'Alpine Sunset Peak', category: 'Nature', stocks: 8,
            description: 'Experience the golden hour every day. High-resolution capture of Alpine peaks.',
            images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b'],
            paperOptions: [{ paperType: 'Vinyl Matte', pricePerSqFt: 22 }]
        },
        {
            id: 3, titleName: 'Cyberpunk Neon Streets', category: 'Futuristic', stocks: 20,
            description: 'Hyper-detailed futuristic city streets illuminated by neon lights.',
            images: ['https://images.unsplash.com/photo-1605810230434-7631ac76ec81'],
            paperOptions: [{ paperType: 'High Gloss Metallic', pricePerSqFt: 35 }]
        },
        {
            id: 4, titleName: 'Golden Eucalyptus Leaves', category: 'Botanical', stocks: 15,
            description: 'Elegant golden eucalyptus leaves with a subtle metallic finish.',
            images: ['https://images.unsplash.com/photo-1533038590840-1cde6e668a91'],
            paperOptions: [{ paperType: 'Textured Canvas', pricePerSqFt: 28 }]
        },
        {
            id: 5, titleName: 'Midnight Forest Mist', category: 'Landscape', stocks: 32,
            description: 'A mysterious foggy forest at midnight.',
            images: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e'],
            paperOptions: [{ paperType: 'Non-Woven Fab', pricePerSqFt: 19 }]
        },
        {
            id: 6, titleName: 'Geometric Marble Fusion', category: 'Geometric', stocks: 5,
            description: 'Sleek marble textures fused with sharp geometric gold lines.',
            images: ['https://images.unsplash.com/photo-1517430816045-df4b7de11d1d'],
            paperOptions: [{ paperType: 'Premium Silk', pricePerSqFt: 40 }]
        }
    ]);

    // Handlers
    const handlers = {
        handleAddImageField: () => setFormData(prev => ({ ...prev, images: [...prev.images, ''] })),
        handleRemoveImageField: (index) => setFormData(prev => {
            const newImages = [...prev.images];
            newImages.splice(index, 1);
            return { ...prev, images: newImages };
        }),
        handleImageChange: (index, value) => setFormData(prev => {
            const newImages = [...prev.images];
            newImages[index] = value;
            return { ...prev, images: newImages };
        }),
        handleAddPaperOption: () => setFormData(prev => ({
            ...prev,
            paperOptions: [...prev.paperOptions, { paperType: '', pricePerSqFt: '' }]
        })),
        handleRemovePaperOption: (index) => setFormData(prev => {
            const newOptions = [...prev.paperOptions];
            newOptions.splice(index, 1);
            return { ...prev, paperOptions: newOptions };
        }),
        handlePaperOptionChange: (index, field, value) => setFormData(prev => {
            const newOptions = [...prev.paperOptions];
            newOptions[index][field] = value;
            return { ...prev, paperOptions: newOptions };
        })
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validImages = formData.images.filter(img => img.trim() !== '');
        const newProduct = {
            ...formData,
            id: Date.now(),
            images: validImages.length > 0 ? validImages : ['https://via.placeholder.com/600x800']
        };
        setProducts([newProduct, ...products]);
        setIsModalOpen(false);
        setFormData({
            titleName: '', description: '', stocks: '', category: '',
            images: [''], paperOptions: [{ paperType: '', pricePerSqFt: '' }]
        });
    };

    const productColumns = [
        {
            header: "Product",
            accessor: "titleName",
            render: (item) => (
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-[#132846]' : 'bg-slate-100'} w-12 h-12 flex-shrink-0 overflow-hidden`}>
                        <img src={item.images[0]} className="w-full h-full object-cover transition-transform duration-500 hover:scale-125" alt="" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className={` text-sm truncate ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{item.titleName}</span>
                        {/* <span className="text-[10px] opacity-40 truncate max-w-[150px] font-medium uppercase tracking-wider">{item.category}</span> */}
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
                        <span className={` text-sm truncate ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{item.titleName}</span>
                        {/* <span className="text-[10px] opacity-40 truncate max-w-[150px] font-medium uppercase tracking-wider">{item.category}</span> */}
                    </div>
                </div>
            )
        },
        {
            header: "Inventory",
            accessor: "stocks",
            render: (item) => (
                <div className="flex flex-col gap-1 w-24">
                    <span className={`text-xs font-black ${item.stocks < 10 ? 'text-rose-500' : isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {String(item.stocks || 0).padStart(2, '0')} <span className="text-[9px] opacity-30">PCS</span>
                    </span>
                </div>
            )
        },
        {
            header: "Price",
            accessor: "paperOptions",
            render: (item) => (
                <span className={`text-sm font-black ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                    ${Math.min(...item.paperOptions.map(o => o.pricePerSqFt))}
                    <span className="text-[10px] opacity-30 ml-0.5">/SQFT</span>
                </span>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                        <CommonTable
                            columns={productColumns} data={products} isDark={isDark}
                            onView={(p) => { setViewDetailProduct(p); setActiveImageIndex(0); }}
                            onEdit={(p) => console.log('Edit', p.id)}
                            onDelete={(p) => console.log('Delete', p.id)}
                            itemsPerPage={10}
                        />
                    </motion.div>
                ) : (
                    <div className={`grid ${viewType === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
                        <AnimatePresence>
                            {products.map((product) => (
                                <motion.div
                                    key={product.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                    className={`group relative overflow-hidden rounded-xl border transition-all ${isDark ? 'bg-slate-800/40 border-slate-800 hover:border-indigo-500/30' : 'bg-white border-white shadow-sm hover:shadow-xl'}`}
                                >
                                    <div className="h-48 overflow-hidden relative">
                                        <img src={product.images[0]} alt={product.titleName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            {[
                                                { icon: FiEye, action: () => { setViewDetailProduct(product); setActiveImageIndex(0); }, bg: 'hover:bg-slate-900' },
                                                { icon: FiEdit3, action: () => { }, bg: 'hover:bg-indigo-600' },
                                                { icon: FiTrash2, action: () => { }, bg: 'hover:bg-rose-600' }
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
                                            <span className={`text-lg font-black ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>${Math.min(...product.paperOptions.map(o => o.pricePerSqFt))}/ft²</span>
                                            <span className={`text-xs  ${product.stocks < 10 ? 'text-rose-500' : 'text-emerald-500'}`}>{product.stocks} pcs</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <ProductDetailModal
                product={viewDetailProduct} isOpen={!!viewDetailProduct}
                onClose={() => setViewDetailProduct(null)} isDark={isDark}
                activeImageIndex={activeImageIndex} setActiveImageIndex={setActiveImageIndex}
            />

            <AddProductModal
                isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
                formData={formData} setFormData={setFormData}
                handleSubmit={handleSubmit} isDark={isDark} handlers={handlers}
            />
        </div>
    );
};

export default Product;
