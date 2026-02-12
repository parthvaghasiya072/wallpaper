import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiSearch,
    FiEdit3,
    FiEye,
    FiTrash2,
    FiChevronLeft,
    FiChevronRight,
    FiFilter,
    FiChevronDown,
    FiArrowUp,
    FiArrowDown
} from 'react-icons/fi';
import { BiSort } from 'react-icons/bi';

const CommonTable = ({
    columns,
    data = [],
    onView,
    onEdit,
    onDelete,
    searchPlaceholder = "Scan database...",
    isDark = false,
    itemsPerPage = 10
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // 1. Search Logic
    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        return data.filter(item =>
            columns.some(col => {
                if (col.searchKey && typeof col.searchKey === 'function') {
                    const customValue = col.searchKey(item);
                    return customValue && customValue.toString().toLowerCase().includes(searchTerm.toLowerCase());
                }
                const itemValue = item[col.accessor];
                return itemValue && itemValue.toString().toLowerCase().includes(searchTerm.toLowerCase());
            })
        );
    }, [data, searchTerm, columns]);

    // 2. Sorting Logic
    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig]);

    // 3. Pagination Logic
    const totalPages = Math.ceil(sortedData.length / rowsPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return sortedData.slice(start, start + rowsPerPage);
    }, [sortedData, currentPage, rowsPerPage]);

    const handleSort = (accessor) => {
        let direction = 'asc';
        if (sortConfig.key === accessor && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key: accessor, direction });
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Reset page when filtering/rows change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, rowsPerPage]);

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Ultra-Modern Capsule Search Bar */}
            <div className={`rounded-lg transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl ${isDark ? 'bg-slate-900/80 border-slate-800 shadow-black/20 backdrop-blur-xl' : ' border-slate-100 shadow-slate-200/50 backdrop-blur-xl'
                }`}>
                <div className="relative group w-full md:w-1/2">
                    <FiSearch className={`absolute left-6 top-1/2 -translate-y-1/2 transition-all duration-300 ${isDark ? 'text-slate-500 group-focus-within:text-indigo-400' : 'text-slate-400 group-focus-within:text-indigo-600'
                        }`} size={20} />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-16 pr-8 py-4 rounded-lg outline-none transition-all text-sm font-bold tracking-tight border-2 ${isDark
                            ? 'bg-slate-950/50 border-transparent focus:border-indigo-500/50 text-white placeholder:text-slate-700'
                            : 'bg-slate-50/50 border-transparent focus:border-indigo-600/20 text-slate-900 placeholder:text-slate-400'
                            }`}
                    />
                </div>

                <div className="flex items-center gap-6 px-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Active Streams</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            <span className="text-sm font-black font-mono">{sortedData.length} records</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Core with System Grid */}
            <div className={`rounded-lg border overflow-hidden transition-all duration-700 shadow-2xl ${isDark ? 'bg-slate-900/40 border-slate-800/50' : 'bg-white border-slate-200/50 shadow-slate-200/20'
                }`}>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className={`${isDark ? 'bg-slate-950/50' : 'bg-slate-50/80 text-slate-500'}`}>
                                {columns.map((col, idx) => {
                                    const isSorted = sortConfig.key === col.accessor;
                                    return (
                                        <th
                                            key={idx}
                                            onClick={() => handleSort(col.accessor)}
                                            className="px-5 py-3 text-[10px] font-black uppercase tracking-[0.4em] cursor-pointer whitespace-nowrap group transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`${isSorted ? 'text-indigo-500' : 'opacity-40 group-hover:opacity-100'}`}>
                                                    {col.header}
                                                </span>
                                                <div className="flex flex-col gap-0.5">
                                                    <FiArrowUp size={10} className={`transition-all ${isSorted && sortConfig.direction === 'asc' ? 'text-indigo-500' : 'opacity-10'}`} />
                                                    <FiArrowDown size={10} className={`transition-all ${isSorted && sortConfig.direction === 'desc' ? 'text-indigo-500' : 'opacity-10'}`} />
                                                </div>
                                            </div>
                                        </th>
                                    );
                                })}
                                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Operations</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y-2 ${isDark ? 'divide-slate-800/30' : 'divide-slate-50'}`}>
                            <AnimatePresence mode="popLayout">
                                {paginatedData.length > 0 ? paginatedData.map((item, rowIndex) => (
                                    <motion.tr
                                        key={item.id || item._id || rowIndex}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ type: 'spring', stiffness: 100, damping: 15, delay: rowIndex * 0.05 }}
                                        className={`group transition-all duration-500 ${isDark ? 'hover:bg-indigo-500/5' : 'hover:bg-indigo-50/50'}`}
                                    >
                                        {columns.map((col, colIdx) => (
                                            <td key={colIdx} className="px-5 py-3 whitespace-nowrap">
                                                {col.render ? (
                                                    <div className="transition-transform duration-300 group-hover:translate-x-1">{col.render(item)}</div>
                                                ) : (
                                                    <span className={`text-sm font-bold tracking-tight transition-colors duration-300 ${isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-600 group-hover:text-indigo-600'}`}>
                                                        {item[col.accessor]}
                                                    </span>
                                                )}
                                            </td>
                                        ))}

                                        <td className="px-5 py-3">
                                            <div className="flex items-center justify-start gap-3">
                                                <motion.button
                                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => onView?.(item)}
                                                    className={`p-3 rounded-lg transition-all shadow-lg shadow-transparent hover:shadow-indigo-500/20 ${isDark ? 'bg-slate-800/50 text-indigo-400 hover:bg-indigo-500 hover:text-white' : 'bg-slate-100 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                                                        }`}
                                                >
                                                    <FiEye size={18} />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.2, rotate: -5 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => onEdit?.(item)}
                                                    className={`p-3 rounded-lg transition-all shadow-lg shadow-transparent hover:shadow-emerald-500/20 ${isDark ? 'bg-slate-800/50 text-emerald-400 hover:bg-emerald-500 hover:text-white' : 'bg-slate-100 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                                                        }`}
                                                >
                                                    <FiEdit3 size={18} />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.2 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => onDelete?.(item)}
                                                    className={`p-3 rounded-lg transition-all shadow-lg shadow-transparent hover:shadow-rose-500/20 ${isDark ? 'bg-slate-800/50 text-rose-400 hover:bg-rose-500 hover:text-white' : 'bg-slate-100 text-rose-600 hover:bg-rose-600 hover:text-white'
                                                        }`}
                                                >
                                                    <FiTrash2 size={18} />
                                                </motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                )) : (
                                    <tr>
                                        <td colSpan={columns.length + 1} className="py-32 text-center">
                                            <motion.div
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="flex flex-col items-center gap-4 text-slate-500"
                                            >
                                                <div className="p-8 rounded-full bg-slate-500/5 border border-dashed border-slate-500/20">
                                                    <FiSearch size={48} className="opacity-20" />
                                                </div>
                                                <h3 className="text-xl font-black uppercase tracking-widest mt-4">Zero Matches</h3>
                                                <p className="text-xs font-bold opacity-40 max-w-xs">Adjust your search parameters to find the records you're looking for.</p>
                                            </motion.div>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Futuristic Aero-Dock Pagination */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 px-8">
                <div className="flex items-center gap-1.5 p-1.5 rounded-[1.5rem] bg-slate-500/5 border border-slate-500/10 backdrop-blur-md">
                    {[5, 10, 20].map((v) => (
                        <button
                            key={v}
                            onClick={() => setRowsPerPage(v)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all duration-500 ${rowsPerPage === v
                                ? 'bg-indigo-600 text-white shadow-[0_10px_20px_rgba(79,70,229,0.3)] scale-110'
                                : 'text-slate-500 hover:text-indigo-500 hover:bg-indigo-500/5'
                                }`}
                        >
                            {v} <span className="text-[8px] opacity-40 uppercase ml-1">Rows</span>
                        </button>
                    ))}
                </div>

                <div className={`p-2 rounded-[2rem] border backdrop-blur-2xl flex items-center gap-3 shadow-2xl ${isDark ? 'bg-slate-900 shadow-black border-slate-800' : 'bg-white shadow-slate-200/50 border-slate-100'
                    }`}>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={`p-3.5 rounded-2xl transition-all duration-500 disabled:opacity-5 ${isDark ? 'hover:bg-white hover:text-black' : 'hover:bg-slate-900 hover:text-white'
                            }`}
                    >
                        <FiChevronLeft size={22} />
                    </button>

                    <div className="flex items-center gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={`w-12 h-12 rounded-2xl text-xs font-black transition-all duration-500 border-2 ${currentPage === i + 1
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-[0_15px_30px_rgba(79,70,229,0.4)] scale-110 -translate-y-1'
                                    : (isDark ? 'bg-slate-950 border-transparent text-slate-600 hover:text-white hover:border-indigo-500/50' : 'bg-slate-50 border-transparent text-slate-400 hover:text-indigo-600 hover:border-indigo-600/30')
                                    }`}
                            >
                                {String(i + 1).padStart(2, '0')}
                            </button>
                        ))}
                    </div>

                    <button
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={`p-3.5 rounded-2xl transition-all duration-500 disabled:opacity-5 ${isDark ? 'hover:bg-white hover:text-black' : 'hover:bg-slate-900 hover:text-white'
                            }`}
                    >
                        <FiChevronRight size={22} />
                    </button>
                </div>

                <div className="text-right hidden lg:block">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20 block mb-1">Index Navigator</span>
                    <span className="text-sm font-black font-mono tracking-tighter text-indigo-500">
                        {Math.min((currentPage - 1) * rowsPerPage + 1, sortedData.length)} — {Math.min(currentPage * rowsPerPage, sortedData.length)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CommonTable;
