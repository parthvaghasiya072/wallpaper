import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiShoppingBag, FiInfo } from 'react-icons/fi';
import { removeFromCart, updateCartItem, getCart } from '../redux/slices/cartSlice';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, totalAmount, loading } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleQuantityChange = (cartItemId, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty >= 1) {
            dispatch(updateCartItem({ cartItemId, quantity: newQty }));
        }
    };

    const handleRemove = (cartItemId) => {
        dispatch(removeFromCart(cartItemId));
    };

    const formatPrice = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `http://localhost:5000${path}`;
    };

    if (loading && items.length === 0) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted font-medium">Curating your collection...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface font-sans text-primary">
            <Header />

            <main className="pt-32 pb-20">
                <div className="custom-container">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 text-gray-500 font-bold text-sm tracking-widest uppercase mb-2"
                            >
                                <span className="w-8 h-[2px] bg-orange-600"></span>
                                Your Gallery
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl font-black text-orange-500 "
                            >
                                Shopping Collection
                            </motion.h1>
                        </div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-muted text-sm font-medium"
                        >
                            {items.length} {items.length === 1 ? 'Masterpiece' : 'Masterpieces'} selected
                        </motion.div>
                    </div>

                    {items.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl p-12 md:p-20 shadow-sm border border-secondary flex flex-col items-center text-center"
                        >
                            <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center text-accent mb-6">
                                <FiShoppingBag size={40} />
                            </div>
                            <h2 className="text-2xl  font-bold mb-3">Your collection is empty</h2>
                            <p className="text-muted max-w-md mb-8">
                                It looks like you haven't added any wallpapers to your gallery yet. Explore our curated designs to find the perfect fit for your space.
                            </p>
                            <Link
                                to="/shop"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-accent transition-all duration-300 shadow-xl shadow-primary/10"
                            >
                                <FiArrowLeft /> Start Exploring
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                            {/* Items List */}
                            <div className="lg:col-span-8 space-y-6">
                                <AnimatePresence mode="popLayout">
                                    {items.map((item, index) => (
                                        <motion.div
                                            key={item._id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="group bg-white rounded-2xl overflow-hidden border border-secondary shadow-sm hover:shadow-md transition-shadow duration-300"
                                        >
                                            <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-secondary">
                                                {/* Product Image */}
                                                <Link
                                                    to={`/product-details/${item.productId}`}
                                                    className="sm:w-48 h-48 sm:h-auto overflow-hidden bg-surface relative"
                                                    title={`View details for ${item.titleName}`}
                                                >
                                                    <img
                                                        src={getImageUrl(item.image)}
                                                        alt={item.titleName}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                </Link>

                                                {/* Content */}
                                                <div className="flex-1 p-6 flex flex-col justify-between gap-4">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <div>
                                                            <h3 className=" text-xl font-bold mb-1 text-orange-600  group-hover:text-primary transition-colors">
                                                                {item.titleName}
                                                            </h3>
                                                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                                                                <span className="text-[11px] font-bold uppercase tracking-tighter text-muted flex items-center gap-1">
                                                                    <div className="w-1 h-1 rounded-full bg-accent"></div>
                                                                    Size: {item.size.width} x {item.size.height} {item.size.unit}
                                                                </span>
                                                                <span className="text-[11px] font-bold uppercase tracking-tighter text-muted flex items-center gap-1">
                                                                    <div className="w-1 h-1 rounded-full bg-accent"></div>
                                                                    {item.paperMaterial.paperType}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemove(item._id)}
                                                            className="p-2 text-muted hover:text-red-500 hover:bg-red-50 bg-surface rounded-lg transition-all duration-300"
                                                            title="Remove from collection"
                                                        >
                                                            <FiTrash2 size={18} />
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-auto pt-4">
                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center bg-surface border border-secondary rounded-xl p-1">
                                                            <button
                                                                onClick={() => handleQuantityChange(item._id, item.quantity, -1)}
                                                                className="p-2 hover:text-accent transition-colors disabled:opacity-30"
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                <FiMinus size={14} />
                                                            </button>
                                                            <span className="w-10 text-center font-bold text-sm">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => handleQuantityChange(item._id, item.quantity, 1)}
                                                                className="p-2 hover:text-accent transition-colors"
                                                            >
                                                                <FiPlus size={14} />
                                                            </button>
                                                        </div>

                                                        {/* Price */}
                                                        <div className="text-right">
                                                            <p className="text-xs text-muted font-bold uppercase tracking-widest mb-1">Price</p>
                                                            <p className="text-xl font-black text-orange-500 tracking-tighter">
                                                                ₹ {item.price}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-4 sticky top-40">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white rounded-3xl border border-secondary shadow-sm overflow-hidden"
                                >
                                    <div className="p-8 bg-surface/50 border-b border-secondary">
                                        <h2 className="text-xl font-bold">Summary</h2>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                                                <span className="font-bold text-orange-500">₹ {totalAmount}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Estimated GST (18%)</span>
                                                <span className="font-bold text-orange-400">Inclusive</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs pb-4 border-b border-orange-50">
                                                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Delivery</span>
                                                <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest">Free</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2">
                                                <span className="text-base font-black uppercase  text-primary">GRAND TOTAL</span>
                                                <span className="text-2xl font-black text-orange-600 tracking-tighter">
                                                    ₹ {totalAmount}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-amber-50 rounded-2xl p-4 flex gap-3 border border-amber-100">
                                            <FiInfo className="text-amber-500 shrink-0 mt-0.5" size={20} />
                                            <p className="text-[12px] text-amber-900 leading-relaxed">
                                                Walls are measured in Sq. Ft. The price includes premium printing, high-grade material, and shipping within India.
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => navigate('/checkout')}
                                            className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all duration-500 shadow-2xl shadow-orange-500/20 group"
                                        >
                                            Secure Checkout
                                            <motion.div
                                                animate={{ x: [0, 5, 0] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                            >
                                                <FiArrowLeft className="rotate-180" />
                                            </motion.div>
                                        </button>

                                        <div className="flex items-center justify-center gap-4 pt-4 grayscale opacity-50">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
                                        </div>
                                    </div>
                                </motion.div>

                                <Link
                                    to="/shop"
                                    className="flex items-center justify-center gap-2 mt-6 text-sm font-bold text-muted hover:text-accent transition-colors"
                                >
                                    <FiArrowLeft /> Continue browsing designs
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Cart;
