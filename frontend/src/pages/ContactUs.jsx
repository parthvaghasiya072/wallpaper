import React from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiMessageCircle, FiClock, FiSend } from 'react-icons/fi';
import Header from '../components/Header';
import toast from 'react-hot-toast';

const ContactUs = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("Message received. Our curators will reach out soon.");
    };

    return (
        <div className="bg-[#F0F2F5] min-h-screen pb-20">
            <Header />

            {/* Header Content */}
            <div className="pt-40 pb-20">
                <div className="custom-container text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 mb-6 block"
                    >
                        Get in Touch
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-serif font-black text-primary mb-10 italic tracking-tighter"
                    >
                        We're here to help<br />your vision manifest.
                    </motion.h1>
                </div>
            </div>

            <div className="custom-container">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

                    {/* Information Sidebar */}
                    <div className="md:col-span-4 space-y-10 order-2 md:order-1">
                        <div className="space-y-6">
                            <h3 className="text-xl font-serif font-black text-primary italic mb-6">Contact Intel</h3>

                            <motion.div
                                whileHover={{ x: 10 }}
                                className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm"
                            >
                                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <FiMail size={20} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted opacity-50 mb-1 leading-none">Email Matrix</p>
                                    <p className="font-bold text-primary text-sm truncate">curators@lumiere.art</p>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ x: 10 }}
                                className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm"
                            >
                                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <FiPhone size={20} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted opacity-50 mb-1 leading-none">Voice Protocol</p>
                                    <p className="font-bold text-primary text-sm">+91 99000 88222</p>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ x: 10 }}
                                className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm"
                            >
                                <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <FiMapPin size={20} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted opacity-50 mb-1 leading-none">Artistic Node</p>
                                    <p className="font-bold text-primary text-sm">702, Art District, Mumbai, India</p>
                                </div>
                            </motion.div>
                        </div>

                        <div className="p-10 bg-primary text-white rounded-[3rem] shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                <FiClock size={120} />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-6 relative z-10">Studio Hours</h4>
                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between font-bold text-sm tracking-widest uppercase">
                                    <span className="text-gray-400">Mon - Fri</span>
                                    <span>09:00 - 18:00</span>
                                </div>
                                <div className="flex justify-between font-bold text-sm tracking-widest uppercase">
                                    <span className="text-gray-400">Sat</span>
                                    <span>10:00 - 16:00</span>
                                </div>
                                <div className="flex justify-between font-bold text-sm tracking-widest uppercase italic text-orange-500 pt-4">
                                    <span>Sunday</span>
                                    <span>CLOSED Project</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-8 order-1 md:order-2">
                        <div className="bg-white rounded-[3.5rem] p-10 md:p-16 border border-gray-100 shadow-2xl shadow-gray-200">
                            <h3 className="text-3xl font-serif font-black text-primary italic mb-10">Send a Transmission.</h3>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-8 py-5 rounded-2xl bg-[#F0F2F5]/50 border-2 border-transparent focus:border-orange-500/20 outline-none transition-all font-bold text-sm tracking-tighter"
                                        placeholder="Identification Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Email Node</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-8 py-5 rounded-2xl bg-[#F0F2F5]/50 border-2 border-transparent focus:border-orange-500/20 outline-none transition-all font-bold text-sm tracking-tighter"
                                        placeholder="Communication Sync"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Subject Matter</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-8 py-5 rounded-2xl bg-[#F0F2F5]/50 border-2 border-transparent focus:border-orange-500/20 outline-none transition-all font-bold text-sm tracking-tighter"
                                        placeholder="Reason for Contact"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">The Message</label>
                                    <textarea
                                        required
                                        rows="6"
                                        className="w-full px-8 py-5 rounded-3xl bg-[#F0F2F5]/50 border-2 border-transparent focus:border-orange-500/20 outline-none transition-all font-bold text-sm tracking-tighter resize-none"
                                        placeholder="Articulate your thoughts here..."
                                    />
                                </div>
                                <div className="md:col-span-2 pt-6">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full py-5 bg-primary text-white rounded-2xl rounded-tr-[3rem] font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 shadow-xl shadow-gray-200 hover:bg-black transition-all"
                                    >
                                        <FiSend size={16} /> Ignite Communication
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ContactUs;
