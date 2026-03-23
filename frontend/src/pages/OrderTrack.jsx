import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiTruck, FiArrowLeft, FiClock, FiMapPin, FiCheckCircle, FiPackage, FiInfo } from 'react-icons/fi';
import { trackOrder } from '../redux/slices/orderSlice';

const OrderTrack = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { trackingInfo, loading, error } = useSelector((state) => state.order);

    useEffect(() => {
        if (id) {
            dispatch(trackOrder(id));
        }
    }, [dispatch, id]);

    const getStatusColor = (status) => {
        const s = status?.toLowerCase();
        if (s?.includes('deliver')) return 'text-emerald-500 bg-emerald-50 border-emerald-100';
        if (s?.includes('ship')) return 'text-blue-500 bg-blue-50 border-blue-100';
        if (s?.includes('cancel')) return 'text-red-500 bg-red-50 border-red-100';
        return 'text-orange-500 bg-orange-50 border-orange-100';
    };

    const trackingData = trackingInfo?.success ? trackingInfo?.data?.tracking_data?.shipment_track?.[0] : null;
    const scans = trackingData?.scans || trackingInfo?.data?.tracking_data?.shipment_track_activities || [];

    return (
        <div className="min-h-screen bg-gray-50/50 pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <Link to="/profile" className="flex items-center gap-2 text-muted hover:text-primary transition-all font-bold group">
                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                            <FiArrowLeft size={20} />
                        </div>
                        Back to Orders
                    </Link>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">Tracking ID</p>
                        <h4 className="text-xl font-black text-primary italic uppercase tracking-tighter">#{id.slice(-8)}</h4>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-6" />
                        <p className="text-sm font-black uppercase tracking-widest text-orange-600/50 animate-pulse">Syncing with Carrier...</p>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-[3rem] p-12 text-center shadow-xl shadow-gray-200/50 border border-red-50">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <FiInfo size={40} />
                        </div>
                        <h3 className="text-2xl font-serif font-black text-primary mb-3 italic">Tracking Info Unavailable</h3>
                        <p className="text-muted max-w-sm mx-auto mb-8 font-medium leading-relaxed">{error}</p>
                        <p className="text-[10px] font-black uppercase text-orange-600/40 tracking-[0.2em] mb-8">Carrier Update Processing</p>
                        <Link to="/profile" className="px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl">Return to Profile</Link>
                    </div>
                ) : trackingData ? (
                    <div className="space-y-8">
                        {/* Main Status Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none -rotate-12 translate-x-12 -translate-y-8">
                                <FiTruck size={200} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                                <div>
                                    <div className={`w-fit px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest mb-6 ${getStatusColor(trackingData.current_status)}`}>
                                        {trackingData.current_status}
                                    </div>
                                    <h2 className="text-4xl font-black text-primary italic font-serif leading-tight mb-4 tracking-tighter">
                                        Your masterpiece is {trackingData.current_status?.toLowerCase().includes('deliver') ? 'Delivered' : 'on its way'}!
                                    </h2>
                                    <p className="text-muted font-medium mb-8 leading-relaxed">
                                        Estimated delivery by <span className="text-primary font-bold">{trackingData.expected_date || 'TBD'}</span>
                                    </p>

                                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-50">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">Carrier</p>
                                            <p className="text-sm font-black text-primary uppercase tracking-tight">{trackingData.courier_name || 'Shiprocket'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">AWB Number</p>
                                            <p className="text-sm font-black text-primary uppercase tracking-tight">{trackingData.awb_code}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted italic">Tracking Milestones</p>
                                    <div className="space-y-0 relative">
                                        {scans.length > 0 ? scans.map((scan, idx) => (
                                            <div key={idx} className="flex gap-6 relative pb-10 group last:pb-0">
                                                {idx !== scans.length - 1 && (
                                                    <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-gray-100 group-hover:bg-orange-100 transition-colors" />
                                                )}
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center relative z-10 transition-transform group-hover:scale-110 ${idx === 0 ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-gray-100 text-muted'}`}>
                                                    {idx === 0 ? <FiCheckCircle size={14} /> : <div className="w-2 h-2 rounded-full bg-muted/40" />}
                                                </div>
                                                <div>
                                                    <p className={`text-xs font-black uppercase tracking-wide mb-1 ${idx === 0 ? 'text-primary' : 'text-muted'}`}>{scan.status}</p>
                                                    <p className="text-[10px] text-muted font-bold flex items-center gap-2 mb-2 italic">
                                                        <FiMapPin size={10} className="text-orange-400" /> {scan.location}
                                                    </p>
                                                    <p className="text-[10px] text-muted/60 font-black uppercase tracking-widest flex items-center gap-2">
                                                        <FiClock size={10} /> {scan.date}
                                                    </p>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="py-8 text-center text-muted italic font-medium">
                                                Awaiting carrier synchronization...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Additional Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shadow-inner">
                                    <FiPackage size={24} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase text-muted tracking-widest">Shipment Status</p>
                                    <p className="text-xs font-bold text-primary italic uppercase">{trackingData.current_status}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 md:col-span-2">
                                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shadow-inner shrink-0">
                                    <FiInfo size={24} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase text-muted tracking-widest">Courier Message</p>
                                    <p className="text-xs font-bold text-primary italic">Detailed tracking can take up to 24-48 hours to update after dispatch.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] p-12 text-center shadow-xl shadow-gray-200/50 border border-gray-100">
                        <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <FiPackage size={40} />
                        </div>
                        <h3 className="text-2xl font-serif font-black text-primary mb-3 italic">Processing Your Request</h3>
                        <p className="text-muted max-w-sm mx-auto mb-8 font-medium leading-relaxed">We're retrieving the latest tracking data from our curators. Please bear with us.</p>
                        <button onClick={() => window.location.reload()} className="px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl">Refresh Tracking</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTrack;
