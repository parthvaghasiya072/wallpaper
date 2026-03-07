import React, { useEffect, useState, useRef } from 'react';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBanners } from '../redux/slices/bannerSlice';

const MinimalistOrangeBanner = () => {
    const dispatch = useDispatch();
    const { banners, loading } = useSelector((state) => state.banners || { banners: [], loading: false });
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const autoSlideRef = useRef(null);

    useEffect(() => {
        dispatch(getAllBanners());
    }, [dispatch]);

    // Auto-slide logic - pauses on hover
    useEffect(() => {
        if (banners && banners.length > 1 && !isHovered) {
            autoSlideRef.current = setInterval(() => {
                nextSlide();
            }, 8000);
        } else {
            if (autoSlideRef.current) clearInterval(autoSlideRef.current);
        }
        return () => {
            if (autoSlideRef.current) clearInterval(autoSlideRef.current);
        };
    }, [banners, currentIndex, isHovered]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `http://localhost:5000${path}`;
    };

    if (loading && (!banners || banners.length === 0)) {
        return <div className="py-20 text-center text-orange-500 font-bold font-serif">Loading curated collection...</div>;
    }

    if (!banners || banners.length === 0) {
        return (
            <section className="py-12 bg-white">
                <div className="custom-container">
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">No banners found in your collection.</p>
                    </div>
                </div>
            </section>
        );
    }

    const currentBanner = banners[currentIndex];

    return (
        <section className="py-12 bg-white overflow-hidden">
            <div className="custom-container">
                <div
                    className="relative h-[350px] md:h-[450px] rounded-[2rem] overflow-hidden group border-2 border-orange-500 shadow-[0_25px_30px_-15px_rgba(249,115,22,0.5)] hover:shadow-[0_30px_50px_-10px_rgba(249,115,22,0.7)] hover:border-orange-400 transition-all duration-700 bg-orange-600 cursor-pointer"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >

                    <AnimatePresence initial={false}>
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            className="absolute inset-0 z-10"
                        >
                            {/* Background Image with Original Blur Hover Effect */}
                            <motion.img
                                src={getImageUrl(currentBanner.image)}
                                alt={currentBanner.title}
                                className="absolute inset-0 w-full h-full object-cover  transition-all duration-700 group-hover:scale-110 group-hover:blur-[4px]"
                            />

                            {/* Original Default Overlay (from black/80) - Fades out on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent transition-opacity duration-700 group-hover:opacity-0 z-10"></div>

                            {/* Original Hover Overlay (Amber/Black Mix) - Fades in on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-orange-950/40 to-black/95 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>

                            {/* Content Layer */}
                            <div className="relative h-full flex items-center z-20 px-8 md:px-20">
                                <div className="max-w-3xl space-y-4 md:space-y-6">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-4"
                                    >
                                        <span className="w-16 h-[2px] bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,1)]"></span>
                                        <span className="text-orange-500 font-black uppercase tracking-[0.5em] text-[10px] md:text-[12px]">
                                            Exclusive Series
                                        </span>
                                    </motion.div>

                                    <div className="space-y-4">
                                        {/* Header with Hover Scale Effect (as before) */}
                                        <h2 className="text-white text-3xl md:text-6xl font-serif font-black leading-[0.9] tracking-tighter transition-all duration-500 group-hover:scale-105 origin-left">
                                            {currentBanner.title?.split(' ').map((word, i) => (
                                                <React.Fragment key={i}>
                                                    {i === 1 ? (
                                                        <>
                                                            <br />
                                                            <span className="text-orange-500 italic drop-shadow-2xl">{word}</span>
                                                        </>
                                                    ) : (
                                                        word + ' '
                                                    )}
                                                </React.Fragment>
                                            )) || currentBanner.title}
                                        </h2>

                                        {/* Description with Hover Color Effect (as before) */}
                                        <p className="text-gray-200 text-sm md:text-xl font-medium max-w-sm md:max-w-lg leading-relaxed border-l-4 border-orange-500/50 pl-8 transition-colors duration-500 group-hover:text-white">
                                            {currentBanner.description}
                                        </p>
                                    </div>

                                    {/* Buttons - Hide by default, slide up on hover (as before) */}
                                    <div
                                        className="flex flex-wrap gap-6 pt-2 opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-out"
                                    >
                                        <button className="group/btn px-8 py-3 bg-orange-600 text-white rounded-2xl font-black text-lg hover:bg-white hover:text-orange-600 border-2 border-orange-600 transition-all duration-500 flex items-center gap-3 shadow-[0_15px_30px_rgba(249,115,22,0.3)] hover:shadow-[0_20px_40px_rgba(249,115,22,0.5)] active:scale-95">
                                            Shop Now <FiArrowRight className="group-hover/btn:translate-x-2 transition-transform duration-300" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Controls - Manual only on hover */}
                    {banners.length > 1 && (
                        <>
                            {/* Chevron Buttons */}
                            <div className="absolute inset-y-0 right-10 z-30 flex flex-col justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                    className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-orange-500 hover:border-orange-500 transition-all duration-300"
                                >
                                    <FiChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                    className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-orange-500 hover:border-orange-500 transition-all duration-300"
                                >
                                    <FiChevronRight size={24} />
                                </button>
                            </div>

                            {/* Progress Dots - Manual navigation */}
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
                                {banners.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                                        className={`relative h-1.5 transition-all duration-500 rounded-full overflow-hidden ${idx === currentIndex ? 'w-12 bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)]' : 'w-4 bg-white/30 hover:bg-white/50'
                                            }`}
                                    >
                                        {!isHovered && idx === currentIndex && (
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 8, ease: "linear" }}
                                                className="absolute inset-0 bg-white/40"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default MinimalistOrangeBanner;