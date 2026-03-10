import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiChevronLeft, FiChevronRight, FiHeart, FiShare2,
    FiShoppingCart, FiLayers, FiShield, FiTruck, FiBox, FiChevronDown,
    FiPlus, FiMinus, FiMaximize, FiArrowRight, FiEye
} from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getSingleProduct, clearSelectedProduct, getAllProducts } from '../redux/slices/product.slice';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist, getWishlist } from '../redux/slices/wishlistSlice';
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedProduct, products, detailLoading, error } = useSelector((state) => state.product);
    const { userId } = useSelector((state) => state.auth);
    const { user: authUser } = useSelector((state) => state.auth || {});
    const { items: wishlistItems = [] } = useSelector((state) => state.wishlist || {});
    const { loading: cartLoading } = useSelector((state) => state.cart);

    const [activeImage, setActiveImage] = useState(0);
    const [selectedPaperIdx, setSelectedPaperIdx] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    const [unit, setUnit] = useState("feet"); // feet, inch, m, cm
    const [randomProducts, setRandomProducts] = useState([]);

    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isZooming, setIsZooming] = useState(false);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        dispatch(getSingleProduct(id));
        dispatch(getAllProducts({ limit: 50 })); // Fetch a larger set to pick from
        return () => dispatch(clearSelectedProduct());
    }, [dispatch, id]);

    useEffect(() => {
        if (authUser) {
            dispatch(getWishlist());
        }
    }, [dispatch, authUser]);

    const isWishlisted = (productId) => {
        return wishlistItems?.some(item => item._id === productId);
    };

    const handleWishlistToggle = (e, productId) => {
        e.preventDefault();
        e.stopPropagation();
        if (!authUser) {
            toast.error("Please login to manage wishlist");
            return;
        }
        if (isWishlisted(productId)) {
            dispatch(removeFromWishlist(productId));
        } else {
            dispatch(addToWishlist(productId));
        }
    };

    useEffect(() => {
        if (products && products.length > 0) {
            // Filter out current product and shuffle
            const otherProducts = products.filter(p => p._id !== id);
            const shuffled = [...otherProducts].sort(() => 0.5 - Math.random());
            setRandomProducts(shuffled.slice(0, 4));
        }
    }, [products, id]);

    useEffect(() => {
        if (selectedProduct?.images?.length > 0) {
            setActiveImage(0);
        }
        if (selectedProduct?.paperOptions?.length > 0) {
            setSelectedPaperIdx(0);
        }
    }, [selectedProduct]);

    const convertToFeet = (val, fromUnit) => {
        const value = parseFloat(val) || 0;
        if (fromUnit === "m") return value * 3.28084;
        if (fromUnit === "cm") return value * 0.0328084;
        if (fromUnit === "inch") return value * 0.0833333;
        return value; // already feet
    };

    const widthInFeet = convertToFeet(width, unit);
    const heightInFeet = convertToFeet(height, unit);
    const totalSqFt = (widthInFeet * heightInFeet) || 0;
    const pricePerSqFt = selectedProduct?.paperOptions?.[selectedPaperIdx]?.pricePerSqFt || 0;
    const calculatedTotal = (totalSqFt * pricePerSqFt * quantity).toFixed(2);

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `http://localhost:5000${path}`;
    };

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setZoomPosition({ x, y });
    };

    const scrollThumbnails = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -200 : 200;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleAddToCart = () => {
        if (!userId) {
            toast.error("Please login to add items to your collection");
            return;
        }

        if (!width || !height) {
            toast.error("Please specify your wall dimensions");
            return;
        }

        const cartItem = {
            userId,
            productId: selectedProduct._id,
            titleName: selectedProduct.titleName,
            image: selectedProduct.images[0],
            quantity,
            size: {
                width: parseFloat(width),
                height: parseFloat(height),
                unit
            },
            paperMaterial: {
                paperType: selectedProduct.paperOptions[selectedPaperIdx].paperType,
                pricePerSqFt: selectedProduct.paperOptions[selectedPaperIdx].pricePerSqFt
            },
            totalSqFt,
            price: parseFloat(calculatedTotal)
        };

        dispatch(addToCart(cartItem));
    };

    if (detailLoading) {
        return (
            <div className="bg-surface min-h-screen">
                <Header />
                <div className="flex justify-center items-center h-[70vh]">
                    <div className="relative w-20 h-20">
                        <div className="absolute inset-0 border-4 border-orange-500/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !selectedProduct) {
        return (
            <div className="bg-surface min-h-screen">
                <Header />
                <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
                    <div className="p-8 rounded-full bg-red-50 text-red-500">
                        <FiBox size={48} />
                    </div>
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase">Masterpiece Not Found</h2>
                    <p className="text-gray-500 max-w-sm text-center font-medium">The specific artwork frequency you are looking for has been moved or archived.</p>
                    <Link to="/shop" className="px-10 py-4 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-black transition-all shadow-2xl">
                        Return to Discovery
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-[#FBFAF8] min-h-screen text-[#1A1A1A] font-sans selection:bg-orange-500 selection:text-white">
            <Header />

            <main className="custom-container pt-32 pb-12">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-3 mb-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                    <Link to="/" className="hover:text-orange-500 transition-colors">home</Link>
                    <FiChevronRight size={12} />
                    <Link to="/shop" className="hover:text-orange-500 transition-colors">category</Link>
                    <FiChevronRight size={12} />
                    <span className="text-orange-600">{selectedProduct.titleName}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left: Gallery Section */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Main Image with Zoom */}
                        <div
                            className="relative aspect-[4/5] md:aspect-video lg:aspect-[4/3] bg-white rounded-[1rem] overflow-hidden shadow-2xl border border-orange-50 cursor-crosshair group"
                            onMouseMove={handleMouseMove}
                            onMouseEnter={() => setIsZooming(true)}
                            onMouseLeave={() => setIsZooming(false)}
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImage}
                                    src={getImageUrl(selectedProduct.images[activeImage])}
                                    alt={selectedProduct.titleName}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                                    className={`w-full h-full object-cover transition-transform duration-500 ${isZooming ? 'opacity-0' : 'opacity-100'}`}
                                />
                            </AnimatePresence>

                            {/* Zoomed Lens */}
                            {isZooming && (
                                <div
                                    className="absolute inset-0 z-10 pointer-events-none bg-no-repeat bg-[#F8F9FA]"
                                    style={{
                                        backgroundImage: `url(${getImageUrl(selectedProduct.images[activeImage])})`,
                                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                        backgroundSize: '250%'
                                    }}
                                />
                            )}

                            {/* Floating Badges */}
                            <div className="absolute top-8 left-8 z-20 flex flex-col gap-3">
                                <span className="px-4 py-2 bg-white/90 backdrop-blur-md border border-orange-100 rounded-full text-[10px] font-black uppercase tracking-widest text-orange-600 shadow-xl">
                                    {selectedProduct.category}
                                </span>
                            </div>
                        </div>

                        {/* Thumbnail Slider */}
                        <div className="relative pt-4 group">
                            {selectedProduct.images.length > 4 && (
                                <>
                                    <button
                                        onClick={() => scrollThumbnails('left')}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-400 hover:text-orange-500 transition-all opacity-0 group-hover:opacity-100 group-hover:-translate-x-2"
                                    >
                                        <FiChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={() => scrollThumbnails('right')}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-400 hover:text-orange-500 transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-2"
                                    >
                                        <FiChevronRight size={20} />
                                    </button>
                                </>
                            )}

                            <div
                                ref={scrollContainerRef}
                                className="flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth ps-2 py-4"
                            >
                                {selectedProduct.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden transition-all duration-500 border-2 ${activeImage === idx
                                            ? 'border-orange-500 scale-105 shadow-xl shadow-orange-500/20'
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={getImageUrl(img)} className="w-full h-full object-cover" alt={`View ${idx + 1}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Info Section */}
                    <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32 h-fit">
                        <section className="space-y-4">
                            <h1 className="text-4xl font-black  tracking-tighter text-orange-600">
                                {selectedProduct.titleName}
                            </h1>
                        </section>

                        {/* Paper Options / Pricing */}
                        <section className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-3">
                                <span className="w-8 h-px bg-orange-200" />
                                Material Specifications
                            </h3>

                            <div className="relative group">
                                <select
                                    value={selectedPaperIdx}
                                    onChange={(e) => setSelectedPaperIdx(parseInt(e.target.value))}
                                    className="w-full appearance-none bg-orange-50 p-3 pr-10 rounded-lg border border-orange-200 focus:border-orange-400 outline-none font-black uppercase text-[12px] tracking-widest text-orange-600 cursor-pointer transition-all"
                                >
                                    {selectedProduct.paperOptions?.map((opt, idx) => (
                                        <option key={idx} value={idx} className="bg-white text-primary uppercase">
                                            {opt.paperType} — ₹{opt.pricePerSqFt}
                                        </option>
                                    ))}
                                </select>
                                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-orange-600" size={14} />
                            </div>

                            {selectedProduct.paperOptions && selectedProduct.paperOptions[selectedPaperIdx] && (
                                <div className="flex items-end justify-between px-2 pt-2">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Quotation</p>
                                        <p className="text-xl font-black text-orange-300 tracking-tighter">
                                            ₹ {selectedProduct.paperOptions[selectedPaperIdx].pricePerSqFt}
                                        </p>
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-1">per sq. foot</p>
                                </div>
                            )}
                        </section>

                        {/* Dimensions & Unit */}
                        <section className="space-y-6 border-t border-orange-50">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-3">
                                <span className="w-8 h-px bg-orange-200" />
                                Wall Dimensions
                            </h3>

                            <div className="flex flex-wrap gap-4">
                                <div className="flex-1 min-w-[120px] relative">
                                    <input
                                        type="text"
                                        placeholder="Width"
                                        value={width}
                                        onChange={(e) => setWidth(e.target.value)}
                                        className="w-full bg-white p-3 rounded-lg border border-orange-200 focus:border-orange-400 outline-none transition-all font-bold text-sm"
                                    />
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-gray-400">{unit}</span>
                                </div>
                                <div className="flex-1 min-w-[120px] relative">
                                    <input
                                        type="text"
                                        placeholder="Height"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                        className="w-full bg-white p-3 rounded-lg border border-orange-200 focus:border-orange-400 outline-none transition-all font-bold text-sm"
                                    />
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-gray-400">{unit}</span>
                                </div>
                                <div className="w-full sm:w-auto relative">
                                    <select
                                        value={unit}
                                        onChange={(e) => setUnit(e.target.value)}
                                        className="w-full sm:w-28 appearance-none bg-orange-50 p-3 pr-10 rounded-lg border border-orange-200 focus:border-orange-400 outline-none font-black uppercase text-[10px] tracking-widest text-orange-600 cursor-pointer"
                                    >
                                        <option value="feet">Feet</option>
                                        <option value="inch">Inch</option>
                                        <option value="m">Meter</option>
                                        <option value="cm">CM</option>
                                    </select>
                                    <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-orange-600" size={14} />
                                </div>
                            </div>

                            {totalSqFt > 0 && (
                                <div className="p-5 bg-orange-50/30 rounded-3xl border border-dashed border-orange-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-orange-600">
                                        <FiMaximize size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Total Coverage</span>
                                    </div>
                                    <span className="text-sm font-black text-orange-600">{totalSqFt.toFixed(2)} Sq. Ft.</span>
                                </div>
                            )}
                        </section>

                        {/* Cart & Inventory */}
                        <section className=" space-y-6 border-t border-orange-50">
                            <div className="flex flex-wrap items-center justify-between gap-6">
                                {/* Quantity Controls */}
                                <div className="flex items-center bg-white rounded-lg border border-orange-200 p-1 shadow-sm">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
                                    >
                                        <FiMinus size={18} />
                                    </button>
                                    <span className="w-9 text-center font-black text-sm">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
                                    >
                                        <FiPlus size={18} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 ml-auto">
                                    <button
                                        onClick={(e) => handleWishlistToggle(e, selectedProduct._id)}
                                        className={`p-4 bg-white rounded-2xl border border-orange-50 ${isWishlisted(selectedProduct._id) ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500 hover:border-orange-100'} transition-all shadow-sm`}
                                    >
                                        <FiHeart size={20} fill={isWishlisted(selectedProduct._id) ? "currentColor" : "none"} />
                                    </button>
                                    <button className="p-4 bg-white rounded-2xl border border-orange-50 text-gray-400 hover:text-blue-500 hover:border-blue-100 transition-all shadow-sm">
                                        <FiShare2 size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-end justify-between px-2">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Grand total</p>
                                        <p className="text-3xl font-black text-orange-600 tracking-tighter italic">
                                            ₹ {calculatedTotal}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className={`flex items-center justify-end gap-2 mb-1`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${selectedProduct.stocks > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                            <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
                                                {selectedProduct.stocks} Available
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={cartLoading}
                                    className="w-full py-5 bg-orange-500 hover:bg-black text-white rounded-lg font-black uppercase tracking-[0.3em] transition-all shadow-2xl shadow-orange-600/30 flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FiShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                                    {cartLoading ? 'Adding to Gallery...' : 'Add to Collection'}
                                </button>
                            </div>
                        </section>

                        {/* Benefits */}
                        <div className="flex flex-col sm:flex-row gap-3 xs:gap-4 pt-6">
                            <div className="flex-1 flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-orange-200 rounded-2xl bg-white shadow-sm transition-all">
                                <div className="p-2 sm:p-3 bg-orange-50 rounded-xl text-orange-600 flex-shrink-0"><FiShield size={18} /></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest mb-1">Authentic</p>
                                    <p className="text-[10px] text-gray-500 leading-tight font-medium">Genuine Artworks</p>
                                </div>
                            </div>
                            <div className="flex-1 flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-orange-200 rounded-2xl bg-white shadow-sm transition-all">
                                <div className="p-2 sm:p-3 bg-orange-50 rounded-xl text-orange-600 flex-shrink-0"><FiTruck size={18} /></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest mb-1">Curation</p>
                                    <p className="text-[10px] text-gray-500 leading-tight font-medium">Expert Delivery</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Full Width Description Section below the grid */}
                <section className="mt-8 border-t border-orange-50">
                    <div className="">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 flex items-center gap-4">
                            <span className="w-12 h-px bg-orange-200" />
                            Product Description
                        </h3>
                        <div className="space-y-6">
                            <p className="text-[16px] font-medium text-gray-600 leading-relaxed italic">
                                {selectedProduct.description}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Trending Products - Random 4 */}
                <section className="bg-gray-50/50 mt-12 rounded-[3.5rem]">
                    <div className="custom-container">
                        <div className="flex items-end justify-between mb-12">
                            <div className="space-y-2">
                                <span className="text-orange-600 font-bold tracking-widest text-[10px] uppercase">Curated Collection</span>
                                <h2 className="text-4xl font-serif text-gray-900 italic">Trending Masterpieces</h2>
                            </div>
                            <Link to="/shop" className="hidden sm:flex items-center gap-2 text-gray-900 font-black text-xs uppercase tracking-widest hover:text-orange-600 transition-colors group">
                                View Gallery <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {randomProducts.map((p) => (
                                <div key={p._id} className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 border-1 border-orange-500 shadow-[0_12px_20px_-10px_rgba(249,115,22,0.5)] hover:shadow-[-15px_15px_30px_-10px_rgba(249,115,22,0.7)] hover:border-orange-400 transition-all duration-700">
                                    <Link to={`/product-details/${p._id}`} onClick={() => window.scrollTo(0, 0)} className="block relative h-48 overflow-hidden bg-gray-50">
                                        <img
                                            src={getImageUrl(p?.images[0])}
                                            alt={p.titleName}
                                            className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
                                        />
                                        <div className="absolute top-4 left-4 z-10">
                                            <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-orange-600 text-[10px] font-black tracking-wider rounded-full shadow-sm">
                                                {p.category}
                                            </span>
                                        </div>
                                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="absolute top-4 right-4 flex flex-col gap-3 translate-x-12 group-hover:translate-x-0 transition-all duration-500 z-10">
                                            <button onClick={(e) => handleWishlistToggle(e, p._id)} className={`p-3 bg-white rounded-full ${isWishlisted(p._id) ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'} hover:scale-110 transition-all shadow-xl`}>
                                                <FiHeart size={20} fill={isWishlisted(p._id) ? "currentColor" : "none"} />
                                            </button>
                                            <div className="p-3 bg-white rounded-full text-gray-400 hover:text-orange-500 hover:scale-110 transition-all shadow-xl flex items-center justify-center">
                                                <FiEye size={20} />
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="p-4">
                                        <Link to={`/product-details/${p._id}`} onClick={() => window.scrollTo(0, 0)}>
                                            <h3 className="text-xl font-serif font-black text-orange-600 transition-colors line-clamp-1 italic">
                                                {p.titleName}
                                            </h3>
                                        </Link>
                                        <p className="text-gray-500 text-[11px] line-clamp-1 mt-1 font-medium leading-relaxed uppercase tracking-wider">
                                            {p.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ProductDetails;
