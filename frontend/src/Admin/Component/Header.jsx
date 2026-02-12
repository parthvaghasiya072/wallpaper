import React from 'react';
import {
    FiMenu,
    FiX,
    FiBell,
    FiSearch,
    FiMoon,
    FiSun
} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Header = ({ isSidebarOpen, setIsSidebarOpen, isMobile, isDark, toggleTheme }) => {
    const { user } = useSelector((state) => state.auth);

    return (
        <header className={`h-20 px-6 flex items-center justify-between z-30 shrink-0 transition-all duration-300 border-b ${isDark ? 'bg-[#0f172a]/80 border-slate-800' : 'bg-white/80 border-slate-200 shadow-sm shadow-black/[0.03]'
            } backdrop-blur-md`}>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className={`p-2 rounded-lg transition-all ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 shadow-sm border border-slate-200/50'
                        }`}
                >
                    {isSidebarOpen && !isMobile ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
                </button>

                <div className={`hidden md:flex items-center gap-3 px-4 py-2 rounded-xl border transition-all group focus-within:ring-2 focus-within:ring-indigo-500/10 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                    <FiSearch className={`${isDark ? 'text-slate-500' : 'text-slate-400'} group-focus-within:text-indigo-500 transition-colors`} />
                    <input
                        type="text"
                        placeholder="Quick search..."
                        className={`bg-transparent border-none outline-none text-sm w-64 ${isDark ? 'placeholder:text-slate-500 text-slate-200' : 'placeholder:text-slate-400 text-slate-700'
                            }`}
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                {/* Theme Switcher */}
                <button
                    onClick={toggleTheme}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${isDark
                            ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
                            : 'bg-white border-slate-200 text-indigo-600 hover:bg-slate-50 shadow-sm'
                        }`}
                >
                    {isDark ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
                </button>

                <button className={`relative w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm'
                    }`}>
                    <FiBell className="text-lg" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-inherit shadow-lg shadow-indigo-500/30" />
                </button>

                <div className={`h-8 w-px mx-1 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

                <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                    <div className="flex flex-col text-right hidden sm:flex">
                        <span className={`text-sm font-bold leading-tight ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                            {user?.firstName} {user?.lastName}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest leading-tight ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                            {user?.role}
                        </span>
                    </div>

                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-xs shadow-lg bg-gradient-to-tr from-indigo-600 to-purple-600`}>
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
