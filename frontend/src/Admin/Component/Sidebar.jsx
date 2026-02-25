import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FiHome,
    FiImage,
    FiGrid,
    FiUsers,
    FiSettings,
    FiLogOut,
    FiActivity,
    FiPackage
} from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, isMobile, isDark }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { icon: FiHome, label: 'Dashboard', path: '/admin' },
        { icon: FiImage, label: 'Products', path: '/admin/products' },
        { icon: FiGrid, label: 'Categories', path: '/admin/category' },
        { icon: FiUsers, label: 'Users', path: '/admin/users' },
        { icon: FiActivity, label: 'Sales', path: '/admin/sales' },
        {
            icon: FiSettings,
            label: 'Home',
            path: '/admin/home',
            submenu: [
                { label: 'Hero Section', path: '/admin/home/hero' },
                { label: 'Tags', path: '/admin/home/tags' },
                { label: 'Banner', path: '/admin/home/banner' }
            ]
        },
    ];

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const [expandedMenu, setExpandedMenu] = React.useState(null);

    const toggleSubmenu = (label) => {
        setExpandedMenu(expandedMenu === label ? null : label);
    };

    return (
        <>
            <AnimatePresence>
                {isMobile && isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`fixed inset-0 z-40 lg:hidden ${isDark ? 'bg-slate-900/40' : 'bg-slate-400/20'} backdrop-blur-sm`}
                    />
                )}
            </AnimatePresence>

            <motion.aside
                initial={false}
                animate={{
                    width: isSidebarOpen ? (isMobile ? '280px' : '260px') : '0px',
                    x: isMobile && !isSidebarOpen ? -280 : 0
                }}
                className={`fixed lg:relative z-50 h-screen transition-all duration-300 ${isDark
                    ? 'bg-[#1e293b] border-r border-slate-800'
                    : 'bg-white border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)]'
                    } flex flex-col overflow-hidden`}
            >
                {/* Branding */}
                <div className="h-20 flex items-center px-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                            <FiPackage className="text-white text-lg" />
                        </div>
                        <AnimatePresence>
                            {isSidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`font-bold text-xl tracking-tight title-font ${isDark ? 'text-white' : 'text-slate-900'}`}
                                >
                                    Wallpaper<span className="text-indigo-600">Hub</span>
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.submenu && item.submenu.some(sub => location.pathname === sub.path));
                        const isExpanded = expandedMenu === item.label;

                        return (
                            <div key={item.label}>
                                <button
                                    onClick={() => {
                                        if (item.submenu) {
                                            toggleSubmenu(item.label);
                                            navigate(item.path); // Navigate to parent path as well
                                        } else {
                                            navigate(item.path);
                                            if (isMobile) setIsSidebarOpen(false);
                                        }
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive && !item.submenu
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                        : (isDark ? 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-indigo-600 hover:shadow-sm')
                                        }`}
                                >
                                    <item.icon className={`text-lg shrink-0 ${isActive && !item.submenu ? 'text-white' : 'group-hover:text-indigo-600 transition-colors'}`} />
                                    <AnimatePresence initial={false}>
                                        {isSidebarOpen && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="font-semibold text-sm whitespace-nowrap flex-1 text-left"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </button>

                                {/* Submenu */}
                                <AnimatePresence>
                                    {item.submenu && isExpanded && isSidebarOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden ml-6 space-y-1 relative"
                                        >
                                            {/* Connector Line */}
                                            <div className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

                                            {item.submenu.map((subItem) => (
                                                <button
                                                    key={subItem.label}
                                                    onClick={() => {
                                                        navigate(subItem.path);
                                                        if (isMobile) setIsSidebarOpen(false);
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold  tracking-wider rounded-xl transition-all relative ml-3 ${location.pathname === subItem.path
                                                        ? 'text-indigo-600 bg-indigo-50/50'
                                                        : (isDark ? 'text-slate-500 hover:text-indigo-400' : 'text-slate-400 hover:text-indigo-600')
                                                        }`}
                                                >
                                                    {location.pathname === subItem.path && (
                                                        <motion.div
                                                            layoutId="activeSubIndicator"
                                                            className="absolute left-[-13px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-600"
                                                        />
                                                    )}
                                                    {subItem.label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800/10">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isDark
                            ? 'text-slate-400 hover:bg-rose-500/10 hover:text-rose-400'
                            : 'text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:shadow-sm border border-transparent hover:border-rose-100'
                            }`}
                    >
                        <FiLogOut className="text-lg group-hover:-translate-x-1 transition-transform" />
                        {isSidebarOpen && <span className="font-bold text-sm">Sign Out</span>}
                    </button>
                </div>
            </motion.aside>
        </>
    );
};

export default Sidebar;