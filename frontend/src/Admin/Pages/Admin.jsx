import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Chart from 'react-apexcharts';
import {
    FiTrendingUp,
    FiImage,
    FiUsers,
    FiDollarSign,
    FiActivity,
    FiArrowUpRight,
    FiArrowDownRight,
    FiEye,
    FiPlus,
    FiMoreVertical,
    FiGrid,
    FiShoppingBag,
    FiClock,
    FiPackage
} from 'react-icons/fi';

import CommonTable from '../Component/CommonTable';

const Admin = () => {
    const { isDark } = useOutletContext();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalUsers: 0,
        totalProducts: 0,
        totalSales: 0,
        revenueChange: '+0%',
        usersChange: '+0%',
        productsChange: '+0%',
        salesChange: '+0%'
    });

    const [chartData, setChartData] = useState({
        revenueSeries: [{ name: 'Revenue', data: [] }],
        revenueOptions: {
            chart: {
                id: 'revenue-chart',
                type: 'area',
                toolbar: { show: false },
                sparkline: { enabled: false },
            },
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth', width: 3 },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.45,
                    opacityTo: 0.05,
                    stops: [20, 100, 100]
                }
            },
            xaxis: {
                categories: [],
                labels: {
                    style: { colors: isDark ? '#94a3b8' : '#64748b', fontWeight: 600 }
                },
                axisBorder: { show: false },
                axisTicks: { show: false }
            },
            yaxis: {
                labels: {
                    style: { colors: isDark ? '#94a3b8' : '#64748b', fontWeight: 600 }
                }
            },
            grid: {
                borderColor: isDark ? '#334155' : '#e2e8f0',
                strokeDashArray: 4,
                padding: { left: 20, right: 20 }
            },
            colors: ['#4f46e5'],
            tooltip: { theme: isDark ? 'dark' : 'light' }
        },
        categorySeries: [],
        categoryOptions: {
            labels: [],
            chart: { type: 'donut' },
            colors: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
            legend: {
                position: 'bottom',
                labels: { colors: isDark ? '#94a3b8' : '#64748b' }
            },
            dataLabels: { enabled: false },
            stroke: { show: false },
            plotOptions: {
                pie: {
                    donut: {
                        size: '75%',
                        labels: {
                            show: true,
                            name: { show: true, fontSize: '12px', fontWeight: 700, color: isDark ? '#fff' : '#1e293b' },
                            value: { show: true, fontSize: '20px', fontWeight: 800, color: isDark ? '#indigo-400' : '#4f46e5' }
                        }
                    }
                }
            }
        }
    });

    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [ordersRes, productsRes, usersRes, categoriesRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/getAllConfirmedOrders', config),
                axios.get('http://localhost:5000/api/getAllProducts'),
                axios.get('http://localhost:5000/api/getAllUsers', config),
                axios.get('http://localhost:5000/api/getAllCategory')
            ]);

            const orders = ordersRes.data.orders || [];
            const products = productsRes.data.products || [];
            const users = usersRes.data.data || [];
            const categories = categoriesRes.data.categories || [];

            // Calculate Stats
            const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
            const totalSales = orders.length;
            const totalProducts = products.length;
            const totalUsers = users.length;

            setStats({
                totalRevenue: `₹${totalRevenue.toLocaleString()}`,
                totalUsers: totalUsers.toLocaleString(),
                totalProducts: totalProducts.toLocaleString(),
                totalSales: totalSales.toLocaleString(),
                revenueChange: '+12.5%', // Placeholder for now
                usersChange: '+2.4%',
                productsChange: '+5.1%',
                salesChange: '+8.2%'
            });

            // Process Chart Data (Revenue by Date)
            const revenueMap = {};
            orders.slice().reverse().forEach(order => {
                const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
                revenueMap[date] = (revenueMap[date] || 0) + order.totalAmount;
            });

            const revDates = Object.keys(revenueMap).slice(-7);
            const revValues = revDates.map(d => revenueMap[d]);

            // Process Category Distribution
            const catMap = {};
            products.forEach(p => {
                catMap[p.category] = (catMap[p.category] || 0) + 1;
            });
            const catLabels = Object.keys(catMap);
            const catValues = catLabels.map(c => catMap[c]);

            setChartData(prev => ({
                ...prev,
                revenueSeries: [{ name: 'Revenue', data: revValues }],
                revenueOptions: { ...prev.revenueOptions, xaxis: { ...prev.revenueOptions.xaxis, categories: revDates } },
                categorySeries: catValues,
                categoryOptions: { ...prev.categoryOptions, labels: catLabels }
            }));

            // Process Recent Activities
            const activities = orders.slice(0, 5).map(o => ({
                id: o._id,
                name: o.items[0]?.titleName || 'Artwork',
                user: o.shippingAddress?.fullName || 'Guest',
                status: 'Confirmed',
                amount: `₹${o.totalAmount}`,
                time: new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
            setRecentActivities(activities);

        } catch (error) {
            console.error("Dashboard Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const statCards = [
        { label: 'Total Revenue', value: stats.totalRevenue, change: stats.revenueChange, isPositive: true, icon: FiDollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Active Users', value: stats.totalUsers, change: stats.usersChange, isPositive: true, icon: FiUsers, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Artworks', value: stats.totalProducts, change: stats.productsChange, isPositive: true, icon: FiImage, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { label: 'Total Sales', value: stats.totalSales, change: stats.salesChange, isPositive: true, icon: FiTrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    ];

    const activityColumns = [
        {
            header: 'Product',
            accessor: 'name',
            render: (item) => (
                <div className="flex flex-col">
                    <span className={`font-bold text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{item.name}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">{item.user}</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (item) => (
                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500`}>
                    {item.status}
                </span>
            )
        },
        {
            header: 'Investment',
            accessor: 'amount',
            render: (item) => <span className={`font-black text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{item.amount}</span>
        },
        {
            header: 'Sync Time',
            accessor: 'time',
            render: (item) => <span className="text-[10px] font-bold text-slate-500 tracking-tighter uppercase">{item.time}</span>
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="sm:items-center justify-between gap-6">
                <div>
                    <h2 className={`text-4xl font-black tracking-tight font-serif  ${isDark ? 'text-white' : 'text-slate-900'}`}>Dashboard</h2>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} font-medium mt-1`}>Real-time performance metrics and archival trends.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-lg border transition-all relative overflow-hidden group ${isDark
                            ? 'bg-slate-800/40 border-slate-700/50 shadow-2xl'
                            : 'bg-white border-white shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-indigo-500/5'
                            }`}
                    >
                        <div className="flex items-start justify-between relative z-10">
                            <div className={`p-4 rounded-lg ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                                <stat.icon size={24} />
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${stat.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {stat.isPositive ? <FiArrowUpRight /> : <FiArrowDownRight />}
                                {stat.change}
                            </div>
                        </div>
                        <div className="mt-6 relative z-10">
                            <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{stat.label}</h3>
                            <p className={`text-3xl font-black mt-1 tracking-tighter ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                                {loading ? <span className="opacity-20">---</span> : stat.value}
                            </p>
                        </div>
                        {/* Decorative background element */}
                        <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full ${stat.bg} opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-700`} />
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className={`lg:col-span-2 p-8 rounded-lg border ${isDark ? 'bg-slate-800/40 border-slate-700/50 shadow-2xl' : 'bg-white border-white shadow-[0_20px_50px_rgba(0,0,0,0.02)]'}`}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className={`font-black text-sm uppercase tracking-[0.2em] ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Revenue Trajectory</h3>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Archival Financial Performance</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Live Feedback</span>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        {loading ? (
                            <div className="h-full w-full flex items-center justify-center">
                                <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                            </div>
                        ) : (
                            <Chart
                                options={chartData.revenueOptions}
                                series={chartData.revenueSeries}
                                type="area"
                                height="100%"
                            />
                        )}
                    </div>
                </div>

                {/* Category Distribution */}
                <div className={`p-8 rounded-lg border ${isDark ? 'bg-slate-800/40 border-slate-700/50 shadow-2xl' : 'bg-white border-white shadow-[0_20px_50px_rgba(0,0,0,0.02)]'}`}>
                    <h3 className={`font-black text-sm uppercase tracking-[0.2em] mb-8 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Portfolio Density</h3>
                    <div className="h-[300px] flex items-center justify-center">
                        {loading ? (
                            <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                        ) : (
                            <Chart
                                options={chartData.categoryOptions}
                                series={chartData.categorySeries}
                                type="donut"
                                width="100%"
                            />
                        )}
                    </div>
                    <div className="mt-6 pt-6 border-t border-dashed border-slate-500/20">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <span>Top Category</span>
                            <span className="text-indigo-500">{chartData.categoryOptions.labels[0] || '---'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Activity Table */}
                <div className={`lg:col-span-8 rounded-lg border overflow-hidden ${isDark ? 'bg-slate-800/40 border-slate-700/50 shadow-2xl' : 'bg-white border-white shadow-[0_20px_50px_rgba(0,0,0,0.02)]'}`}>
                    <div className="px-10 py-8 border-b border-dashed border-slate-500/20 flex items-center justify-between">
                        <div>
                            <h3 className={`font-black text-sm uppercase tracking-[0.2em] ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Operational Registry</h3>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Confirmed Acquisition Logs</p>
                        </div>
                        <button
                            onClick={() => navigate('/admin/confirmed-orders')}
                            className="text-[10px] font-black text-indigo-500 hover:text-indigo-400 transition-colors uppercase tracking-[0.2em] border-b border-indigo-500/20 pb-1"
                        >
                            Full Manifesto
                        </button>
                    </div>
                    <div className="p-6">
                        <CommonTable
                            columns={activityColumns}
                            data={recentActivities}
                            isDark={isDark}
                            showSearch={false}
                            showPagination={false}
                            loading={loading}
                        />
                    </div>
                </div>

                {/* Quick Actions & AI Insight */}
                <div className="lg:col-span-4 space-y-8">
                    {/* <div className="p-8 rounded-[3rem] bg-indigo-600 text-white relative overflow-hidden group shadow-2xl shadow-indigo-600/40">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                                    <FiActivity size={20} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">System Insight</span>
                            </div>
                            <h3 className="text-2xl font-black font-serif italic tracking-tight italic">Archival Projection</h3>
                            <p className="text-white/70 text-xs mt-4 leading-relaxed font-medium">The collection velocity has increased by 18% in the last 72 hours. High engagement detected in Abstract categories.</p>
                            <button
                                onClick={() => navigate('/admin/sales')}
                                className="mt-8 w-full py-4 bg-white text-indigo-600 font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl hover:bg-slate-900 hover:text-white transition-all active:scale-95 shadow-xl shadow-black/10"
                            >
                                Deep Dive Meta
                            </button>
                        </div>
                        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-1000" />
                    </div> */}

                    <div className={`p-8 rounded-lg border ${isDark ? 'bg-slate-800/40 border-slate-700/50 shadow-2xl' : 'bg-white border-white shadow-[0_20px_50px_rgba(0,0,0,0.02)]'}`}>
                        <div className="flex items-center justify-between mb-8 px-2">
                            <h3 className={`font-black text-sm uppercase tracking-[0.2em] ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Rapid Nodes</h3>
                            <FiActivity className="text-slate-500" />
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'Register Artwork', icon: FiPlus, color: 'text-indigo-500', path: '/admin/products' },
                                { label: 'Analyze Collectors', icon: FiUsers, color: 'text-blue-500', path: '/admin/users' },
                                { label: 'Logistics Vault', icon: FiPackage, color: 'text-emerald-500', path: '/admin/confirmed-orders' }
                            ].map(task => (
                                <button
                                    key={task.label}
                                    onClick={() => navigate(task.path)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border border-transparent ${isDark ? 'bg-slate-900/40 text-slate-400 hover:bg-slate-800 hover:text-white hover:border-slate-700' : 'bg-slate-50/50 text-slate-700 hover:bg-white hover:text-indigo-600 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-slate-100'
                                        }`}
                                >
                                    <div className={`p-2 rounded-xl bg-white shadow-sm border border-gray-100 ${task.color}`}>
                                        <task.icon size={18} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{task.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
