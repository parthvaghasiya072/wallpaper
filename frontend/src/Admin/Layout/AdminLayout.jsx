import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../Component/Sidebar';
import Header from '../Component/Header';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [isDark, setIsDark] = useState(localStorage.getItem('adminTheme') !== 'light');
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (window.innerWidth >= 1024) setIsSidebarOpen(true);
            else setIsSidebarOpen(false);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleTheme = () => {
        const nextTheme = !isDark;
        setIsDark(nextTheme);
        localStorage.setItem('adminTheme', nextTheme ? 'dark' : 'light');
    };

    return (
        <div className={`transition-colors duration-500 ease-in-out font-sans selection:bg-indigo-500/30 ${isDark ? 'bg-[#0f172a] text-slate-200' : 'bg-[#f4f6f9] text-slate-700'
            }`}>
            {/* Background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.03] ${isDark ? 'bg-indigo-500' : 'bg-slate-300'
                    }`} />
            </div>

            <div className="relative z-10 flex h-screen overflow-hidden">
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    isMobile={isMobile}
                    isDark={isDark}
                />

                <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                    <Header
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                        isMobile={isMobile}
                        isDark={isDark}
                        toggleTheme={toggleTheme}
                    />

                    <main className={`flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 ${isDark ? 'bg-transparent' : 'bg-gray-200'
                        }`}>
                        <div className="max-w-[1600px] mx-auto">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={location.pathname}
                                    initial={{ opacity: 0, scale: 0.99 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.01 }}
                                    transition={{
                                        duration: 0.4,
                                        ease: [0.25, 1, 0.5, 1]
                                    }}
                                >
                                    <Outlet context={{ isDark }} />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </main>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
                
                :root {
                    font-family: 'Inter', sans-serif;
                }

                .title-font {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)'};
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'};
                }
            `}</style>
        </div>
    );
};

export default AdminLayout;
