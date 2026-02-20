import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiMenu, FiX, FiLogOut, FiSettings, FiPackage } from 'react-icons/fi';
import { logout } from '../redux/slices/authSlice'; // Adjust path if needed
import { AnimatePresence, motion } from 'framer-motion';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Auth state from Redux
    const { user } = useSelector((state) => state.auth || {});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        setIsProfileOpen(false);
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'New Arrivals', path: '/new-arrivals' },
        { name: 'Inspiration', path: '/inspiration' },
    ];

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] backdrop-blur-xl ${isScrolled ? 'bg-white/70 py-6' : 'bg-white/10 py-6'
                    }`}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-serif font-bold tracking-tighter text-gray-900">
                        LUMIÈRE<span className="text-amber-600">.</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-sm font-medium tracking-wide transition-colors hover:text-amber-600 ${isScrolled ? 'text-gray-700' : 'text-gray-900'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Icons & Actions */}
                    <div className="flex items-center gap-5">
                        <button className={`transition-colors hover:text-amber-600 ${isScrolled ? 'text-gray-700' : 'text-gray-900'}`}>
                            <FiSearch size={20} />
                        </button>

                        <Link to="/wishlist" className={`hidden sm:block transition-colors hover:text-amber-600 ${isScrolled ? 'text-gray-700' : 'text-gray-900'}`}>
                            <FiHeart size={20} />
                        </Link>

                        <Link to="/cart" className={`relative transition-colors hover:text-amber-600 ${isScrolled ? 'text-gray-700' : 'text-gray-900'}`}>
                            <FiShoppingBag size={20} />
                            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white">
                                0
                            </span>
                        </Link>

                        {/* User Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => user ? setIsProfileOpen(!isProfileOpen) : navigate('/login')}
                                className={`flex items-center gap-2 transition-colors hover:text-amber-600 focus:outline-none ${isScrolled ? 'text-gray-700' : 'text-gray-900'}`}
                            >
                                <FiUser size={20} />
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {isProfileOpen && user && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {user.firstName} {user.lastName}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>

                                        <div className="py-1">
                                            <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors">
                                                <FiUser className="text-gray-400" /> My Profile
                                            </Link>
                                            <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors">
                                                <FiPackage className="text-gray-400" /> Orders
                                            </Link>
                                            <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors">
                                                <FiSettings className="text-gray-400" /> Settings
                                            </Link>
                                        </div>

                                        <div className="border-t border-gray-100 mt-1 py-1">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                                            >
                                                <FiLogOut /> Sign Out
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-gray-900"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="fixed inset-x-0 top-[70px] bg-white border-b border-gray-100 shadow-lg z-40 md:hidden overflow-hidden"
                    >
                        <nav className="flex flex-col p-6 gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-lg font-medium text-gray-900 hover:text-amber-600 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <hr className="border-gray-100 my-2" />
                            <Link to="/wishlist" className="flex items-center gap-2 text-gray-600 hover:text-amber-600">
                                <FiHeart /> Wishlist
                            </Link>
                            <Link to="/cart" className="flex items-center gap-2 text-gray-600 hover:text-amber-600">
                                <FiShoppingBag /> Cart
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
