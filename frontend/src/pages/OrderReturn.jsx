import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleConfirmedOrder, returnOrder } from '../redux/slices/orderSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiPackage, FiRefreshCcw, FiCheckCircle, FiInfo, FiAlertCircle, FiMapPin, FiCalendar, FiDollarSign } from 'react-icons/fi';
import toast from 'react-hot-toast';

const OrderReturn = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentOrder, loading } = useSelector((state) => state.order);
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        dispatch(getSingleConfirmedOrder(id));
    }, [dispatch, id]);

    const handleReturn = async (e) => {
        e.preventDefault();
        if (!reason) {
            toast.error("Please select a reason for return");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await dispatch(returnOrder({ orderId: id, reason })).unwrap();
            if (result.success) {
                navigate('/profile', { state: { activeTab: 'returns' } });
            }
        } catch (error) {
            console.error("Return failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-orange-600/40 animate-pulse">Synchronizing Order Data...</p>
            </div>
        );
    }

    if (!currentOrder) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-8 border-4 border-white shadow-xl"
                >
                    <FiAlertCircle size={48} />
                </motion.div>
                <h2 className="text-4xl font-serif font-black text-primary mb-4 italic tracking-tight">Access Denied</h2>
                <p className="text-muted mb-10 max-w-sm font-medium leading-relaxed">This order could not be located or may have already been processed for a return request.</p>
                <button
                    onClick={() => navigate('/profile')}
                    className="px-12 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-black transition-all shadow-2xl shadow-gray-200 active:scale-95"
                >
                    Return to Collection
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] py-16 px-4 md:px-12 selection:bg-orange-100 selection:text-orange-900">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div>
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => navigate('/profile', { state: { activeTab: 'orders' } })}
                            className="flex items-center gap-3 text-muted hover:text-orange-600 transition-all font-black text-[10px] uppercase tracking-[0.3em] mb-4 group px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm w-fit"
                        >
                            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to orders
                        </motion.button>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl font-serif font-black text-primary italic tracking-tight"
                        >
                            Return Masterpiece
                        </motion.h1>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-orange-500 text-white px-8 py-4 rounded-[2rem] flex items-center gap-4 shadow-2xl shadow-orange-200"
                    >
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
                            <FiPackage size={24} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Order Reference</p>
                            <p className="text-lg font-black tracking-tight uppercase">#{currentOrder._id.slice(-8)}</p>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Panel: Detailed Order Info */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Items Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]"
                        >
                            <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-6">
                                <h3 className="text-xl font-bold text-primary flex items-center gap-3">
                                    <FiPackage className="text-orange-500" /> Items for Return
                                </h3>
                                <span className="text-[10px] font-black text-muted uppercase tracking-widest">{currentOrder.items.length} Units</span>
                            </div>

                            <div className="space-y-6">
                                {currentOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row gap-8 p-6 rounded-[2rem] bg-gray-50/50 hover:bg-orange-50/30 transition-colors border border-transparent hover:border-orange-100 group">
                                        <div className="w-full sm:w-32 h-32 rounded-[1.5rem] overflow-hidden shadow-2xl shadow-gray-200 flex-shrink-0 relative">
                                            <img
                                                src={item.image?.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                alt={item.titleName}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <div className="flex justify-between items-start mb-2">
                                                <h5 className="font-black text-primary text-lg uppercase tracking-tight">{item.titleName}</h5>
                                                <p className="text-xl font-black text-orange-600 italic">₹{item.price}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-4 mt-2">
                                                <div className="px-4 py-1.5 bg-white border border-gray-100 rounded-full text-[9px] font-black uppercase text-muted tracking-widest flex items-center gap-2 shadow-sm">
                                                    <FiInfo size={10} className="text-orange-400" /> {item.paperMaterial?.paperType}
                                                </div>
                                                <div className="px-4 py-1.5 bg-white border border-gray-100 rounded-full text-[9px] font-black uppercase text-muted tracking-widest flex items-center gap-2 shadow-sm">
                                                    Quantity: {item.quantity}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Order Meta Section */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/50"
                            >
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted mb-6 flex items-center gap-2">
                                    <FiMapPin className="text-orange-500" /> Pickup Address
                                </h4>
                                <div className="space-y-1">
                                    <p className="font-black text-primary text-lg">{currentOrder.shippingAddress?.fullName}</p>
                                    <p className="text-sm text-muted leading-relaxed font-semibold">
                                        {currentOrder.shippingAddress?.addressLine1},<br />
                                        {currentOrder.shippingAddress?.city}, {currentOrder.shippingAddress?.state} - {currentOrder.shippingAddress?.pincode}
                                    </p>
                                    <p className="text-xs font-bold text-orange-600 mt-4 tracking-tighter italic">Contact: {currentOrder.shippingAddress?.mobileNo}</p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/50"
                            >
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted mb-6 flex items-center gap-2">
                                    <FiCalendar className="text-orange-500" /> Order Context
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                                        <span className="text-xs font-bold text-muted uppercase">Purchased on</span>
                                        <span className="text-sm font-black text-primary italic">{new Date(currentOrder.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-muted uppercase">Payment Mode</span>
                                        <span className="text-sm font-black text-primary italic uppercase tracking-tighter">Stripe / Online</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right Panel: Validation & Action */}
                    <div className="lg:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="sticky top-10"
                        >
                            <div className="bg-white rounded-[3rem] border border-orange-100 p-10 shadow-[0_40px_100px_-20px_rgba(249,115,22,0.15)] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 opacity-50 blur-3xl" />

                                <h3 className="text-2xl font-serif font-black text-primary italic mb-8 relative">Confirm Return</h3>

                                <form onSubmit={handleReturn} className="space-y-8 relative">
                                    <div className="group">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted mb-4 block group-focus-within:text-orange-600 transition-all">
                                            Specify Reason
                                        </label>
                                        <div className="relative">
                                            <select
                                                required
                                                value={reason}
                                                onChange={(e) => setReason(e.target.value)}
                                                className="w-full px-8 py-5 bg-gray-50 rounded-[1.5rem] border-2 border-transparent focus:border-orange-500 focus:bg-white outline-none transition-all duration-300 font-bold text-primary appearance-none cursor-pointer text-sm"
                                            >
                                                <option value="" disabled>Choose a category...</option>
                                                <option value="Damaged Product">Damaged Product / Delivery</option>
                                                <option value="Wrong Item Received">Incorrect Artwork Delivered</option>
                                                <option value="Quality Not as Expected">Texture/Quality Discrepancy</option>
                                                <option value="Changed My Mind">No Longer Fits Interior Theme</option>
                                                <option value="Other">Other / Miscellaneous</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-orange-500">
                                                <FiRefreshCcw size={18} className="animate-spin-slow" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 p-8 rounded-[2rem] bg-primary text-white shadow-2xl shadow-gray-200">
                                        <div className="flex justify-between items-center opacity-80">
                                            <span className="text-[10px] font-black uppercase tracking-widest">Gross Refund</span>
                                            <span className="text-sm font-bold">₹{currentOrder.totalAmount}</span>
                                        </div>
                                        <div className="flex justify-between items-center opacity-80">
                                            <span className="text-[10px] font-black uppercase tracking-widest">Transaction Fee</span>
                                            <span className="text-sm font-bold">₹0.00</span>
                                        </div>
                                        <div className="flex justify-between items-center border-t border-white/20 pt-4 mt-2">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">Total Refund</span>
                                            <span className="text-3xl font-serif font-black italic tracking-tighter">₹{currentOrder.totalAmount}</span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !reason}
                                        className="w-full py-5 bg-orange-500 text-white rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-4 hover:bg-black hover:scale-[1.02] transition-all shadow-2xl shadow-orange-200 disabled:opacity-40 disabled:cursor-not-allowed group active:scale-95"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <FiCheckCircle size={20} className="group-hover:rotate-12 transition-transform" /> Initiate Return
                                            </>
                                        )}
                                    </button>

                                    <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100 flex items-start gap-4">
                                        <FiInfo className="text-orange-500 mt-1 flex-shrink-0" size={16} />
                                        <p className="text-[9px] text-muted font-bold leading-relaxed uppercase tracking-widest">
                                            Refunds are processed within <span className="text-orange-600">3-5 business days</span> after the pickup is verified.
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes spin-slow {
                    from { transform: translateY(-50%) rotate(0deg); }
                    to { transform: translateY(-50%) rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 12s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default OrderReturn;
