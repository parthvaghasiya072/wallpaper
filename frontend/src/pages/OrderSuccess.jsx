import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiPackage, FiArrowRight, FiHome } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';

const OrderSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    return (
        <div className="min-h-screen bg-surface font-sans text-primary">
            <Header />

            <main className="pt-40 pb-20 flex items-center justify-center">
                <div className="custom-container max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[3rem] p-12 md:p-20 shadow-2xl shadow-orange-500/5 border border-secondary flex flex-col items-center text-center relative overflow-hidden"
                    >
                        {/* Decorative background circle */}
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-orange-50 rounded-full blur-3xl opacity-50" />

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 12, delay: 0.2 }}
                            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-8 shadow-xl shadow-green-500/20"
                        >
                            <FiCheckCircle size={48} />
                        </motion.div>

                        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-primary">
                            Masterpiece Ordered!
                        </h1>
                        <p className="text-muted text-lg mb-10 leading-relaxed max-w-md">
                            Thank you for your acquisition. We are preparing your curated selection with the utmost care.
                            {sessionId && <span className="block mt-2 font-bold text-sm">Payment Verified Successfully</span>}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            <Link
                                to="/profile"
                                state={{ activeTab: 'orders' }}
                                className="flex items-center justify-center gap-3 px-8 py-5 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all duration-500 shadow-xl shadow-primary/20"
                            >
                                <FiPackage size={18} /> View Orders
                            </Link>
                            <Link
                                to="/"
                                className="flex items-center justify-center gap-3 px-8 py-5 bg-white border-2 border-secondary text-primary rounded-2xl font-black uppercase text-xs tracking-widest hover:border-orange-500 hover:text-orange-500 transition-all duration-500"
                            >
                                <FiHome size={18} /> Back to Gallery
                            </Link>
                        </div>

                        <div className="mt-12 pt-12 border-t border-secondary w-full">
                            <p className="text-xs font-black uppercase tracking-widest text-muted mb-4">You might also like</p>
                            <Link to="/shop" className="inline-flex items-center gap-2 text-orange-500 font-bold hover:gap-4 transition-all">
                                Continue exploring designs <FiArrowRight />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default OrderSuccess;
