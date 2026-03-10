import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiMenu, FiX, FiLogOut, FiSettings, FiPackage } from 'react-icons/fi';
import { logout } from '../redux/slices/authSlice'; // Adjust path if needed
import { getCart } from '../redux/slices/cartSlice';
import { getWishlist } from '../redux/slices/wishlistSlice';
import { AnimatePresence, motion } from 'framer-motion';

// Helper for image URL
const getImageUrl = (image) => {
    if (!image) return null;
    if (typeof image === 'string') {
        return image.startsWith('http') ? image : `http://localhost:5000/uploads/${image}`;
    }
    return URL.createObjectURL(image);
};

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Auth state from Redux
    const { user, userId } = useSelector((state) => state.auth || {});
    const { selectedUser } = useSelector((state) => state.user || {});
    const activeUser = (selectedUser?._id === userId) ? selectedUser : (user?.data || user);
    const { items, loading: cartLoading, initialized: cartInitialized } = useSelector((state) => state.cart || { items: [], loading: false, initialized: false });
    const { items: wishlistItems } = useSelector((state) => state.wishlist || { items: [] });
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

    useEffect(() => {
        if (userId) {
            dispatch(getCart());
            dispatch(getWishlist());
        }
    }, [dispatch, userId]);

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
                <div className="custom-container flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-serif font-bold tracking-tighter text-gray-900">
                        LUMIÈRE<span className="text-accent">.</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-sm font-medium tracking-wide transition-colors hover:text-accent ${isScrolled ? 'text-gray-700' : 'text-gray-900'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Icons & Actions */}
                    <div className="flex items-center gap-5">
                        <button className={`transition-colors hover:text-accent ${isScrolled ? 'text-gray-700' : 'text-gray-900'}`}>
                            <FiSearch size={20} />
                        </button>

                        <Link to="/profile" state={{ activeTab: 'wishlist' }} className={`hidden sm:block relative transition-colors hover:text-accent ${isScrolled ? 'text-gray-700' : 'text-gray-900'}`}>
                            <FiHeart size={20} />
                            {wishlistItems && wishlistItems.length > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                                    {wishlistItems.length}
                                </span>
                            )}
                        </Link>

                        <Link to="/cart" className={`relative transition-colors hover:text-accent ${isScrolled ? 'text-gray-700' : 'text-gray-900'}`}>
                            <FiShoppingBag size={20} />
                            {items && items.length > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                                    {items.length}
                                </span>
                            )}
                        </Link>

                        {/* User Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => activeUser ? setIsProfileOpen(!isProfileOpen) : navigate('/login')}
                                className={`flex items-center gap-2 transition-colors hover:text-accent focus:outline-none ${isScrolled ? 'text-gray-700' : 'text-gray-900'}`}
                            >
                                {activeUser?.photo ? (
                                    <img
                                        src={getImageUrl(activeUser.photo)}
                                        alt="Profile"
                                        className="w-7 h-7 rounded-full object-cover border border-gray-200"
                                    />
                                ) : (
                                    <FiUser size={20} />
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {isProfileOpen && activeUser && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden ring-1 ring-black/5"
                                    >
                                        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-br from-amber-50/50 to-white/50 flex gap-3 items-center">
                                            {activeUser?.photo ? (
                                                <img
                                                    src={getImageUrl(activeUser.photo)}
                                                    alt="Profile"
                                                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                                />
                                            ) : (
                                                <div className="min-w-[40px] h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold italic font-serif text-lg">
                                                    {activeUser.firstName?.charAt(0)}{activeUser.lastName?.charAt(0)}
                                                </div>
                                            )}
                                            <div className="overflow-hidden">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-accent mb-0.5">
                                                    Welcome
                                                </p>
                                                <p className="text-sm font-bold text-primary truncate">
                                                    {activeUser.firstName} {activeUser.lastName}
                                                </p>
                                                <p className="text-[11px] text-muted truncate">{activeUser.email}</p>
                                            </div>
                                        </div>

                                        <div className="py-2">
                                            <Link
                                                to="/profile"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-accent transition-all duration-300"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-accent">
                                                    <FiUser size={16} />
                                                </div>
                                                <span className="font-medium">My Profile</span>
                                            </Link>

                                            <Link
                                                to="/orders"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-accent transition-all duration-300"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <FiPackage size={16} />
                                                </div>
                                                <span className="font-medium">Orders</span>
                                            </Link>

                                            <Link
                                                to="/settings"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-accent transition-all duration-300"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                                                    <FiSettings size={16} />
                                                </div>
                                                <span className="font-medium">Settings</span>
                                            </Link>
                                        </div>

                                        <div className="p-3 border-t border-gray-100">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all duration-300 shadow-lg shadow-red-200"
                                            >
                                                <FiLogOut size={16} /> Sign Out
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
                            <Link to="/profile" state={{ activeTab: 'wishlist' }} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-gray-600 hover:text-amber-600">
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
