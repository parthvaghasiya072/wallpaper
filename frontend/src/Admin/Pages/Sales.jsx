import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
    FiActivity,
    FiTruck,
    FiCreditCard,
    FiCheckCircle,
    FiPackage,
    FiEye,
    FiFilter,
    FiUser,
    FiDownload
} from 'react-icons/fi';
import { useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';
import CommonTable from '../Component/CommonTable';
import CommonViewModal from '../Component/CommonViewModal';

const Sales = () => {
    const { isDark } = useOutletContext();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentFilter, setPaymentFilter] = useState('All');
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchSalesArchive = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/admin/getAllConfirmedOrders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.data.success) {
                setOrders(res.data.orders || []);
            }
        } catch (error) {
            console.error("Sales Repository Fetch Error:", error);
            toast.error("Failed to synchronize sales data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalesArchive();
    }, []);

    const filteredOrders = useMemo(() => {
        if (paymentFilter === 'All') return orders;
        if (paymentFilter === 'COD') return orders.filter(o => o.paymentMethod === 'COD');
        if (paymentFilter === 'Digital') return orders.filter(o => o.paymentMethod !== 'COD');
        return orders;
    }, [orders, paymentFilter]);

    const stats = useMemo(() => {
        const total = filteredOrders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
        const cod = filteredOrders.filter(o => o.paymentMethod === 'COD').length;
        const digital = filteredOrders.filter(o => o.paymentMethod !== 'COD').length;

        return [
            { label: 'Cumulative Revenue', value: `₹${total.toLocaleString('en-IN')}`, icon: FiActivity, color: 'text-indigo-500' },
            { label: 'COD Protocol', value: cod, icon: FiTruck, color: 'text-amber-500' },
            { label: 'Digital Protocol', value: digital, icon: FiCreditCard, color: 'text-emerald-500' },
            { label: 'Transactions', value: filteredOrders.length, icon: FiPackage, color: 'text-purple-500' }
        ];
    }, [filteredOrders]);

    const columns = [
        {
            header: "Order ID",
            accessor: "_id",
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <FiPackage size={14} />
                    </div>
                    <span className="font-black text-xs">#{item._id.slice(-8).toUpperCase()}</span>
                </div>
            )
        },
        {
            header: "Collector",
            accessor: "userId",
            render: (item) => (
                <div className="flex flex-col">
                    <span className="font-bold text-sm tracking-tight">{item.shippingAddress?.fullName}</span>
                    <span className="text-[10px] opacity-50 font-medium uppercase tracking-wider">{item.userId?.email || 'Guest'}</span>
                </div>
            )
        },
        {
            header: "Payment",
            accessor: "paymentMethod",
            render: (item) => (
                <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${item.paymentMethod === 'COD' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {item.paymentMethod === 'COD' ? <FiTruck size={12} /> : <FiCreditCard size={12} />}
                    {item.paymentMethod === 'COD' ? 'COD' : 'Digital'}
                </div>
            )
        },
        {
            header: "Value",
            accessor: "totalAmount",
            render: (item) => <span className="font-black text-sm tabular-nums">₹{item.totalAmount.toLocaleString('en-IN')}</span>
        },
        {
            header: "Status",
            accessor: "paymentStatus",
            render: (item) => (
                <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${item.paymentStatus === 'Completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${item.paymentStatus === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    {item.paymentStatus}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className={`text-4xl font-black tracking-tight mb-1 font-serif ${isDark ? 'text-white' : 'text-slate-900'}`}>Sales Distribution</h1>
                    <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Archival Payment Analytics & Registry</p>
                </div>
                <button
                    onClick={() => toast.success("Exporting sales manifest...")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white' : 'bg-white text-slate-900 border border-slate-200 hover:shadow-xl'}`}
                >
                    <FiDownload size={14} /> Export Manifest
                </button>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className={`p-6 rounded-lg border transition-all ${isDark ? 'bg-slate-800/40 border-slate-700 shadow-2xl' : 'bg-white border-white shadow-[0_20px_50px_rgba(0,0,0,0.02)]'}`}>
                        <div className="flex items-center justify-between">
                            <div className={`p-3 rounded-xl bg-slate-500/5 ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-30">{stat.label}</span>
                        </div>
                        <p className={`text-2xl font-black mt-4 tracking-tighter ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{loading ? '---' : stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Payment Filter Bar */}
            <div className={`p-2 rounded-lg flex items-center gap-2 w-fit ${isDark ? 'bg-slate-950/40 border border-slate-800' : 'bg-slate-100/50 border border-slate-200'}`}>
                {['All', 'COD', 'Digital'].map(type => (
                    <button
                        key={type}
                        onClick={() => setPaymentFilter(type)}
                        className={`px-8 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${paymentFilter === type
                            ? (isDark ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 text-white shadow-lg')
                            : (isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')
                            }`}
                    >
                        {type} Payment
                    </button>
                ))}
            </div>

            {/* Registry Table */}
            <CommonTable
                columns={columns}
                data={filteredOrders}
                isDark={isDark}
                loading={loading}
                onView={(order) => { setSelectedOrder(order); setIsViewModalOpen(true); }}
                searchPlaceholder="Search Collector Identity or Order ID..."
            />

            {/* Details Modal */}
            <CommonViewModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                isDark={isDark}
                title="Transaction Deep Dive"
                subtitle={`Registry #${selectedOrder?._id.slice(-8).toUpperCase()}`}
                description="Comprehensive view of order logistics and payment distribution."
                images={selectedOrder?.items?.map(it => it.image) || []}
                stats={[
                    { label: 'Gross Value', value: `₹${selectedOrder?.totalAmount}`, icon: FiActivity, color: 'text-indigo-500' },
                    { label: 'Protocol', value: selectedOrder?.paymentMethod, icon: FiCreditCard, color: 'text-emerald-500' },
                    { label: 'Status', value: selectedOrder?.paymentStatus, icon: FiCheckCircle, color: 'text-amber-500' },
                    { label: 'Collector', value: selectedOrder?.shippingAddress?.fullName?.split(' ')[0], icon: FiUser, color: 'text-purple-500' }
                ]}
            >
                {selectedOrder && (
                    <div className="space-y-6 pt-6 border-t border-dashed border-slate-500/20">
                        <div className="grid grid-cols-2 gap-4">
                            <div className={`p-5 rounded-2xl ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-slate-50 border border-slate-100'}`}>
                                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-2">Shipment Node</h4>
                                <p className="text-[11px] font-bold leading-relaxed">{selectedOrder.shippingAddress?.addressLine}</p>
                                <p className="text-[9px] mt-1 opacity-50 uppercase font-black">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                            </div>
                            <div className={`p-5 rounded-2xl ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-slate-50 border border-slate-100'}`}>
                                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-2">Temporal Matrix</h4>
                                <p className="text-[11px] font-bold uppercase">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                                <p className="text-[9px] mt-1 opacity-50 uppercase font-black">{new Date(selectedOrder.createdAt).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    </div>
                )}
            </CommonViewModal>
        </div>
    );
};

export default Sales;
