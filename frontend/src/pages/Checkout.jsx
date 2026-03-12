import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiCreditCard, FiCheckCircle, FiChevronRight, FiPlus, FiArrowLeft, FiInfo, FiSmartphone } from 'react-icons/fi';
import { getAllAddress } from '../redux/slices/addressSlice';
import { createOrder, createStripeSession } from '../redux/slices/orderSlice';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, totalAmount } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const { addresses, loading: addressLoading } = useSelector((state) => state.address);
    const { loading: orderLoading } = useSelector((state) => state.order);

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('Stripe');
    const [step, setStep] = useState(1); // 1: Address, 2: Payment & Review

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            dispatch(getAllAddress(user._id || user.id));
        }
    }, [user, dispatch, navigate]);

    useEffect(() => {
        if (addresses.length > 0 && !selectedAddress) {
            const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
            setSelectedAddress(defaultAddr);
        }
    }, [addresses, selectedAddress]);

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            alert("Please select a shipping address");
            return;
        }

        const orderData = {
            items,
            shippingAddress: selectedAddress,
            paymentMethod,
            totalAmount
        };

        const result = await dispatch(createOrder(orderData));
        if (result.payload?.success) {
            const orderId = result.payload.order._id;

            if (paymentMethod === 'Stripe') {
                const stripeResult = await dispatch(createStripeSession({ items, orderId }));
                if (stripeResult.payload?.url) {
                    window.location.href = stripeResult.payload.url;
                }
            } else {
                navigate('/order-success');
            }
        }
    };

    const formatPrice = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-surface font-sans text-primary">
            <Header />

            <main className="pt-32 pb-20">
                <div className="custom-container">
                    {/* Progress Bar */}
                    <div className="flex items-center justify-center mb-12">
                        <div className="flex items-center w-full max-w-2xl px-4">
                            <div className={`flex flex-col items-center gap-2 flex-1`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${step >= 1 ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-200 text-gray-400'}`}>1</div>
                                <span className={`text-xs font-black uppercase tracking-widest ${step >= 1 ? 'text-orange-500' : 'text-gray-400'}`}>Shipping</span>
                            </div>
                            <div className={`h-[2px] flex-1 mx-2 ${step >= 2 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
                            <div className={`flex flex-col items-center gap-2 flex-1`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${step >= 2 ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-200 text-gray-400'}`}>2</div>
                                <span className={`text-xs font-black uppercase tracking-widest ${step >= 2 ? 'text-orange-500' : 'text-gray-400'}`}>Payment</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        {/* Main Content */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Step 1: Address Selection */}
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="address-step"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-secondary shadow-sm">
                                            <h2 className="text-2xl font-black">Choose Shipping Address</h2>
                                            <button
                                                onClick={() => navigate('/profile', { state: { activeTab: 'address' } })}
                                                className="flex items-center gap-2 text-sm font-bold text-orange-500 hover:text-black transition-colors"
                                            >
                                                <FiPlus /> New Address
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {addresses.map((addr) => (
                                                <div
                                                    key={addr._id}
                                                    onClick={() => setSelectedAddress(addr)}
                                                    className={`cursor-pointer p-6 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden ${selectedAddress?._id === addr._id ? 'border-orange-500 bg-orange-50/30' : 'border-secondary bg-white hover:border-orange-200'}`}
                                                >
                                                    {selectedAddress?._id === addr._id && (
                                                        <div className="absolute top-4 right-4 text-orange-500">
                                                            <FiCheckCircle size={24} />
                                                        </div>
                                                    )}
                                                    <div className="flex items-start gap-4">
                                                        <div className={`p-3 rounded-2xl ${selectedAddress?._id === addr._id ? 'bg-orange-500 text-white' : 'bg-surface text-gray-400'}`}>
                                                            <FiMapPin size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-lg mb-1">{addr.fullName}</p>
                                                            <p className="text-sm text-gray-500 leading-relaxed">
                                                                {addr.addressLine}, {addr.city}<br />
                                                                {addr.state} - {addr.pincode}<br />
                                                                Mob: {addr.mobileNo}
                                                            </p>
                                                            <span className="inline-block mt-3 px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                                {addr.addressType}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {addresses.length === 0 && (
                                                <div className="col-span-full bg-white p-12 rounded-3xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
                                                    <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center text-gray-400 mb-4">
                                                        <FiMapPin size={32} />
                                                    </div>
                                                    <p className="text-muted font-medium mb-6">No saved addresses found</p>
                                                    <button
                                                        onClick={() => navigate('/profile', { state: { activeTab: 'address' } })}
                                                        className="px-8 py-3 bg-primary text-white rounded-xl font-bold"
                                                    >
                                                        Add Delivery Address
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                disabled={!selectedAddress}
                                                onClick={() => setStep(2)}
                                                className="px-12 py-5 bg-orange-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all duration-500 disabled:opacity-50 shadow-xl shadow-orange-500/20"
                                            >
                                                Continue to Payment
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="payment-step"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-6"
                                    >
                                        <div className="bg-white p-6 rounded-3xl border border-secondary shadow-sm">
                                            <div className="flex items-center gap-3 mb-6">
                                                <button onClick={() => setStep(1)} className="p-2 hover:bg-surface rounded-full transition-colors">
                                                    <FiArrowLeft size={20} />
                                                </button>
                                                <h2 className="text-2xl font-black">Select Payment Method</h2>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {[
                                                    { id: 'Stripe', name: 'Credit / Debit Card', icon: <FiCreditCard size={24} />, desc: 'Safe & Secure with Stripe' },
                                                    { id: 'UPI', name: 'UPI Payment', icon: <FiSmartphone size={24} />, desc: 'Google Pay, PhonePe, Paytm' },
                                                    { id: 'Netbanking', name: 'Net Banking', icon: <FiInfo size={24} />, desc: 'All Indian Banks supported' },
                                                    { id: 'COD', name: 'Cash on Delivery', icon: <FiSmartphone size={24} />, desc: 'Pay when you receive' },
                                                ].map((method) => (
                                                    <div
                                                        key={method.id}
                                                        onClick={() => setPaymentMethod(method.id)}
                                                        className={`cursor-pointer p-6 rounded-3xl border-2 transition-all duration-300 relative flex items-center gap-4 ${paymentMethod === method.id ? 'border-orange-500 bg-orange-50/30' : 'border-secondary bg-white hover:border-orange-200'}`}
                                                    >
                                                        <div className={`p-4 rounded-2xl ${paymentMethod === method.id ? 'bg-orange-500 text-white' : 'bg-surface text-gray-400'}`}>
                                                            {method.icon}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-lg">{method.name}</p>
                                                            <p className="text-xs text-gray-500">{method.desc}</p>
                                                        </div>
                                                        <div className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-orange-500' : 'border-gray-200'}`}>
                                                            {paymentMethod === method.id && <div className="w-3 h-3 bg-orange-500 rounded-full" />}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Order Preview */}
                                        <div className="bg-white p-8 rounded-3xl border border-secondary shadow-sm">
                                            <h3 className="text-xl font-black mb-6">Order Summary</h3>
                                            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                                {items.map((item) => (
                                                    <div key={item._id} className="flex gap-4 items-center">
                                                        <img
                                                            src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                                                            className="w-16 h-16 rounded-xl object-cover"
                                                            alt=""
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-bold text-sm text-primary line-clamp-1">{item.titleName}</p>
                                                            <p className="text-[10px] text-muted uppercase tracking-widest">
                                                                QTY: {item.quantity} • {item.size.width}x{item.size.height}
                                                            </p>
                                                        </div>
                                                        <p className="font-black text-sm text-orange-500">₹{item.price}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Summary Sidebar */}
                        <div className="lg:col-span-4 sticky top-40">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-3xl border border-secondary shadow-sm overflow-hidden"
                            >
                                <div className="p-8 bg-surface/50 border-b border-secondary">
                                    <h2 className="text-xl font-black uppercase tracking-tighter">Order Details</h2>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Total Items</span>
                                            <span className="font-black text-primary">{items.length}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-4 border-b border-orange-50">
                                            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                                            <span className="font-black text-primary">₹ {totalAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-xs font-black uppercase text-gray-500">GRAND TOTAL</span>
                                            <span className="text-2xl font-black text-orange-600 tracking-tighter">
                                                ₹ {totalAmount.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {step === 2 && (
                                        <div className="bg-surface rounded-2xl p-4 border border-secondary space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted">Shipping to:</p>
                                            <p className="text-xs font-bold text-primary">{selectedAddress?.fullName}</p>
                                            <p className="text-[10px] text-muted line-clamp-1">{selectedAddress?.addressLine}, {selectedAddress?.city}</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={step === 1 ? () => setStep(2) : handlePlaceOrder}
                                        disabled={orderLoading || (step === 1 && !selectedAddress)}
                                        className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all duration-500 shadow-2xl shadow-orange-500/20 disabled:opacity-50 group"
                                    >
                                        {orderLoading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                {step === 1 ? 'Go to Payment' : `Place Order with ${paymentMethod}`}
                                                <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>

                                    <div className="flex items-center justify-center gap-4 pt-4 grayscale opacity-50">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-3" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-3" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Checkout;
