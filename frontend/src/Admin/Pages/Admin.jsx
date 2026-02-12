import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
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
    FiMoreVertical
} from 'react-icons/fi';

const Admin = () => {
    const { isDark } = useOutletContext();

    const stats = [
        { label: 'Total Revenue', value: '$12,840', change: '+12.5%', isPositive: true, icon: FiDollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Active Users', value: '1,240', change: '+2.4%', isPositive: true, icon: FiUsers, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Wallpaper Sales', value: '842', change: '-1.2%', isPositive: false, icon: FiImage, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { label: 'Growth Rate', value: '24.5%', change: '+4.3%', isPositive: true, icon: FiTrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    ];

    const recentActivities = [
        { id: 1, name: 'Cosmic Nebula', user: 'Alex J.', status: 'Sold', amount: '$24.00', time: '2m ago' },
        { id: 2, name: 'Zen Garden', user: 'Maria K.', status: 'Pending', amount: '$18.00', time: '15m ago' },
        { id: 3, name: 'Neon Cityscape', user: 'John D.', status: 'Refunded', amount: '$12.00', time: '1h ago' },
        { id: 4, name: 'Minimal Peak', user: 'Sarah L.', status: 'Sold', amount: '$15.00', time: '3h ago' },
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className={`text-2xl lg:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Dashboard Overview</h2>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} font-medium`}>Performance and activity trends for WallpaperHub.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all">
                    <FiPlus /> New Asset
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-2xl border transition-all ${isDark
                                ? 'bg-slate-800/40 border-slate-700/50 shadow-lg shadow-black/5'
                                : 'bg-white border-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-indigo-500/10'
                            }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="text-xl" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold ${stat.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {stat.isPositive ? <FiArrowUpRight /> : <FiArrowDownRight />}
                                {stat.change}
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{stat.label}</h3>
                            <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activities */}
                <div className={`lg:col-span-2 rounded-3xl border shadow-sm ${isDark ? 'bg-slate-800/40 border-slate-700/50 shadow-lg' : 'bg-white border-white shadow-[0_4px_25px_rgba(0,0,0,0.03)]'
                    } overflow-hidden`}>
                    <div className="px-6 py-5 border-b border-slate-800/10 flex items-center justify-between">
                        <h3 className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Latest Activity</h3>
                        <button className="text-sm font-bold text-indigo-600 hover:text-indigo-400 transition-colors">View Deep Dive</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                <tr>
                                    <th className="px-6 py-4">Wallpaper</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4 text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                {recentActivities.map((act) => (
                                    <tr key={act.id} className={`border-t border-slate-800/10 hover:bg-slate-400/5 transition-colors`}>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{act.name}</span>
                                                <span className="text-[10px] text-slate-500">{act.user}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${act.status === 'Sold' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    act.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' :
                                                        'bg-rose-500/10 text-rose-500'
                                                }`}>
                                                {act.status}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{act.amount}</td>
                                        <td className="px-6 py-4 text-right text-xs text-slate-500 italic">{act.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column Cards */}
                <div className="space-y-6">
                    <div className="p-8 rounded-3xl bg-indigo-600 text-white relative overflow-hidden group shadow-xl shadow-indigo-600/20">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold leading-tight">Artistic Insights</h3>
                            <p className="text-white/70 text-sm mt-3 leading-relaxed">Your wallpaper community grew by 15% this week. Great work!</p>
                            <button className="mt-6 px-5 py-2.5 bg-white text-indigo-600 font-bold text-sm rounded-xl hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-black/10">
                                View Full Analytics
                            </button>
                        </div>
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                    </div>

                    <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50 shadow-lg' : 'bg-white border-white shadow-[0_4px_25px_rgba(0,0,0,0.03)]'
                        }`}>
                        <div className="flex items-center justify-between mb-6 px-2">
                            <h3 className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Quick Flow</h3>
                            <FiActivity className="text-slate-500" />
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'Add Wallpaper', icon: FiPlus, color: 'text-indigo-500' },
                                { label: 'Analyze Users', icon: FiUsers, color: 'text-blue-500' },
                                { label: 'Engagement', icon: FiActivity, color: 'text-emerald-500' }
                            ].map(task => (
                                <button key={task.label} className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${isDark ? 'bg-slate-900/40 text-slate-400 hover:bg-slate-700 hover:text-white' : 'bg-slate-50/50 text-slate-700 hover:bg-white hover:text-indigo-600 hover:shadow-md'
                                    }`}>
                                    <task.icon className={task.color} />
                                    <span className="text-sm font-semibold">{task.label}</span>
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
