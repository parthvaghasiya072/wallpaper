import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiHeart, FiEye, FiX, FiArrowRight, FiCheck, FiChevronDown } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getAllProducts } from '../redux/slices/product.slice';
import { getAllCategories } from '../redux/slices/categorySlice';

const Shop = () => {
    const dispatch = useDispatch();
    const { products = [], loading, totalPages, currentPage: serverPage, totalProducts } = useSelector((state) => state.product || {});
    const { categories = [] } = useSelector((state) => state.category || {});

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [sortBy, setSortBy] = useState('newest');
    const [openFilter, setOpenFilter] = useState('categories');
    const [currentPage, setCurrentPage] = useState(1);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, selectedCategories, priceRange, sortBy]);

    useEffect(() => {
        dispatch(getAllProducts({
            page: currentPage,
            limit: 12,
            search: debouncedSearch,
            category: selectedCategories.join(','),
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            sortBy: sortBy
        }));
    }, [dispatch, currentPage, debouncedSearch, selectedCategories, priceRange, sortBy]);

    useEffect(() => {
        dispatch(getAllCategories());
    }, [dispatch]);

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `http://localhost:5000${path}`;
    };

    const toggleCategory = (catName) => {
        setSelectedCategories(prev =>
            prev.includes(catName)
                ? prev.filter(c => c !== catName)
                : [...prev, catName]
        );
    };

    const paginationRange = useMemo(() => {
        if (totalPages <= 7) {
            return [...Array(totalPages).keys()].map(i => i + 1);
        }

        const range = [];
        if (currentPage <= 4) {
            for (let i = 1; i <= 5; i++) range.push(i);
            range.push('...');
            range.push(totalPages);
        } else if (currentPage >= totalPages - 3) {
            range.push(1);
            range.push('...');
            for (let i = totalPages - 4; i <= totalPages; i++) range.push(i);
        } else {
            range.push(1);
            range.push('...');
            range.push(currentPage - 1);
            range.push(currentPage);
            range.push(currentPage + 1);
            range.push('...');
            range.push(totalPages);
        }
        return range;
    }, [totalPages, currentPage]);

    return (
        <div className="bg-surface min-h-screen text-primary font-sans selection:bg-accent selection:text-white">
            <Header />

            <div className="container mx-auto px-6 pt-32 pb-16">
                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Left Sidebar - Accordion Boutique Style */}
                    <aside className="w-full lg:w-80 h-fit space-y-4 sticky top-32">
                        {/* Search - Always Visible */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-50 mb-6">
                            <div className="relative group">
                                <FiSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={16} />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search pieces..."
                                    className="w-full pl-7 pr-4 py-2 bg-transparent border-b border-orange-50 focus:border-orange-500 outline-none transition-all font-bold text-sm text-primary placeholder:text-gray-300"
                                />
                            </div>
                        </div>

                        {[
                            { id: 'categories', label: 'Collections', count: categories.length },
                            { id: 'price', label: 'Price Range' },
                            { id: 'sort', label: 'Sort Gallery' }
                        ].map((section) => (
                            <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-orange-50 overflow-hidden">
                                <button
                                    onClick={() => setOpenFilter(openFilter === section.id ? null : section.id)}
                                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-orange-50/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-600/80">{section.label}</span>
                                        {section.id === 'categories' && selectedCategories.length > 0 && (
                                            <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-black">
                                                {selectedCategories.length}
                                            </span>
                                        )}
                                    </div>
                                    <FiChevronDown className={`text-orange-400 transition-transform duration-500 ${openFilter === section.id ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence initial={false}>
                                    {openFilter === section.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                        >
                                            <div className="px-6 pb-6 pt-2 border-t border-orange-50">
                                                {section.id === 'categories' && (
                                                    <div className="flex flex-col gap-4">
                                                        {categories.map((cat) => (
                                                            <label key={cat._id} className="group flex items-center gap-3 cursor-pointer select-none">
                                                                <div className="relative flex items-center justify-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="peer appearance-none w-5 h-5 border-2 border-orange-200 rounded-md checked:bg-orange-500 checked:border-orange-500 transition-all duration-300"
                                                                        checked={selectedCategories.includes(cat.categoryName)}
                                                                        onChange={() => toggleCategory(cat.categoryName)}
                                                                    />
                                                                    <FiCheck className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" size={12} />
                                                                </div>
                                                                <span className={`text-sm font-bold tracking-wide transition-colors ${selectedCategories.includes(cat.categoryName) ? 'text-orange-600' : 'text-gray-500 group-hover:text-orange-400'}`}>
                                                                    {cat.categoryName}
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}

                                                {section.id === 'price' && (
                                                    <div className="space-y-6 pt-4">
                                                        <div className="flex justify-between items-center bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                                                            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Limit:</span>
                                                            <span className="text-sm font-black text-primary">₹{priceRange[1]}</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="50000"
                                                            step="1000"
                                                            value={priceRange[1]}
                                                            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                                            className="w-full accent-orange-500 bg-orange-200 h-1.5 rounded-full appearance-none cursor-pointer hover:h-2 transition-all"
                                                        />
                                                    </div>
                                                )}

                                                {section.id === 'sort' && (
                                                    <div className="flex flex-col gap-4">
                                                        {[
                                                            { id: 'newest', label: 'Latest Arrivals' },
                                                            { id: 'price-low', label: 'Economic First' },
                                                            { id: 'price-high', label: 'Premium First' },
                                                            { id: 'name', label: 'Alphabetical' }
                                                        ].map((opt) => (
                                                            <label key={opt.id} className="group flex items-center gap-3 cursor-pointer select-none">
                                                                <div className="relative flex items-center justify-center">
                                                                    <input
                                                                        type="radio"
                                                                        name="sortOrder"
                                                                        className="peer appearance-none w-5 h-5 border-2 border-orange-100 rounded-full checked:bg-orange-500 checked:border-orange-500 transition-all duration-300"
                                                                        checked={sortBy === opt.id}
                                                                        onChange={() => setSortBy(opt.id)}
                                                                    />
                                                                    <div className="absolute w-1.5 h-1.5 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                                                </div>
                                                                <span className={`text-sm font-bold tracking-wide transition-colors ${sortBy === opt.id ? 'text-orange-600' : 'text-gray-500 group-hover:text-orange-400'}`}>
                                                                    {opt.label}
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </aside>

                    {/* Right Content - Gallery Grid */}
                    <div className="flex-1">
                        {/* Results Header */}
                        <div className="mb-12 flex items-center justify-between border-b border-secondary pb-8">
                            <p className="text-[12px] font-black text-muted uppercase tracking-[0.2em]">
                                Exhibition: <span className="text-primary">{totalProducts} Piece{totalProducts !== 1 ? 's' : ''} Found</span>
                            </p>
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategories([]);
                                        setPriceRange([0, 100000]);
                                        setSortBy('newest');
                                        setCurrentPage(1);
                                    }}
                                    className="text-[10px] font-black text-accent hover:text-red-500 transition-colors flex items-center gap-3 uppercase tracking-widest group"
                                >
                                    <FiX className="group-hover:rotate-90 transition-transform" /> Clear Filter
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                                {[1, 2, 3, 4, 5, 6].map((n) => (
                                    <div key={n} className="aspect-[4/5] bg-white animate-pulse rounded-[2.5rem]" />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-16">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    <AnimatePresence mode='wait'>
                                        {products.map((p) => (
                                            <motion.div
                                                key={p._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.4 }}
                                                className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 border-1 border-orange-500 shadow-[0_12px_20px_-10px_rgba(249,115,22,0.5)] hover:shadow-[-15px_15px_30px_-10px_rgba(249,115,22,0.7)] hover:border-orange-400"
                                            >
                                                {/* Image Link */}
                                                <div className="relative h-48 overflow-hidden bg-gray-50">
                                                    <Link to={`/product-details/${p._id}`} className="block w-full h-full">
                                                        <img
                                                            src={p.images && p.images.length > 0 ? getImageUrl(p.images[0]) : ''}
                                                            alt={p.titleName}
                                                            className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
                                                        />
                                                        {/* Subtle Overlay on Hover */}
                                                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                    </Link>

                                                    {/* Category Badge - Top Left */}
                                                    <div className="absolute top-4 left-4 z-10">
                                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-orange-600 text-[10px] font-black  tracking-wider rounded-full shadow-sm">
                                                            {p.category}
                                                        </span>
                                                    </div>

                                                    {/* Action Buttons - Heart and Eye Icons sliding in */}
                                                    <div className="absolute top-4 right-4 flex flex-col gap-3 translate-x-12 group-hover:translate-x-0 transition-all duration-500 z-20">
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                // Add wishlist logic here
                                                            }}
                                                            className="p-3 bg-white rounded-full text-gray-400 hover:text-red-500 hover:scale-110 transition-all shadow-xl"
                                                        >
                                                            <FiHeart size={20} />
                                                        </button>
                                                        <Link
                                                            to={`/product-details/${p._id}`}
                                                            className="p-3 bg-white rounded-full text-gray-400 hover:text-orange-500 hover:scale-110 transition-all shadow-xl flex items-center justify-center"
                                                        >
                                                            <FiEye size={20} />
                                                        </Link>
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="p-3">
                                                    <div className="flex flex-col gap-1">
                                                        <Link to={`/product-details/${p._id}`}>
                                                            <h3 className="text-xl font-serif font-black text-orange-600 transition-colors line-clamp-1">
                                                                {p.titleName}
                                                            </h3>
                                                        </Link>
                                                    </div>
                                                    <p className="text-gray-500 text-sm line-clamp-1 mt-1 font-medium leading-relaxed">
                                                        {p.description}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-3 pt-12">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${currentPage === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-orange-600 hover:bg-orange-500 hover:text-white shadow-sm border border-orange-50'
                                                }`}
                                        >
                                            Back
                                        </button>

                                        <div className="flex items-center gap-2">
                                            {paginationRange.map((page, i) => (
                                                page === '...' ? (
                                                    <span key={`dots-${i}`} className="px-2 text-gray-400 font-black">...</span>
                                                ) : (
                                                    <button
                                                        key={i}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${currentPage === page
                                                            ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30'
                                                            : 'bg-white text-gray-500 hover:bg-orange-50 border border-orange-50'
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                )
                                            ))}
                                        </div>

                                        <button
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${currentPage === totalPages
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-orange-600 hover:bg-orange-500 hover:text-white shadow-sm border border-orange-50'
                                                }`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {products.length === 0 && !loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-40 text-center bg-white rounded-[4rem] border-2 border-dashed border-secondary/40"
                            >
                                <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center text-secondary mb-8">
                                    <FiSearch size={40} />
                                </div>
                                <h3 className="text-4xl font-serif font-black italic mb-6 tracking-tighter">No Pieces Found</h3>
                                <p className="text-muted text-lg max-w-sm font-medium leading-relaxed mb-10">We couldn't locate any designs matching your specific frequency. Try adjusting your lens.</p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategories([]);
                                        setPriceRange([0, 100000]);
                                    }}
                                    className="px-12 py-5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-accent transition-all shadow-2xl"
                                >
                                    Reset Discovery
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Shop;
