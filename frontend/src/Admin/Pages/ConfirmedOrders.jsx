import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPackage, FiUser, FiMapPin, FiCheckCircle, FiTrash2, FiClock, FiShoppingBag, FiTruck, FiCreditCard, FiPrinter } from 'react-icons/fi';
import { useOutletContext, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import CommonTable from '../Component/CommonTable';
import CommonViewModal from '../Component/CommonViewModal';

const ConfirmedOrders = () => {
    const { isDark } = useOutletContext();
    const { status } = useParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchConfirmedOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                console.warn("No token found for confirmed orders fetch");
                return;
            }

            const res = await axios.get('http://localhost:5000/api/admin/getAllConfirmedOrders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.data.success) {
                setOrders(res.data.orders);
            }
        } catch (error) {
            console.error("Fetch Confirmed Orders Error:", error);
            toast.error("Failed to load confirmed orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfirmedOrders();
    }, []);

    const columns = [
        {
            header: "Preview",
            accessor: "items",
            render: (item) => {
                const firstImage = item.items?.[0]?.image;
                return (
                    <div className="w-12 h-12 rounded-2xl border border-slate-500/10 overflow-hidden bg-slate-800/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        {firstImage ? (
                            <img
                                src={firstImage.startsWith('http') ? firstImage : `http://localhost:5000${firstImage}`}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <FiPackage className="opacity-20" size={16} />
                        )}
                    </div>
                );
            }
        },
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
            header: "Customer",
            accessor: "customerName",
            searchKey: (item) => item.userId?.fullName || item.shippingAddress?.fullName,
            render: (item) => (
                <div className="flex flex-col">
                    <span className="font-bold text-sm tracking-tight">{item.userId?.fullName || item.shippingAddress?.fullName}</span>
                    <span className="text-[10px] opacity-50 font-medium">{item.userId?.email || item.shippingAddress?.mobileNo}</span>
                </div>
            )
        },
        {
            header: "Placed Date",
            accessor: "createdAt",
            render: (item) => (
                <div className="flex flex-col">
                    <span className="font-bold text-sm tracking-tight">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-[10px] opacity-50 font-medium">
                        {new Date(item.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            )
        },
        {
            header: "Amount",
            accessor: "totalAmount",
            render: (item) => (
                <span className="font-black text-indigo-600">₹{item.totalAmount}</span>
            )
        },
        {
            header: "Protocol",
            accessor: "paymentMethod",
            render: (item) => (
                <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${item.paymentMethod === 'COD' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {item.paymentMethod === 'COD' ? <FiTruck size={12} /> : <FiCreditCard size={12} />}
                    {item.paymentMethod}
                </div>
            )
        },
        {
            header: "Payment",
            accessor: "paymentStatus",
            render: (item) => (
                <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${item.paymentStatus === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    <FiCheckCircle size={12} />
                    {item.paymentStatus}
                </div>
            )
        },
        {
            header: "Status",
            accessor: "orderStatus",
            render: (item) => {
                let statusColor = "bg-gray-500/10 text-gray-500";
                if (item.orderStatus === 'Processing') statusColor = "bg-blue-500/10 text-blue-500";
                if (item.orderStatus === 'Shipped') statusColor = "bg-orange-500/10 text-orange-500";
                if (item.orderStatus === 'Delivered') statusColor = "bg-emerald-500/10 text-emerald-500";

                return (
                    <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${statusColor}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {item.orderStatus || 'Pending'}
                    </div>
                )
            }
        }
    ];

    const handleView = (order) => {
        setSelectedOrder(order);
        setIsViewModalOpen(true);
    };

    const filteredOrders = orders.filter(order => {
        if (!status || status === 'all') return true;
        const lowerStatus = status.toLowerCase();

        // Handle variations in status strings
        if (lowerStatus === 'pending') {
            return order.orderStatus?.toLowerCase() === 'pending' || order.paymentStatus?.toLowerCase() === 'pending';
        }
        if (lowerStatus === 'shipping' || lowerStatus === 'shipped') {
            return order.orderStatus?.toLowerCase() === 'shipped' || order.orderStatus?.toLowerCase() === 'shipping';
        }
        return order.orderStatus?.toLowerCase() === lowerStatus;
    });

    const getPageTitle = () => {
        if (!status || status === 'all') return 'All Orders';
        return status.charAt(0).toUpperCase() + status.slice(1) + ' Orders';
    };

    return (
        <div className="space-y-8 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className={`text-4xl font-black tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'} capitalize`}>
                        {getPageTitle()}
                    </h1>
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Oversee {status === 'all' ? 'all' : status} transactions and delivery logistics
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`w-10 h-10 rounded-full border-4 ${isDark ? 'border-slate-900 bg-slate-800' : 'border-white bg-slate-100'} flex items-center justify-center`}>
                                <FiUser size={14} className="opacity-20" />
                            </div>
                        ))}
                        <div className={`w-10 h-10 rounded-full border-4 ${isDark ? 'border-slate-900 bg-indigo-500' : 'border-white bg-indigo-600'} flex items-center justify-center text-[10px] font-black text-white`}>
                            +{filteredOrders.length}
                        </div>
                    </div>
                </div>
            </div>

            <CommonTable
                columns={columns}
                data={filteredOrders}
                onView={handleView}
                isDark={isDark}
                searchPlaceholder="Search by ID or customer..."
                loading={loading}
            />

            <CommonViewModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                isDark={isDark}
                title={`Order Details`}
                subtitle={`#${selectedOrder?._id.slice(-8).toUpperCase()}`}
                description="Review shipment details and items purchased in this transaction."
                images={selectedOrder?.items?.map(item => item.image) || []}
                tags={[
                    { label: selectedOrder?.paymentStatus, className: selectedOrder?.paymentStatus === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
                    { label: selectedOrder?.paymentMethod, className: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' }
                ]}
                stats={[
                    { label: 'Total Paid', value: `₹${selectedOrder?.totalAmount}`, icon: FiCreditCard, color: 'text-indigo-500' },
                    { label: 'Items', value: selectedOrder?.items?.length, icon: FiShoppingBag, color: 'text-emerald-500' },
                    { label: 'Date', value: selectedOrder ? new Date(selectedOrder.createdAt).toLocaleDateString() : '', icon: FiClock, color: 'text-amber-500' },
                    { label: 'Method', value: selectedOrder?.paymentMethod, icon: FiTruck, color: 'text-purple-500' }
                ]}
            >
                {selectedOrder && (
                    <div id="print-area" className="space-y-6">
                        {/* <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Transaction Overview</h4>
                            <button
                                onClick={() => window.print()}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-50 text-slate-500 hover:text-indigo-600'}`}
                            >
                                <FiPrinter size={14} /> Print Invoice
                            </button>
                        </div> */}
                        {/* <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Products Portfolio</h4>
                            <div className="grid gap-3">
                                {selectedOrder.items.map((item, idx) => (
                                    <div key={idx} className={`flex items-center gap-4 p-4 rounded-[2rem] border ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                                        <img src={item.image?.startsWith('http') ? item.image : `http://localhost:5000${item.image}`} className="w-16 h-16 rounded-2xl object-cover shadow-2xl" alt="" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-sm truncate">{item.titleName}</p>
                                            <p className="text-[10px] font-bold uppercase opacity-50 mt-1">{item.paperMaterial?.paperType} • {item.size?.width}x{item.size?.height} {item.size?.unit}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black">x{item.quantity}</p>
                                            <p className="text-sm font-black text-indigo-500 mt-1">₹{item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div> */}

                        {/* Customer & Shipping */}
                        <div className="space-y-6 pt-6 border-t border-dashed border-slate-500/20">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 flex items-center gap-2">
                                        <FiUser size={12} /> Customer Identity
                                    </h4>
                                    <div className={`p-5 rounded-[2rem] border ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                                        <p className="font-black text-sm">{selectedOrder.shippingAddress?.fullName}</p>
                                        <p className="text-[11px] font-bold opacity-50 mt-1 text-indigo-500">{selectedOrder.userId?.email || 'Guest User'}</p>
                                        <p className="text-[11px] font-bold opacity-50 mt-0.5">{selectedOrder.shippingAddress?.mobileNo}</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 flex items-center gap-2">
                                        <FiMapPin size={12} /> Logistic Node
                                    </h4>
                                    <div className={`p-5 rounded-[2rem] border ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                                        <p className="text-[11px] font-bold leading-relaxed">{selectedOrder.shippingAddress?.addressLine}</p>
                                        <p className="text-[11px] font-black uppercase tracking-widest opacity-40 mt-2">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CommonViewModal>
        </div>
    );
};

export default ConfirmedOrders;
