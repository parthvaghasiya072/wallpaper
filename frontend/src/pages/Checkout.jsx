import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiCreditCard, FiCheckCircle, FiChevronRight, FiPlus, FiArrowLeft, FiInfo, FiSmartphone, FiUser } from 'react-icons/fi';
import { getAllAddress } from '../redux/slices/addressSlice';
import { createOrder, createPaymentIntent, updatePaymentStatus } from '../redux/slices/orderSlice';
import { clearCartState } from '../redux/slices/cartSlice';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';

// Load Stripe outside of component to avoid recreating stripe object on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

const StripePaymentForm = ({ cardHolderName, setCardHolderName }) => {
    return (
        <div className="space-y-6 mt-6 p-6 bg-surface/50 rounded-3xl border border-secondary shadow-inner">
            <h3 className="text-lg font-black flex items-center gap-2">
                <FiCreditCard className="text-orange-500" /> Card Details
            </h3>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-2">
                        <FiUser /> Card Holder Name
                    </label>
                    <input
                        type="text"
                        placeholder="John Doe"
                        value={cardHolderName}
                        onChange={(e) => setCardHolderName(e.target.value)}
                        className="w-full px-5 py-4 bg-white border border-secondary rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-bold"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">Card Information</label>
                    <div className="px-5 py-4 bg-white border border-secondary rounded-2xl focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
                        <CardElement options={{
                            hidePostalCode: true,
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#1a1a1a',
                                    '::placeholder': { color: '#a0aec0' },
                                    fontFamily: 'Outfit, sans-serif'
                                },
                            }
                        }} />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[10px] text-muted font-medium bg-white/50 p-3 rounded-xl border border-secondary/50">
                    <FiInfo className="text-orange-500 flex-shrink-0" />
                    Secure encrypted payment via Stripe.
                </div>

                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 space-y-2">
                    <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" /> Testing Environment
                    </p>
                    <p className="text-[11px] font-bold text-orange-800">
                        Use <code className="bg-white px-2 py-0.5 rounded border border-orange-200">4242 4242 4242 4242</code> for testing.
                    </p>
                </div>
            </div>
        </div>
    );
};

const CheckoutContent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();

    const { items, totalAmount } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const { addresses, loading: addressLoading } = useSelector((state) => state.address);
    const { loading: orderLoading } = useSelector((state) => state.order);

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('Stripe');
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardHolderName, setCardHolderName] = useState('');

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

    const handlePlaceOrder = async (e) => {
        if (e) e.preventDefault();

        if (!selectedAddress) {
            toast.error("Please select a shipping address");
            return;
        }

        if (!stripe || !elements) {
            toast.error("Stripe is not fully initialized. Please try again in a moment.");
            console.error("Stripe/Elements missing:", { stripe, elements });
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (paymentMethod === 'Stripe') {
            if (!cardElement) {
                toast.error("Payment form not ready.");
                return;
            }
            if (!cardHolderName.trim()) {
                toast.error("Please enter Card Holder Name");
                return;
            }
        }

        setIsProcessing(true);

        try {
            console.log("1. Creating order...");
            const orderData = {
                items: items.map(item => ({
                    productId: item.productId || item._id, // Ensure productId is correctly mapped
                    titleName: item.titleName,
                    image: item.image,
                    quantity: item.quantity,
                    size: item.size,
                    paperMaterial: item.paperMaterial,
                    price: item.price
                })),
                shippingAddress: {
                    fullName: selectedAddress.fullName,
                    mobileNo: selectedAddress.mobileNo,
                    addressLine: selectedAddress.addressLine,
                    city: selectedAddress.city,
                    state: selectedAddress.state,
                    pincode: selectedAddress.pincode,
                    country: selectedAddress.country || 'India'
                },
                paymentMethod,
                totalAmount
            };

            const result = await dispatch(createOrder(orderData));

            if (!result.payload?.success) {
                console.error("Order Creation Failed. Response:", result.payload);
                const errorMsg = result.payload?.message || (typeof result.payload === 'string' ? result.payload : "Order creation failed");
                toast.error(errorMsg);
                setIsProcessing(false);
                return;
            }

            const orderId = result.payload.order._id;
            console.log("2. Order created, ID:", orderId);

            if (paymentMethod === 'Stripe') {
                console.log("3. Requesting Payment Intent for order:", orderId);
                const intentResult = await dispatch(createPaymentIntent({ orderId }));

                if (!intentResult.payload?.success) {
                    console.error("Payment Intent Error:", intentResult.payload);
                    toast.error(intentResult.payload?.message || "Stripe session failed");
                    setIsProcessing(false);
                    return;
                }

                const { clientSecret } = intentResult.payload;
                console.log("4. Confirming Payment with Stripe...");

                const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: cardHolderName,
                            email: user.email,
                        },
                    }
                });

                if (error) {
                    console.error("Stripe Confirmation Error:", error);
                    toast.error(error.message);
                    setIsProcessing(false);
                    return;
                }

                if (paymentIntent.status === 'succeeded') {
                    console.log("5. Payment Succeeded, Updating backend...");
                    await dispatch(updatePaymentStatus({
                        orderId,
                        paymentStatus: 'Completed',
                        stripePaymentId: paymentIntent.id
                    }));

                    toast.success("Payment successful!");
                    dispatch(clearCartState());
                    navigate('/order-success');
                } else {
                    console.warn("Payment status unknown:", paymentIntent.status);
                    toast.error("Payment status: " + paymentIntent.status);
                    setIsProcessing(false);
                }
            } else {
                // COD or other methods
                console.log("3. Confirming COD order...");
                await dispatch(updatePaymentStatus({
                    orderId,
                    paymentStatus: 'Completed'
                }));

                toast.success("Order Placed Successfully!");
                dispatch(clearCartState());
                navigate('/order-success');
            }
        } catch (err) {
            console.error("Fatal checkout error:", err);
            toast.error("Something went wrong. Please check console.");
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface font-sans text-primary relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />

            <Header />

            <main className="pt-32 pb-20">
                <div className="custom-container">
                    {/* Progress Bar */}
                    <div className="flex items-center justify-center mb-16">
                        <div className="flex items-center w-full max-w-2xl px-4">
                            <div className="flex flex-col items-center gap-3 flex-1">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 shadow-lg ${step >= 1 ? 'bg-orange-500 text-white shadow-orange-500/30 scale-110' : 'bg-white text-gray-400 border border-secondary shadow-sm'}`}>1</div>
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${step >= 1 ? 'text-orange-500' : 'text-gray-400'}`}>Address</span>
                            </div>
                            <div className={`h-[2px] flex-1 mx-4 rounded-full transition-all duration-1000 ${step >= 2 ? 'bg-orange-500' : 'bg-secondary'}`}></div>
                            <div className="flex flex-col items-center gap-3 flex-1">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 shadow-lg ${step >= 2 ? 'bg-orange-500 text-white shadow-orange-500/30 scale-110' : 'bg-white text-gray-400 border border-secondary shadow-sm'}`}>2</div>
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${step >= 2 ? 'text-orange-500' : 'text-gray-400'}`}>Review</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        {/* Main Content */}
                        <div className="lg:col-span-8 space-y-10">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="address-step"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-secondary shadow-sm">
                                            <h2 className="text-3xl font-black tracking-tight">Delivery Details</h2>
                                            <button
                                                onClick={() => navigate('/profile', { state: { activeTab: 'address' } })}
                                                className="flex items-center gap-2 px-6 py-3 bg-surface rounded-2xl text-xs font-black text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-500 group"
                                            >
                                                <FiPlus /> Add New <span className="hidden sm:inline">Address</span>
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {addresses.map((addr) => (
                                                <div
                                                    key={addr._id}
                                                    onClick={() => setSelectedAddress(addr)}
                                                    className={`group cursor-pointer p-8 rounded-[2.5rem] border-2 transition-all duration-500 relative overflow-hidden ${selectedAddress?._id === addr._id ? 'border-orange-500 bg-orange-50/20' : 'border-secondary bg-white hover:border-orange-200 hover:translate-y-[-4px] shadow-sm hover:shadow-xl hover:shadow-orange-500/5'}`}
                                                >
                                                    {selectedAddress?._id === addr._id && (
                                                        <motion.div
                                                            layoutId="active-address"
                                                            className="absolute top-6 right-6 text-orange-500"
                                                        >
                                                            <FiCheckCircle size={28} />
                                                        </motion.div>
                                                    )}
                                                    <div className="flex items-start gap-6">
                                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${selectedAddress?._id === addr._id ? 'bg-orange-500 text-white' : 'bg-surface text-gray-400 group-hover:bg-orange-100 group-hover:text-orange-500'}`}>
                                                            <FiMapPin size={24} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <p className="font-black text-xl tracking-tight">{addr.fullName}</p>
                                                                <span className="px-3 py-1 bg-surface border border-secondary rounded-full text-[9px] font-black uppercase tracking-widest text-muted">
                                                                    {addr.addressType}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-500 leading-relaxed font-medium mb-4">
                                                                {addr.addressLine}, {addr.city}<br />
                                                                {addr.state} - {addr.pincode}
                                                            </p>
                                                            <p className="text-xs font-black text-primary flex items-center gap-2">
                                                                <FiSmartphone className="text-orange-500" /> {addr.mobileNo}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button
                                                disabled={!selectedAddress}
                                                onClick={() => setStep(2)}
                                                className="group px-14 py-6 bg-primary text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-primary/20 hover:bg-orange-500 hover:shadow-orange-500/20 transition-all duration-500 disabled:opacity-30 flex items-center gap-3"
                                            >
                                                Payment Method <FiChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="payment-step"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="bg-white p-8 rounded-[2rem] border border-secondary shadow-sm">
                                            <div className="flex items-center gap-5 mb-10">
                                                <button onClick={() => setStep(1)} className="w-12 h-12 flex items-center justify-center bg-surface hover:bg-orange-500 hover:text-white rounded-2xl transition-all duration-500">
                                                    <FiArrowLeft size={20} />
                                                </button>
                                                <h2 className="text-3xl font-black tracking-tight">Payment Method</h2>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {[
                                                    { id: 'Stripe', name: 'Credit / Debit Card', icon: <FiCreditCard size={28} />, desc: 'Safe & Secure via Stripe' },
                                                    { id: 'COD', name: 'Cash on Delivery', icon: <FiSmartphone size={28} />, desc: 'Pay on delivery' },
                                                ].map((method) => (
                                                    <div
                                                        key={method.id}
                                                        onClick={() => setPaymentMethod(method.id)}
                                                        className={`group cursor-pointer p-8 rounded-[2.5rem] border-2 transition-all duration-500 flex items-center gap-6 relative ${paymentMethod === method.id ? 'border-orange-500 bg-orange-50/20' : 'border-secondary bg-white hover:border-orange-200 shadow-sm'}`}
                                                    >
                                                        <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center transition-all duration-500 ${paymentMethod === method.id ? 'bg-orange-500 text-white' : 'bg-surface text-gray-400 group-hover:bg-orange-100 group-hover:text-orange-500'}`}>
                                                            {method.icon}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-black text-xl tracking-tight mb-1">{method.name}</p>
                                                            <p className="text-xs text-muted font-medium uppercase tracking-widest">{method.desc}</p>
                                                        </div>
                                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${paymentMethod === method.id ? 'border-orange-500' : 'border-secondary'}`}>
                                                            {paymentMethod === method.id && (
                                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 bg-orange-500 rounded-full" />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {paymentMethod === 'Stripe' && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="overflow-hidden"
                                                >
                                                    <StripePaymentForm
                                                        cardHolderName={cardHolderName}
                                                        setCardHolderName={setCardHolderName}
                                                    />
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Order Items Preview */}
                                        <div className="bg-white p-10 rounded-[3rem] border border-secondary shadow-sm">
                                            <h3 className="text-2xl font-black mb-10 tracking-tight">Review Order</h3>
                                            <div className="space-y-8 max-h-[400px] overflow-y-auto pr-6 custom-scrollbar">
                                                {items.map((item) => (
                                                    <div key={item._id} className="flex gap-8 items-center bg-surface/30 p-4 rounded-3xl border border-secondary/20">
                                                        <div className="relative">
                                                            <img
                                                                src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                                                                className="w-24 h-24 rounded-2xl object-cover shadow-lg"
                                                                alt=""
                                                            />
                                                            <span className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-black shadow-lg">
                                                                {item.quantity}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-black text-lg text-primary mb-2 line-clamp-1">{item.titleName}</p>
                                                            <div className="flex flex-wrap gap-3">
                                                                <span className="px-3 py-1 bg-white border border-secondary rounded-xl text-[10px] font-black uppercase tracking-widest text-muted">
                                                                    Size: {item.size.width}x{item.size.height} {item.size.unit}
                                                                </span>
                                                                <span className="px-3 py-1 bg-white border border-secondary rounded-xl text-[10px] font-black uppercase tracking-widest text-muted">
                                                                    Material: {item.paperMaterial.paperType}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="font-black text-xl text-orange-600 tracking-tighter">₹{item.price}</p>
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
                                className="bg-white rounded-[3rem] border border-secondary shadow-2xl shadow-orange-500/5 overflow-hidden"
                            >
                                <div className="p-10 bg-surface/50 border-b border-secondary">
                                    <h2 className="text-xl font-black uppercase tracking-widest text-primary/40 text-center">Checkout Summary</h2>
                                </div>
                                <div className="p-10 space-y-8">
                                    <div className="space-y-5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted font-bold uppercase tracking-widest text-[11px]">Subtotal Cost</span>
                                            <span className="font-black text-xl tracking-tighter text-primary">₹ {totalAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted font-bold uppercase tracking-widest text-[11px]">Shipping Fee</span>
                                            <span className="font-black text-primary uppercase text-[11px] tracking-widest text-green-500">FREE delivery</span>
                                        </div>
                                        <div className="h-[2px] w-full bg-surface" />
                                        <div className="flex justify-between items-center pt-2">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Total Payable</span>
                                                <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">Inclusive of taxes</span>
                                            </div>
                                            <span className="text-4xl font-black text-orange-600 tracking-tighter">
                                                ₹ {totalAmount.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {step === 2 && (
                                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface rounded-[2rem] p-6 border border-secondary space-y-3">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted border-b border-secondary/50 pb-2">Delivery To:</p>
                                            <div className="flex items-start gap-3">
                                                <FiMapPin className="text-orange-500 mt-1 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-black text-primary leading-tight">{selectedAddress?.fullName}</p>
                                                    <p className="text-[11px] text-muted font-medium line-clamp-1 mt-1">{selectedAddress?.addressLine}, {selectedAddress?.city}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    <button
                                        onClick={step === 1 ? () => setStep(2) : handlePlaceOrder}
                                        disabled={isProcessing || (step === 1 && !selectedAddress) || items.length === 0}
                                        className={`w-full py-6 rounded-[1.75rem] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-4 transition-all duration-700 shadow-2xl relative overflow-hidden group ${step === 1 ? 'bg-primary text-white shadow-primary/20 hover:bg-orange-600' : 'bg-orange-500 text-white shadow-orange-500/30 hover:bg-black'}`}
                                    >
                                        <AnimatePresence mode="wait">
                                            {isProcessing ? (
                                                <motion.div
                                                    key="loader"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex items-center gap-3"
                                                >
                                                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span>Processing</span>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="btn-content"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex items-center gap-3"
                                                >
                                                    {step === 1 ? 'Confirm Address' : `Complete Acquisition`}
                                                    <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </button>

                                    <div className="flex flex-col items-center gap-4 pt-2">
                                        <p className="text-[9px] font-black text-muted uppercase tracking-[0.3em]">Curated Payments</p>
                                        <div className="flex items-center justify-center gap-6 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 bg-surface/50 px-6 py-3 rounded-2xl border border-secondary/50 w-full">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Stripe_logo%2C_revised_2016.svg" alt="Stripe" className="h-5" />
                                        </div>
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

const Checkout = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutContent />
        </Elements>
    );
};

export default Checkout;
