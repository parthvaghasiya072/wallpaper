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

const CommonTable = ({
    columns,
    data = [],
    onView,
    onEdit,
    onDelete,
    showEdit = true,
    showSearch = true,
    showPagination = true,
    searchPlaceholder = "Scan database...",
    isDark = false,
    itemsPerPage = 10,
    serverTotalPages,
    serverCurrentPage,
    onPageChange,
    onRowsPerPageChange,
    totalRecordsCount,
    onSearch,
    searchTerm: externalSearchTerm
}) => {
    const isServerSide = serverTotalPages !== undefined;
    const [localSearchTerm, setLocalSearchTerm] = useState('');
    const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : localSearchTerm;
    const [localCurrentPage, setLocalCurrentPage] = useState(1);
    // ... (rest of state items are fine to keep, maybe reset localCurrentPage if showPagination changes but unlikely)
    const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Sync local state with prop
    useEffect(() => {
        setRowsPerPage(itemsPerPage);
    }, [itemsPerPage]);

    const activePage = isServerSide ? serverCurrentPage : localCurrentPage;

    // Check if any actions are enabled
    const hasActions = onView || onEdit || onDelete;

    // ... (Search, Sorting, Pagination Logic - keep as is) 

    const filteredData = useMemo(() => {
        if (isServerSide) return data;
        if (!searchTerm) return data;

        const lowerSearch = searchTerm.toLowerCase();

        return data.filter(item => {
            // Priority 1: Check columns with custom searchKey functions
            const hasCustomMatch = columns.some(col => {
                if (col.searchKey && typeof col.searchKey === 'function') {
                    const val = col.searchKey(item);
                    return val && val.toString().toLowerCase().includes(lowerSearch);
                }
                return false;
            });

            if (hasCustomMatch) return true;

            // Priority 2: Deep search across all properties of the item (excluding functions/actions)
            const deepMatch = (obj) => {
                for (let key in obj) {
                    const value = obj[key];
                    if (value === null || value === undefined) continue;

                    if (typeof value === 'object' && !(value instanceof Date)) {
                        if (deepMatch(value)) return true;
                    } else {
                        if (value.toString().toLowerCase().includes(lowerSearch)) return true;
                    }
                }
                return false;
            };

            return deepMatch(item);
        });
    }, [data, searchTerm, columns, isServerSide]);

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

    const totalPages = isServerSide ? serverTotalPages : Math.ceil(sortedData.length / rowsPerPage);
    const paginatedData = useMemo(() => {
        if (!showPagination && !isServerSide) return sortedData; // Show all if pagination disabled locally
        if (isServerSide) return sortedData;
        const start = (localCurrentPage - 1) * rowsPerPage;
        return sortedData.slice(start, start + rowsPerPage);
    }, [sortedData, localCurrentPage, rowsPerPage, isServerSide, showPagination]);

    // ... (Handlers)
    const handleSort = (accessor) => {
        let direction = 'asc';
        if (sortConfig.key === accessor && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key: accessor, direction });
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            if (isServerSide) {
                onPageChange?.(page);
            } else {
                setLocalCurrentPage(page);
            }
        }
    };

    const handleRowsPerPageChange = (v) => {
        setRowsPerPage(v);
        if (onRowsPerPageChange) {
            onRowsPerPageChange(v);
        } else if (isServerSide) {
            onPageChange?.(1);
        } else {
            setLocalCurrentPage(1);
        }
    }

    useEffect(() => {
        if (!isServerSide) setLocalCurrentPage(1);
    }, [searchTerm, rowsPerPage, isServerSide]);

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Ultra-Modern Capsule Search Bar */}
            {showSearch && (
                <div className={`rounded-lg transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-4 p-2 shadow-2xl ${isDark
                    ? 'bg-slate-900/40 border border-slate-800/50 backdrop-blur-2xl'
                    : 'bg-white/80 border border-slate-200/60 backdrop-blur-2xl shadow-slate-200/40'
                    }`}>
                    <div className="relative group w-full md:w-1/2">
                        <FiSearch className={`absolute left-6 top-1/2 -translate-y-1/2 transition-all duration-300 ${isDark ? 'text-slate-500 group-focus-within:text-indigo-400' : 'text-slate-400 group-focus-within:text-indigo-600'
                            }`} size={20} />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (onSearch) {
                                    onSearch(val);
                                } else {
                                    setLocalSearchTerm(val);
                                }
                            }}
                            className={`w-full pl-16 pr-8 py-4 rounded-lg outline-none transition-all text-sm font-bold tracking-tight border-2 ${isDark
                                ? 'bg-slate-950/50 border-transparent focus:border-indigo-500/50 text-white placeholder:text-slate-700'
                                : 'bg-slate-50/50 border-transparent focus:border-indigo-600/20 text-slate-900 placeholder:text-slate-400'
                                }`}
                        />
                    </div>

                    <div className="flex items-center gap-6 px-6">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black tracking-[0.3em] opacity-30">Active Streams</span>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                <span className="text-sm font-black font-mono">{isServerSide ? totalRecordsCount : sortedData.length} records</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Table Core with System Grid */}
            <div className={`rounded-lg border overflow-hidden transition-all duration-700 shadow-2xl ${isDark
                ? 'bg-slate-900/20 border-slate-800/50 backdrop-blur-xl'
                : 'bg-white border-slate-200/50 shadow-slate-200/20'
                }`}>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className={`border-b-2 ${isDark ? 'bg-slate-950/40 border-slate-800/50' : 'bg-slate-50/50 border-slate-100 text-slate-500'}`}>
                                {columns.map((col, idx) => {
                                    const isSorted = sortConfig.key === col.accessor;
                                    return (
                                        <th
                                            key={idx}
                                            onClick={() => handleSort(col.accessor)}
                                            className="px-5 py-3 text-[16px] font-black tracking-[0.2em] cursor-pointer whitespace-nowrap group transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`${isSorted ? 'text-indigo-500' : 'group-hover:opacity-100'}`}>
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
                                {hasActions && <th className="px-8 py-6 text-[16px] font-black tracking-[0.2em] uppercase opacity-50 whitespace-nowrap">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-slate-800/50' : 'divide-slate-100'}`}>
                            <AnimatePresence mode="popLayout">
                                {paginatedData.length > 0 ? paginatedData.map((item, rowIndex) => (
                                    <motion.tr
                                        key={item.id || item._id || rowIndex}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ type: 'spring', stiffness: 100, damping: 15, delay: rowIndex * 0.05 }}
                                        className={`group transition-all duration-500 ${isDark ? 'hover:bg-indigo-500/5' : 'hover:bg-slate-50/80'}`}
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

                                        {hasActions && (
                                            <td className="px-5 py-3">
                                                <div className="flex items-center justify-start gap-5">
                                                    {onView && (
                                                        <motion.button
                                                            whileHover={{ scale: 1.2, rotate: 5 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => onView(item)}
                                                            className={`p-2 rounded-xl transition-all ${isDark ? 'text-indigo-400 hover:bg-indigo-500/20' : 'text-indigo-600 hover:bg-indigo-50'}`}
                                                        >
                                                            <FiEye size={18} />
                                                        </motion.button>
                                                    )}
                                                    {showEdit && onEdit && (
                                                        <motion.button
                                                            whileHover={{ scale: 1.2, rotate: -5 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => onEdit(item)}
                                                            className={`p-2 rounded-xl transition-all ${isDark ? 'text-emerald-400 hover:bg-emerald-500/20' : 'text-emerald-600 hover:bg-emerald-50'}`}
                                                        >
                                                            <FiEdit3 size={18} />
                                                        </motion.button>
                                                    )}
                                                    {onDelete && (
                                                        <motion.button
                                                            whileHover={{ scale: 1.2 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => onDelete(item)}
                                                            className={`p-2 rounded-xl transition-all ${isDark ? 'text-rose-400 hover:bg-rose-500/20' : 'text-rose-600 hover:bg-rose-50'}`}
                                                        >
                                                            <FiTrash2 size={18} />
                                                        </motion.button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
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
                                                <h3 className="text-xl font-black tracking-widest mt-4">Zero Matches</h3>
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

            {/* Simplified Modern Pagination */}
            {showPagination && (
                <div className={`px-8 py-6 flex flex-col sm:flex-row items-center rounded-lg justify-between gap-6 ${isDark ? 'bg-slate-950/20 border-t border-slate-800/50' : 'bg-slate-50/30 border-t border-slate-100'}`}>
                    <div className="flex items-center gap-4">
                        <span className={`text-xs font-bold tracking-widest opacity-40 ${isDark ? 'text-white' : 'text-slate-900'}`}>Rows:</span>
                        <div className="flex items-center gap-1">
                            {[5, 10, 20].map((v) => (
                                <button
                                    key={v}
                                    onClick={() => handleRowsPerPageChange(v)}
                                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${rowsPerPage === v
                                        ? 'bg-indigo-600 text-white shadow-lg'
                                        : (isDark ? 'text-slate-500 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50')
                                        }`}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={activePage === 1}
                            onClick={() => handlePageChange(activePage - 1)}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all disabled:opacity-10 ${isDark ? 'border-slate-800 text-slate-400 hover:bg-white hover:text-black' : 'border-slate-200 text-slate-500 hover:bg-slate-900 hover:text-white'}`}
                        >
                            <FiChevronLeft size={18} />
                        </button>

                        <div className="flex items-center gap-1">
                            <span className={`px-4 py-2 rounded-xl text-xs font-black border uppercase tracking-widest ${isDark ? 'bg-slate-950 border-slate-800 text-indigo-400' : 'bg-slate-50 border-slate-200 text-indigo-600'}`}>
                                {activePage} <span className="opacity-30 mx-1">/</span> {totalPages || 1}
                            </span>
                        </div>

                        <button
                            disabled={activePage === totalPages || totalPages === 0}
                            onClick={() => handlePageChange(activePage + 1)}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all disabled:opacity-10 ${isDark ? 'border-slate-800 text-slate-400 hover:bg-white hover:text-black' : 'border-slate-200 text-slate-500 hover:bg-slate-900 hover:text-white'}`}
                        >
                            <FiChevronRight size={18} />
                        </button>
                    </div>

                    <div className="hidden md:block">
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-30 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Displaying {Math.min((activePage - 1) * rowsPerPage + 1, totalRecordsCount || 0)} - {Math.min(activePage * rowsPerPage, totalRecordsCount || 0)} <span className="mx-1">of</span> {totalRecordsCount || 0}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommonTable;
