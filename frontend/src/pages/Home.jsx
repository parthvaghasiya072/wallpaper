import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiCheck, FiHeart, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getHeroSections } from '../redux/slices/heroSlice';
import { getAllTags } from '../redux/slices/tagslice';
import { getAllCategories } from '../redux/slices/categorySlice';
import MinimalistOrangeBanner from '../components/MinimalistOrangeBanner';
import { getAllProducts } from '../redux/slices/product.slice';

const Home = () => {
    const dispatch = useDispatch();
    const { heroSections, loading } = useSelector((state) => state.hero || { heroSections: [], loading: false });
    const { products } = useSelector((state) => state.product || { products: [], loading: false });
    console.log('products', products);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        dispatch(getHeroSections());
    }, [dispatch]);

    // Auto-slide logic
    useEffect(() => {
        if (heroSections && heroSections.length > 1) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % heroSections.length);
            }, 10000); // Change slide every 10 seconds
            return () => clearInterval(timer);
        }
    }, [heroSections]);

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `http://localhost:5000${path}`;
    };

    const { tags } = useSelector((state) => state.tag || { tags: [], loading: false });

    useEffect(() => {
        dispatch(getAllTags());
    }, [dispatch]);

    const { categories } = useSelector((state) => state.category || { categories: [], loading: false });

    useEffect(() => {
        dispatch(getAllCategories());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    const trending = [
        { id: 1, name: "Golden Leaves", price: "$120", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=400&auto=format&fit=crop" },
        { id: 2, name: "Ocean Breeze", price: "$95", image: "https://images.unsplash.com/photo-1507646227500-4d389b0012be?q=80&w=400&auto=format&fit=crop" },
        { id: 3, name: "Muted Mountains", price: "$150", image: "https://images.unsplash.com/photo-1507090960745-b32f65d3113a?q=80&w=400&auto=format&fit=crop" },
        { id: 4, name: "Marble Texture", price: "$110", image: "https://images.unsplash.com/photo-1628172971217-19ce41f49635?q=80&w=400&auto=format&fit=crop" },
    ];

    return (
        <div className="bg-white min-h-screen font-sans text-gray-900">
            <Header />

            {/* Hero Section */}
            <section className="relative h-screen min-h-[600px] flex items-center justify-start overflow-hidden bg-gray-900">
                <AnimatePresence>
                    {heroSections && heroSections.length > 0 ? (
                        <motion.div
                            key={heroSections[currentIndex]._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            className="absolute inset-0"
                        >
                            {/* Background Image with Overlay */}
                            <div className="absolute inset-0 z-0">
                                <motion.img
                                    key={`img-${heroSections[currentIndex]._id}`}
                                    initial={{ scale: 1.05, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    src={getImageUrl(heroSections[currentIndex].image)}
                                    alt={heroSections[currentIndex].title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10  to-transparent"></div>
                            </div>

                            {/* Hero Content */}
                            <div className="relative z-10 h-full flex items-center justify-start text-left px-6 md:px-20 text-wrap w-full">
                                <div className="space-y-6 max-w-4xl">
                                    <motion.span
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3, duration: 0.6 }}
                                        className="inline-block px-4 py-1.5 bg-orange-500/20 backdrop-blur-md rounded-full text-orange-300 text-[10px] font-black uppercase tracking-[0.3em] border border-orange-500/30 shadow-2xl"
                                    >
                                        Featured Collection
                                    </motion.span>
                                    <motion.h1
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5, duration: 0.7 }}
                                        className="text-4xl md:text-5xl lg:text-[100px] font-serif text-orange-400 leading-[1] tracking-tighter"
                                    >
                                        {heroSections[currentIndex].title.split(' ').map((word, i) => (
                                            <span key={i} className={i % 2 !== 0 ? "italic font-light" : "font-black"}>
                                                {word}{' '}
                                            </span>
                                        ))}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.7, duration: 0.7 }}
                                        className="text-sm md:text-lg text-white font-medium leading-relaxed tracking-wide"
                                    >
                                        {heroSections[currentIndex].description}
                                    </motion.p>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.9, duration: 0.6 }}
                                        className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-4"
                                    >
                                        <button className="group px-8 py-4 bg-orange-300 text-gray-900 rounded-full font-black text-[16px] tracking-[0.2em] hover:bg-orange-400 transition-all duration-300 shadow-xl flex items-center gap-3">
                                            Shop Collection <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                        <button className="px-8 py-4 bg-transparent border border-orange-300/50 text-orange-300 rounded-full font-black text-[16px] tracking-[0.2em] hover:bg-orange-300/10 transition-all backdrop-blur-sm">
                                            View Lookbook
                                        </button>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white opacity-20 uppercase tracking-[0.5em] font-black text-xs">
                            {loading ? "Discovering Luxury..." : "Experience the Orange"}
                        </div>
                    )}
                </AnimatePresence>

                {/* Progress Indicators */}
                {heroSections && heroSections.length > 1 && (
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {heroSections.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-1.5 transition-all duration-500 rounded-full ${idx === currentIndex ? 'w-10 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'w-4 bg-white/20 hover:bg-white/40'}`}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Features Info Bar */}
            <section className="bg-amber-50 py-12 border-b border-amber-100/50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-gray-800">
                        {tags?.map((feature, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-orange-200/40 text-orange-800">
                                    <FiCheck size={20} />
                                </div>
                                <h3 className="font-serif font-bold text-lg">{feature.tagTitle}</h3>
                                <p className="text-sm text-gray-500">{feature.tagDescription}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 space-y-2">
                        <span className="text-amber-600 font-bold tracking-widest text-xs uppercase">Curated For You</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-gray-900">Shop by Category</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
                        {categories?.slice(0, 4).map((cat) => (
                            <div key={cat._id} className="group relative h-[400px] overflow-hidden rounded-2xl border-2 border-orange-300  hover:shadow-[0_20px_50px_-10px_rgba(249,115,22,0.7)] hover:border-orange-400 transition-all duration-700 bg-orange-600 cursor-pointer">
                                <img
                                    src={getImageUrl(cat?.categoryImage)}
                                    alt={cat?.categoryName}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                    <h3 className="text-2xl font-serif text-white mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        {cat?.categoryName}
                                    </h3>
                                    <span className="text-white/80 text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                        Explore <FiArrowRight />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Minimalist Wallpaper Banner */}
            <MinimalistOrangeBanner />

            {/* Trending Products */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="flex items-end justify-between mb-12">
                        <div className="space-y-2">
                            <span className="text-amber-600 font-bold tracking-widest text-xs uppercase">Favorites</span>
                            <h2 className="text-4xl font-serif text-gray-900">Trending Now</h2>
                        </div>
                        <Link to="/shop" className="hidden sm:flex items-center gap-2 text-gray-900 font-medium hover:text-amber-600 transition-colors group">
                            View All <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products?.slice(0, 4).map((p) => (
                            <div key={p._id} className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 border-1 border-orange-500 shadow-[0_12px_20px_-10px_rgba(249,115,22,0.5)] hover:shadow-[-15px_15px_30px_-10px_rgba(249,115,22,0.7)] hover:border-orange-400 transition-all duration-700">
                                {/* Image Link */}
                                <Link to={`/product-details/${p._id}`} className="block relative h-48 overflow-hidden bg-gray-50">
                                    <img
                                        src={getImageUrl(p?.images[0])}
                                        alt={p.titleName}
                                        className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
                                    />

                                    {/* Category Badge - Top Left */}
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-orange-600 text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm">
                                            {p.category}
                                        </span>
                                    </div>

                                    {/* Subtle Overlay on Hover */}
                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    {/* Action Buttons - Heart and Eye Icons sliding in */}
                                    <div className="absolute top-4 right-4 flex flex-col gap-3 translate-x-12 group-hover:translate-x-0 transition-all duration-500 z-10">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                            }}
                                            className="p-3 bg-white rounded-full text-gray-400 hover:text-red-500 hover:scale-110 transition-all shadow-xl pointer-events-auto"
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
                                </Link>

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
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter / CTA Section */}
            <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="container mx-auto px-6 relative z-10 text-center max-w-2xl">
                    <h2 className="text-4xl md:text-5xl font-serif mb-6">Join the Design Club</h2>
                    <p className="text-gray-400 mb-8 text-lg font-light">
                        Sign up for our newsletter to receive exclusive design tips, early access to new collections, and 10% off your first order.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-1 bg-transparent border-none text-white placeholder-gray-500 px-6 py-4 outline-none focus:ring-0"
                        />
                        <button className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-amber-100 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;