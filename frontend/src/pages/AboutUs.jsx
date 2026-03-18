import React from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiUsers, FiAward, FiStar } from 'react-icons/fi';
import Header from '../components/Header';

const AboutUs = () => {
    return (
        <div className="bg-[#F0F2F5] min-h-screen pb-20">
            <Header />

            {/* Hero Section */}
            <div className="pt-40 pb-20 bg-gradient-to-b from-white to-[#F0F2F5]">
                <div className="custom-container text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 mb-6 block"
                    >
                        Our Legacy
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-serif font-black text-primary mb-10 italic tracking-tighter"
                    >
                        Redefining Art<br />for the Modern Space.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-2xl mx-auto text-muted text-lg leading-relaxed font-medium"
                    >
                        Founded with a vision to make museum-grade aesthetics accessible, Lumière curates exclusive collections of digital and physical wallpapers that transform ordinary walls into extraordinary experiences.
                    </motion.p>
                </div>
            </div>

            {/* Core Values */}
            <div className="py-24 bg-white">
                <div className="custom-container">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="space-y-6"
                        >
                            <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                <FiTarget size={28} />
                            </div>
                            <h3 className="font-serif font-bold text-xl text-primary italic">Our Mission</h3>
                            <p className="text-sm text-muted leading-relaxed">To ignite inspiration in every home through high-definition artistry and premium materials.</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="space-y-6"
                        >
                            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                <FiUsers size={28} />
                            </div>
                            <h3 className="font-serif font-bold text-xl text-primary italic">The Community</h3>
                            <p className="text-sm text-muted leading-relaxed">Connecting global artists with homeowners who value uniqueness and creative expression.</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="space-y-6"
                        >
                            <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                <FiAward size={28} />
                            </div>
                            <h3 className="font-serif font-bold text-xl text-primary italic">Quality First</h3>
                            <p className="text-sm text-muted leading-relaxed">Using only sustainable, archival-grade paper and non-toxic inks for a lifelong finish.</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="space-y-6"
                        >
                            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                <FiStar size={28} />
                            </div>
                            <h3 className="font-serif font-bold text-xl text-primary italic">Expert Curation</h3>
                            <p className="text-sm text-muted leading-relaxed">Every piece in our catalog is hand-selected by a panel of renowned interior designers.</p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Story Section */}
            <div className="py-24">
                <div className="custom-container">
                    <div className="bg-primary rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl">
                        <div className="md:w-1/2 p-12 md:p-24 flex flex-col justify-center">
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8 italic tracking-tight">The Aesthetic Philosophy.</h2>
                            <p className="text-gray-300 leading-relaxed mb-10 font-medium">
                                We believe that your environment profoundly impacts your state of mind. By integrating high-art into living spaces, we aim to provide a sanctuary of beauty and thought. Our journey began in a small studio, driven by the desire to bring the digital frontiers of art into the tangible world.
                            </p>
                            <ul className="space-y-4 text-white font-bold text-sm tracking-widest uppercase">
                                <li className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                                    Hand-crafted textures
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                                    Global artistic collaboration
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                                    Eco-friendly printing processes
                                </li>
                            </ul>
                        </div>
                        <div className="md:w-1/2 relative min-h-[400px]">
                            <img
                                src="https://images.unsplash.com/photo-1518005020411-38b81210a7ab?q=80&w=2070&auto=format&fit=crop"
                                alt="Art Studio"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-24 text-center">
                <div className="custom-container">
                    <h3 className="text-4xl font-serif font-bold text-primary italic mb-10">Start Your Collection Today.</h3>
                    <motion.a
                        href="/shop"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block px-12 py-5 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-orange-200"
                    >
                        Explore the Gallery
                    </motion.a>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
