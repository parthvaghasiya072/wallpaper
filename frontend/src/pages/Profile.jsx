import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiUser, FiMail, FiPhone, FiEdit2, FiShield, FiPackage, FiHeart, FiSave, FiX, FiCheckCircle, FiMapPin, FiPlus, FiHome, FiBriefcase, FiMoreHorizontal, FiTrash2, FiEye, FiEyeOff, FiLock, FiHash, FiGlobe, FiShoppingBag, FiSearch, FiArrowRight, FiDownload, FiActivity, FiFilter, FiExternalLink, FiAward, FiArchive, FiZap } from 'react-icons/fi';
import Header from '../components/Header';
import toast from 'react-hot-toast';
import { getUserById, updateUser, changePassword } from '../redux/slices/userSlice';
import { getAllAddress, createAddress, updateAddressById, deleteAddressById } from '../redux/slices/addressSlice';
import { getWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { getMyConfirmedOrders } from '../redux/slices/orderSlice';
import { Link, useLocation } from 'react-router-dom';

// Helper for image URL
const getImageUrl = (image) => {
    if (!image) return null;
    if (typeof image === 'string') {
        if (image.startsWith('http')) return image;
        if (image.startsWith('/')) return `http://localhost:5000${image}`;
        return `http://localhost:5000/uploads/${image}`;
    }
    return URL.createObjectURL(image);
};

const Profile = () => {
    const dispatch = useDispatch();
    const { user: authUser } = useSelector((state) => state.auth || {});
    const { selectedUser, loading, detailLoading } = useSelector((state) => state.user);
    const { addresses, loading: addressLoading } = useSelector((state) => state.address);
    const { items: wishlistItems, loading: wishlistLoading } = useSelector((state) => state.wishlist || {});
    const { confirmedOrders, loading: orderLoading } = useSelector((state) => state.order || {});
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'personal');
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    const fileInputRef = React.useRef(null);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
            setIsEditing(true);
            setActiveTab('personal');
        }
    };

    useEffect(() => {
        if (authUser?._id || authUser?.data?._id) {
            const userId = authUser._id || authUser.data._id;
            dispatch(getUserById(userId));
        }
    }, [dispatch, authUser]);

    useEffect(() => {
        const userId = authUser?._id || authUser?.data?._id;
        if (activeTab === 'address' && userId) {
            dispatch(getAllAddress(userId));
        }
        if (activeTab === 'wishlist' && userId) {
            dispatch(getWishlist());
        }
        if (activeTab === 'orders' && userId) {
            dispatch(getMyConfirmedOrders());
        }
    }, [dispatch, activeTab, authUser]);

    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]);

    if (!authUser) return null;

    if (detailLoading) {
        return (
            <div className="min-h-screen bg-[#F0F2F5] pb-20">
                <Header />
                <div className="flex items-center justify-center h-[calc(100vh-80px)]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-muted font-bold animate-pulse italic font-serif">Loading your profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    const user = selectedUser || authUser?.data || authUser || {};

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: <FiUser /> },
        { id: 'orders', label: 'My Orders', icon: <FiPackage /> },
        { id: 'wishlist', label: 'Wishlist', icon: <FiHeart /> },
        { id: 'address', label: 'Address', icon: <FiMapPin /> },
        { id: 'security', label: 'Security', icon: <FiShield /> },
    ];

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        mobileNo: Yup.string(),
    });

    const initialValues = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        mobileNo: user.mobileNo || '',
    };

    const handleUpdateProfile = (values) => {
        const userId = user._id || user.id;
        if (!userId) {
            toast.error("User ID not found!");
            return;
        }

        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value);
        });

        if (selectedPhoto) {
            formData.append('photo', selectedPhoto);
        }

        dispatch(updateUser({ id: userId, userData: formData }))
            .unwrap()
            .then(() => {
                setIsEditing(false);
                setSelectedPhoto(null);
                setPhotoPreview(null);
                toast.success("Profile updated successfully!");
            })
            .catch((err) => {
                console.error("Update failed:", err);
                toast.error(err || "Update failed");
            });
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        const userId = user._id || user.id;

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New passwords do not match!");
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        setIsPasswordLoading(true);
        dispatch(changePassword({
            id: userId,
            passwordData: {
                oldPassword: passwordForm.oldPassword,
                newPassword: passwordForm.newPassword
            }
        }))
            .unwrap()
            .then(() => {
                toast.success("Password changed successfully!");
                setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                setIsPasswordLoading(false);
            })
            .catch((err) => {
                toast.error(err || "Failed to change password");
                setIsPasswordLoading(false);
            });
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className=" bg-[#F0F2F5] pb-14">
            <Header />

            {/* Elegant Background Header */}
            <div className="h-64 w-full bg-gradient-to-r from-orange-500 via-primary to-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[100%] bg-accent rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[100%] bg-amber-200 rounded-full blur-[120px]" />
                </div>
                <div className="custom-container h-full flex items-end pb-20">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight"
                    >
                        My Account
                    </motion.h1>
                </div>
            </div>

            <div className="custom-container -mt-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sidebar Navigation */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="lg:col-span-3 space-y-4"
                    >
                        <div className="bg-white rounded-xl shadow-xl shadow-gray-200/50 p-6 border border-orange-300 overflow-hidden relative">
                            <div className="flex flex-col items-center mb-8">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-orange-400 to-amber-200 p-1 mb-4">
                                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                            {photoPreview || user.photo ? (
                                                <img
                                                    src={photoPreview || getImageUrl(user.photo)}
                                                    alt={`${user.firstName} ${user.lastName}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-3xl font-serif font-bold text-primary italic">
                                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-4 right-0 p-2 bg-white rounded-full shadow-lg text-primary hover:text-orange-500 transition-colors border border-gray-100"
                                    >
                                        <FiEdit2 size={14} />
                                    </button>
                                </div>
                                <h2 className="text-xl font-bold text-primary">{user.firstName} {user.lastName}</h2>
                                <p className="text-sm text-muted">{user.email}</p>
                            </div>

                            <nav className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            setActiveTab(tab.id);
                                            setIsEditing(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === tab.id
                                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200'
                                            : 'text-muted hover:bg-gray-50 hover:text-orange-500'
                                            }`}
                                    >
                                        <span className={activeTab === tab.id ? 'text-white' : 'text-orange-500'}>
                                            {tab.icon}
                                        </span>
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </motion.div>

                    {/* Main Content Area */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="lg:col-span-9"
                    >
                        <div className="bg-white rounded-xl shadow-xl shadow-gray-200/50 border border-orange-300 overflow-hidden">
                            {activeTab === 'personal' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-8 md:p-12"
                                >
                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={validationSchema}
                                        onSubmit={handleUpdateProfile}
                                        enableReinitialize
                                    >
                                        {({ errors, touched, values, handleReset }) => (
                                            <Form>
                                                <div className="flex items-center justify-between mb-12">
                                                    <div>
                                                        <h3 className="text-3xl font-bold text-primary mb-2 font-serif">Personal Information</h3>
                                                        <p className="text-muted font-medium">Manage your personal details and account preferences.</p>
                                                    </div>
                                                    {!isEditing ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsEditing(true)}
                                                            className="flex items-center gap-2 px-8 py-3 rounded-2xl border-2 border-primary font-bold text-primary hover:bg-primary hover:text-white transition-all duration-500 group shadow-lg shadow-gray-100 hover:shadow-primary/20"
                                                        >
                                                            <FiEdit2 size={16} className="group-hover:rotate-12 transition-transform" /> Edit Profile
                                                        </button>
                                                    ) : (
                                                        <div className="flex items-center gap-4">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setIsEditing(false);
                                                                    setSelectedPhoto(null);
                                                                    setPhotoPreview(null);
                                                                    handleReset();
                                                                }}
                                                                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-muted hover:text-red-500 transition-all font-bold hover:bg-red-50"
                                                            >
                                                                <FiX size={20} /> Cancel
                                                            </button>
                                                            <button
                                                                type="submit"
                                                                disabled={loading}
                                                                className="flex items-center gap-3 px-8 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 font-bold text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-500 shadow-xl shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                                                            >
                                                                {loading ? (
                                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                                ) : (
                                                                    <FiSave size={20} />
                                                                )}
                                                                {loading ? 'Saving...' : 'Save Changes'}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                    <div className="space-y-8">
                                                        <div className="group">
                                                            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted mb-3 block group-focus-within:text-orange-600 transition-all duration-300">
                                                                First Name
                                                            </label>
                                                            {isEditing ? (
                                                                <div className="relative group/input">
                                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within/input:text-orange-500 transition-colors duration-300">
                                                                        <FiUser size={18} />
                                                                    </div>
                                                                    <Field
                                                                        name="firstName"
                                                                        className={`w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-2 ${errors.firstName && touched.firstName ? 'border-red-200 bg-red-50/30' : 'border-gray-50 focus:border-orange-500'} outline-none transition-all duration-500 font-semibold text-primary shadow-sm hover:border-gray-200 focus:shadow-[0_0_20px_rgba(249,115,22,0.15)] group-focus-within/input:-translate-y-0.5`}
                                                                        placeholder="Enter first name"
                                                                    />
                                                                    <div className="absolute inset-0 rounded-2xl bg-orange-500/5 opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none" />
                                                                    <ErrorMessage name="firstName" component="div" className="text-red-500 text-[10px] absolute -bottom-6 left-1 font-bold flex items-center gap-1" />
                                                                </div>
                                                            ) : (
                                                                <div className="p-4 bg-orange-50/30 border-2 border-transparent rounded-2xl flex items-center gap-4 font-semibold text-primary transition-all hover:bg-orange-50/50 group/view">
                                                                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500 group-hover/view:scale-110 transition-transform">
                                                                        <FiUser size={20} />
                                                                    </div>
                                                                    <span className="tracking-tight">{user.firstName || 'Not provided'}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="group">
                                                            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted mb-3 block group-focus-within:text-orange-600 transition-all duration-300">
                                                                Email Address
                                                            </label>
                                                            {isEditing ? (
                                                                <div className="relative group/input">
                                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within/input:text-orange-500 transition-colors duration-300">
                                                                        <FiMail size={18} />
                                                                    </div>
                                                                    <Field
                                                                        name="email"
                                                                        type="email"
                                                                        className={`w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-2 ${errors.email && touched.email ? 'border-red-200 bg-red-50/30' : 'border-gray-50 focus:border-orange-500'} outline-none transition-all duration-500 font-semibold text-primary shadow-sm hover:border-gray-200 focus:shadow-[0_0_20px_rgba(249,115,22,0.15)] group-focus-within/input:-translate-y-0.5`}
                                                                        placeholder="Enter email address"
                                                                    />
                                                                    <div className="absolute inset-0 rounded-2xl bg-orange-500/5 opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none" />
                                                                    <ErrorMessage name="email" component="div" className="text-red-500 text-[10px] absolute -bottom-6 left-1 font-bold" />
                                                                </div>
                                                            ) : (
                                                                <div className="p-4 bg-orange-50/30 border-2 border-transparent rounded-2xl flex items-center gap-4 font-semibold text-primary transition-all hover:bg-orange-50/50 group/view">
                                                                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500 group-hover/view:scale-110 transition-transform">
                                                                        <FiMail size={20} />
                                                                    </div>
                                                                    <span className="tracking-tight">{user.email}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-8">
                                                        <div className="group">
                                                            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted mb-3 block group-focus-within:text-orange-600 transition-all duration-300">
                                                                Last Name
                                                            </label>
                                                            {isEditing ? (
                                                                <div className="relative group/input">
                                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within/input:text-orange-500 transition-colors duration-300">
                                                                        <FiUser size={18} />
                                                                    </div>
                                                                    <Field
                                                                        name="lastName"
                                                                        className={`w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-2 ${errors.lastName && touched.lastName ? 'border-red-200 bg-red-50/30' : 'border-gray-50 focus:border-orange-500'} outline-none transition-all duration-500 font-semibold text-primary shadow-sm hover:border-gray-200 focus:shadow-[0_0_20px_rgba(249,115,22,0.15)] group-focus-within/input:-translate-y-0.5`}
                                                                        placeholder="Enter last name"
                                                                    />
                                                                    <div className="absolute inset-0 rounded-2xl bg-orange-500/5 opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none" />
                                                                    <ErrorMessage name="lastName" component="div" className="text-red-500 text-[10px] absolute -bottom-6 left-1 font-bold" />
                                                                </div>
                                                            ) : (
                                                                <div className="p-4 bg-orange-50/30 border-2 border-transparent rounded-2xl flex items-center gap-4 font-semibold text-primary transition-all hover:bg-orange-50/50 group/view">
                                                                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500 group-hover/view:scale-110 transition-transform">
                                                                        <FiUser size={20} />
                                                                    </div>
                                                                    <span className="tracking-tight">{user.lastName || 'Not provided'}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="group">
                                                            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted mb-3 block group-focus-within:text-orange-600 transition-all duration-300">
                                                                Phone Number
                                                            </label>
                                                            {isEditing ? (
                                                                <div className="relative group/input">
                                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within/input:text-orange-500 transition-colors duration-300">
                                                                        <FiPhone size={18} />
                                                                    </div>
                                                                    <Field
                                                                        name="mobileNo"
                                                                        className={`w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-2 ${errors.mobileNo && touched.mobileNo ? 'border-red-200 bg-red-50/30' : 'border-gray-50 focus:border-orange-500'} outline-none transition-all duration-500 font-semibold text-primary shadow-sm hover:border-gray-200 focus:shadow-[0_0_20px_rgba(249,115,22,0.15)] group-focus-within/input:-translate-y-0.5`}
                                                                        placeholder="Enter phone number"
                                                                    />
                                                                    <div className="absolute inset-0 rounded-2xl bg-orange-500/5 opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none" />
                                                                    <ErrorMessage name="mobileNo" component="div" className="text-red-500 text-[10px] absolute -bottom-6 left-1 font-bold" />
                                                                </div>
                                                            ) : (
                                                                <div className="p-4 bg-orange-50/30 border-2 border-transparent rounded-2xl flex items-center gap-4 font-semibold text-primary transition-all hover:bg-orange-50/50 group/view">
                                                                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500 group-hover/view:scale-110 transition-transform">
                                                                        <FiPhone size={20} />
                                                                    </div>
                                                                    <span className="tracking-tight">{user.mobileNo}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-12 p-6 bg-orange-50 rounded-3xl border border-orange-100 flex items-center gap-6">
                                                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-orange-500">
                                                        <FiCheckCircle size={32} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-primary italic font-serif">Verified Identity</h4>
                                                        <p className="text-sm text-muted">Your account information is encrypted and protected by our secure server.</p>
                                                    </div>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </motion.div>
                            )}

                            {activeTab === 'address' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-8 md:p-12"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-3xl font-bold text-primary mb-2 font-serif">Manage Addresses</h3>
                                            <p className="text-muted font-medium">Add, edit or remove your delivery addresses.</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setEditingAddress(null);
                                                setIsAddingAddress(true);
                                            }}
                                            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
                                        >
                                            <FiPlus size={20} /> Add New
                                        </button>
                                    </div>

                                    {isAddingAddress || editingAddress ? (
                                        <div className="bg-orange-50/30 border-2 border-orange-100 rounded-[2rem] p-8">
                                            <h4 className="text-xl font-bold text-primary mb-6 italic font-serif">
                                                {editingAddress ? 'Edit Address' : 'Add New Address'}
                                            </h4>
                                            <Formik
                                                initialValues={editingAddress || {
                                                    fullName: '',
                                                    mobileNo: '',
                                                    addressLine: '',
                                                    city: '',
                                                    state: '',
                                                    pincode: '',
                                                    addressType: 'Home',
                                                    isDefault: false
                                                }}
                                                validationSchema={Yup.object().shape({
                                                    fullName: Yup.string().required('Required'),
                                                    mobileNo: Yup.string().required('Required'),
                                                    addressLine: Yup.string().required('Required'),
                                                    city: Yup.string().required('Required'),
                                                    state: Yup.string().required('Required'),
                                                    pincode: Yup.string().required('Required'),
                                                })}
                                                onSubmit={(values) => {
                                                    const userId = authUser._id || authUser.data?._id;
                                                    if (editingAddress) {
                                                        dispatch(updateAddressById({ id: editingAddress._id, addressData: values }));
                                                    } else {
                                                        dispatch(createAddress({ ...values, user: userId }));
                                                    }
                                                    setIsAddingAddress(false);
                                                    setEditingAddress(null);
                                                }}
                                            >
                                                {({ errors, touched }) => (
                                                    <Form className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                                        <div className="space-y-8">
                                                            <div className="group">
                                                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted mb-3 block group-focus-within:text-orange-600 transition-all duration-300">Full Name</label>
                                                                <div className="relative group/input">
                                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within/input:text-orange-500 transition-colors duration-300">
                                                                        <FiUser size={18} />
                                                                    </div>
                                                                    <Field
                                                                        name="fullName"
                                                                        className={`w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-2 ${errors.fullName && touched.fullName ? 'border-red-200 bg-red-50/30' : 'border-gray-50 focus:border-orange-500'} outline-none transition-all duration-500 font-semibold text-primary shadow-sm hover:border-gray-200 focus:shadow-[0_0_20px_rgba(249,115,22,0.15)] group-focus-within/input:-translate-y-0.5`}
                                                                        placeholder="e.g. John Doe"
                                                                    />
                                                                    <div className="absolute inset-0 rounded-2xl bg-orange-500/5 opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none" />
                                                                    <ErrorMessage name="fullName" component="div" className="text-red-500 text-[10px] absolute -bottom-6 left-1 font-bold" />
                                                                </div>
                                                            </div>

                                                            <div className="group">
                                                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted mb-3 block group-focus-within:text-orange-600 transition-all duration-300">Mobile Number</label>
                                                                <div className="relative group/input">
                                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within/input:text-orange-500 transition-colors duration-300">
                                                                        <FiPhone size={18} />
                                                                    </div>
                                                                    <Field
                                                                        name="mobileNo"
                                                                        className={`w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-2 ${errors.mobileNo && touched.mobileNo ? 'border-red-200 bg-red-50/30' : 'border-gray-50 focus:border-orange-500'} outline-none transition-all duration-500 font-semibold text-primary shadow-sm hover:border-gray-200 focus:shadow-[0_0_20px_rgba(249,115,22,0.15)] group-focus-within/input:-translate-y-0.5`}
                                                                        placeholder="e.g. 1234567890"
                                                                    />
                                                                    <div className="absolute inset-0 rounded-2xl bg-orange-500/5 opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none" />
                                                                    <ErrorMessage name="mobileNo" component="div" className="text-red-500 text-[10px] absolute -bottom-6 left-1 font-bold" />
                                                                </div>
                                                            </div>

                                                            <div className="group">
                                                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted mb-3 block group-focus-within:text-orange-600 transition-all duration-300">Pincode</label>
                                                                <div className="relative group/input">
                                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within/input:text-orange-500 transition-colors duration-300">
                                                                        <FiHash size={18} />
                                                                    </div>
                                                                    <Field
                                                                        name="pincode"
                                                                        className={`w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-2 ${errors.pincode && touched.pincode ? 'border-red-200 bg-red-50/30' : 'border-gray-50 focus:border-orange-500'} outline-none transition-all duration-500 font-semibold text-primary shadow-sm hover:border-gray-200 focus:shadow-[0_0_20px_rgba(249,115,22,0.15)] group-focus-within/input:-translate-y-0.5`}
                                                                        placeholder="6-digit code"
                                                                    />
                                                                    <div className="absolute inset-0 rounded-2xl bg-orange-500/5 opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none" />
                                                                    <ErrorMessage name="pincode" component="div" className="text-red-500 text-[10px] absolute -bottom-6 left-1 font-bold" />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-8">
                                                            <div className="group">
                                                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted mb-3 block group-focus-within:text-orange-600 transition-all duration-300">Address (Area and Street)</label>
                                                                <div className="relative group/input">
                                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within/input:text-orange-500 transition-colors duration-300">
                                                                        <FiHome size={18} />
                                                                    </div>
                                                                    <Field
                                                                        name="addressLine"
                                                                        className={`w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-2 ${errors.addressLine && touched.addressLine ? 'border-red-200 bg-red-50/30' : 'border-gray-50 focus:border-orange-500'} outline-none transition-all duration-500 font-semibold text-primary shadow-sm hover:border-gray-200 focus:shadow-[0_0_20px_rgba(249,115,22,0.15)] group-focus-within/input:-translate-y-0.5`}
                                                                        placeholder="House No, Building, Street"
                                                                    />
                                                                    <div className="absolute inset-0 rounded-2xl bg-orange-500/5 opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none" />
                                                                    <ErrorMessage name="addressLine" component="div" className="text-red-500 text-[10px] absolute -bottom-6 left-1 font-bold" />
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-6">
                                                                <div className="group">
                                                                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted mb-3 block group-focus-within:text-orange-600 transition-all duration-300">City</label>
                                                                    <div className="relative group/input">
                                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within/input:text-orange-500 transition-colors duration-300">
                                                                            <FiMapPin size={18} />
                                                                        </div>
                                                                        <Field
                                                                            name="city"
                                                                            placeholder="e.g. City"
                                                                            className={`w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-2 ${errors.city && touched.city ? 'border-red-200 bg-red-50/30' : 'border-gray-50 focus:border-orange-500'} outline-none transition-all duration-500 font-semibold text-primary shadow-sm hover:border-gray-200 focus:shadow-[0_0_20px_rgba(249,115,22,0.15)] group-focus-within/input:-translate-y-0.5`}
                                                                        />
                                                                        <div className="absolute inset-0 rounded-2xl bg-orange-500/5 opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none" />
                                                                        <ErrorMessage name="city" component="div" className="text-red-500 text-[10px] absolute -bottom-6 left-1 font-bold" />
                                                                    </div>
                                                                </div>
                                                                <div className="group">
                                                                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted mb-3 block group-focus-within:text-orange-600 transition-all duration-300">State</label>
                                                                    <div className="relative group/input">
                                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within/input:text-orange-500 transition-colors duration-300">
                                                                            <FiGlobe size={18} />
                                                                        </div>
                                                                        <Field
                                                                            name="state"
                                                                            placeholder="e.g. Gujarat"
                                                                            className={`w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-2 ${errors.state && touched.state ? 'border-red-200 bg-red-50/30' : 'border-gray-50 focus:border-orange-500'} outline-none transition-all duration-500 font-semibold text-primary shadow-sm hover:border-gray-200 focus:shadow-[0_0_20px_rgba(249,115,22,0.15)] group-focus-within/input:-translate-y-0.5`}
                                                                        />
                                                                        <div className="absolute inset-0 rounded-2xl bg-orange-500/5 opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none" />
                                                                        <ErrorMessage name="state" component="div" className="text-red-500 text-[10px] absolute -bottom-6 left-1 font-bold" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-4 pt-2">
                                                                {['Home', 'Office', 'Other'].map((type) => (
                                                                    <label key={type} className="flex-1">
                                                                        <Field type="radio" name="addressType" value={type} className="hidden peer" />
                                                                        <div className="py-2 text-center rounded-xl border-2 border-gray-100 peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:text-orange-600 transition-all font-bold text-xs cursor-pointer text-muted hover:bg-gray-50">
                                                                            {type}
                                                                        </div>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="md:col-span-2 flex items-center justify-between mt-4">
                                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                                <Field type="checkbox" name="isDefault" className="w-5 h-5 rounded-md border-2 border-gray-200 text-orange-500 focus:ring-orange-500" />
                                                                <span className="text-sm font-bold text-muted group-hover:text-primary transition-colors">Set as default address</span>
                                                            </label>
                                                            <div className="flex gap-4">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setIsAddingAddress(false);
                                                                        setEditingAddress(null);
                                                                    }}
                                                                    className="px-6 py-3 font-bold text-muted hover:text-red-500 transition-colors"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    type="submit"
                                                                    className="px-10 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-black transition-all shadow-lg"
                                                                >
                                                                    {editingAddress ? 'Update Address' : 'Save Address'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </Form>
                                                )}
                                            </Formik>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {addressLoading ? (
                                                <div className="md:col-span-2 flex justify-center py-20">
                                                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                                </div>
                                            ) : addresses.length > 0 ? (
                                                addresses.map((addr) => (
                                                    <div key={addr._id} className="group relative bg-white border-2 border-gray-100 p-6 rounded-3xl hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-500">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`p-2 rounded-xl ${addr.addressType === 'Home' ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'}`}>
                                                                    {addr.addressType === 'Home' ? <FiHome size={18} /> : <FiBriefcase size={18} />}
                                                                </div>
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted">{addr.addressType}</span>
                                                                {addr.isDefault && (
                                                                    <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded-lg uppercase tracking-tight">Default</span>
                                                                )}
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => setEditingAddress(addr)}
                                                                    className="p-2 text-muted hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                                                                >
                                                                    <FiEdit2 size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        if (window.confirm('Delete this address?')) {
                                                                            dispatch(deleteAddressById(addr._id));
                                                                        }
                                                                    }}
                                                                    className="p-2 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                                >
                                                                    <FiTrash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <h5 className="font-bold text-primary mb-1">{addr.fullName}</h5>
                                                        <p className="text-sm text-primary mb-3 font-semibold">{addr.mobileNo}</p>
                                                        <p className="text-sm text-muted leading-relaxed mb-1">
                                                            {addr.addressLine}
                                                        </p>
                                                        <p className="text-sm text-muted">
                                                            {addr.city}, {addr.state} - <span className="font-bold text-primary">{addr.pincode}</span>
                                                        </p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="md:col-span-2 border-2 border-dashed border-gray-200 rounded-[2.5rem] p-20 text-center bg-gray-50/50">
                                                    <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6 text-orange-400">
                                                        <FiMapPin size={32} />
                                                    </div>
                                                    <h4 className="text-2xl font-bold text-primary mb-2 italic font-serif">No Saved Addresses</h4>
                                                    <p className="text-muted mb-8 max-w-xs mx-auto">You haven't added any delivery addresses yet. Add one to speed up your checkout process.</p>
                                                    <button
                                                        onClick={() => setIsAddingAddress(true)}
                                                        className="px-8 py-3 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 mx-auto hover:bg-black transition-all shadow-xl"
                                                    >
                                                        <FiPlus /> Add First Address
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'wishlist' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-8 md:p-12"
                                >
                                    <div className="mb-8">
                                        <h3 className="text-3xl font-bold text-primary mb-2 font-serif">My Wishlist</h3>
                                        <p className="text-muted font-medium">Your favorite pieces saved for later.</p>
                                    </div>

                                    {wishlistLoading ? (
                                        <div className="flex justify-center py-20">
                                            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    ) : wishlistItems?.length > 0 ? (
                                        <div className="max-h-[450px] overflow-y-auto pr-2">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {wishlistItems.map((item) => (
                                                    <motion.div
                                                        key={item._id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9 }}
                                                        transition={{ duration: 0.4 }}
                                                        className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 border border-orange-100 shadow-[0_12px_20px_-10px_rgba(249,115,22,0.15)] hover:shadow-[0_15px_30px_-10px_rgba(249,115,22,0.3)] hover:border-orange-300"
                                                    >
                                                        {/* Image Link */}
                                                        <div className="relative h-48 overflow-hidden bg-gray-50">
                                                            <Link to={`/product-details/${item._id}`} className="block w-full h-full">
                                                                <img
                                                                    src={item.images && item.images.length > 0 ? getImageUrl(item.images[0]) : ''}
                                                                    alt={item.titleName}
                                                                    className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
                                                                />
                                                                {/* Subtle Overlay on Hover */}
                                                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                            </Link>

                                                            {/* Category Badge - Top Left */}
                                                            {item.category && (
                                                                <div className="absolute top-4 left-4 z-10">
                                                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-orange-600 text-[10px] font-black tracking-wider rounded-full shadow-sm">
                                                                        {item.category}
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {/* Action Buttons - Heart and Eye Icons sliding in */}
                                                            <div className="absolute top-4 right-4 flex flex-col gap-3 translate-x-12 group-hover:translate-x-0 transition-all duration-500 z-20">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        dispatch(removeFromWishlist(item._id));
                                                                        toast.success("Removed from wishlist");
                                                                    }}
                                                                    className="p-3 bg-white rounded-full text-orange-500 hover:text-red-500 hover:scale-110 transition-all shadow-xl flex items-center justify-center"
                                                                >
                                                                    <FiHeart size={20} fill="currentColor" />
                                                                </button>
                                                                <Link
                                                                    to={`/product-details/${item._id}`}
                                                                    className="p-3 bg-white rounded-full text-gray-400 hover:text-orange-500 hover:scale-110 transition-all shadow-xl flex items-center justify-center"
                                                                >
                                                                    <FiEye size={20} />
                                                                </Link>
                                                            </div>
                                                        </div>

                                                        {/* Content */}
                                                        <div className="p-3">
                                                            <div className="flex flex-col gap-1">
                                                                <Link to={`/product-details/${item._id}`}>
                                                                    <h3 className="text-xl font-serif font-black text-orange-600 transition-colors line-clamp-1">
                                                                        {item.titleName}
                                                                    </h3>
                                                                </Link>
                                                            </div>
                                                            <p className="text-gray-500 text-sm line-clamp-1 mt-1 font-medium leading-relaxed">
                                                                {item.description}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-200 rounded-[2.5rem] p-20 text-center bg-gray-50/50">
                                            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6 text-orange-400">
                                                <FiHeart size={32} />
                                            </div>
                                            <h4 className="text-2xl font-bold text-primary mb-2 italic font-serif">Wishlist is Empty</h4>
                                            <p className="text-muted mb-8 max-w-xs mx-auto">You haven't added any pieces to your wishlist yet. Discover new designs in our collections.</p>
                                            <Link
                                                to="/shop"
                                                className="inline-flex px-8 py-3 bg-primary text-white rounded-2xl font-bold items-center gap-2 hover:bg-black transition-all shadow-xl"
                                            >
                                                Explore Gallery
                                            </Link>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'security' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-8 md:p-12"
                                >
                                    <div className="mb-10">
                                        <h3 className="text-3xl font-bold text-primary mb-2 font-serif">Security Settings</h3>
                                        <p className="text-muted font-medium">Keep your account safe by updating your password regularly.</p>
                                    </div>

                                    <div className="">
                                        <form onSubmit={handlePasswordChange} className="space-y-8">
                                            {/* Current Password */}
                                            <div className="group">
                                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted mb-3 block group-focus-within:text-orange-600 transition-all duration-300">
                                                    Current Password
                                                </label>
                                                <div className="relative group/input">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within/input:text-orange-500 transition-colors duration-300">
                                                        <FiLock size={18} />
                                                    </div>
                                                    <input
                                                        type={showPasswords.old ? "text" : "password"}
                                                        value={passwordForm.oldPassword}
                                                        onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                                                        required
                                                        placeholder="Enter current password"
                                                        className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border-2 border-gray-50 focus:border-orange-500 outline-none transition-all duration-500 font-semibold text-primary shadow-sm hover:border-gray-200 focus:shadow-[0_0_20px_rgba(249,115,22,0.15)] group-focus-within/input:-translate-y-0.5"
                                                    />
                                                    <div className="absolute inset-0 rounded-2xl bg-orange-500/5 opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-orange-500 transition-colors z-10"
                                                    >
                                                        {showPasswords.old ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* New Password Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div className="group">
                                                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted mb-3 block group-focus-within:text-orange-600 transition-all duration-300">
                                                        New Password
                                                    </label>
                                                    <div className="relative group/input">
                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within/input:text-orange-500 transition-colors duration-300">
                                                            <FiLock size={18} />
                                                        </div>
                                                        <input
                                                            type={showPasswords.new ? "text" : "password"}
                                                            value={passwordForm.newPassword}
                                                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                            required
                                                            placeholder="New password"
                                                            className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border-2 border-gray-50 focus:border-orange-500 outline-none transition-all duration-500 font-semibold text-primary shadow-sm hover:border-gray-200 focus:shadow-[0_0_20px_rgba(249,115,22,0.15)] group-focus-within/input:-translate-y-0.5"
                                                        />
                                                        <div className="absolute inset-0 rounded-2xl bg-orange-500/5 opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none" />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-orange-500 transition-colors z-10"
                                                        >
                                                            {showPasswords.new ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="group">
                                                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted mb-3 block group-focus-within:text-orange-600 transition-all duration-300">
                                                        Confirm Password
                                                    </label>
                                                    <div className="relative group/input">
                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within/input:text-orange-500 transition-colors duration-300">
                                                            <FiLock size={18} />
                                                        </div>
                                                        <input
                                                            type={showPasswords.confirm ? "text" : "password"}
                                                            value={passwordForm.confirmPassword}
                                                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                            required
                                                            placeholder="Confirm password"
                                                            className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border-2 border-gray-50 focus:border-orange-500 outline-none transition-all duration-500 font-semibold text-primary shadow-sm hover:border-gray-200 focus:shadow-[0_0_20px_rgba(249,115,22,0.15)] group-focus-within/input:-translate-y-0.5"
                                                        />
                                                        <div className="absolute inset-0 rounded-2xl bg-orange-500/5 opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none" />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-orange-500 transition-colors z-10"
                                                        >
                                                            {showPasswords.confirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isPasswordLoading}
                                                className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 font-bold text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-500 shadow-xl shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {isPasswordLoading ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <FiSave size={20} />
                                                )}
                                                {isPasswordLoading ? 'Updating...' : 'Update Password'}
                                            </button>
                                        </form>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'orders' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-8 md:p-12"
                                >
                                    <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                                        <div>
                                            <h3 className="text-4xl font-bold text-primary mb-3 font-serif italic tracking-tight">Order History</h3>
                                            <p className="text-muted font-medium max-w-sm leading-relaxed">A curated log of your acquired masterpieces and artistic collection.</p>
                                        </div>
                                        <div className="flex items-center gap-3 px-6 py-3 bg-orange-50 rounded-2xl border border-orange-100">
                                            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-200">
                                                <FiPackage size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-orange-600/50">Total Orders</p>
                                                <p className="text-lg font-black text-primary leading-none">{confirmedOrders?.length || 0}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {orderLoading ? (
                                        <div className="flex flex-col items-center justify-center py-32 space-y-4">
                                            <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                                            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-orange-600/40">Synchronizing Vault...</p>
                                        </div>
                                    ) : confirmedOrders?.length > 0 ? (
                                        <div className="space-y-8 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
                                            {confirmedOrders.map((order) => (
                                                <div key={order._id} className="group relative bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden hover:shadow-[0_20px_50px_rgba(249,115,22,0.1)] transition-all duration-500">
                                                    {/* Status Banner */}
                                                    <div className="absolute top-0 right-0 p-8">
                                                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${order.paymentStatus === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                                                            <div className={`w-1.5 h-1.5 rounded-full ${order.paymentStatus === 'Completed' ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500'}`} />
                                                            {order.paymentStatus}
                                                        </div>
                                                    </div>

                                                    <div className="p-8 md:p-10">
                                                        {/* Header Info */}
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10 pb-10 border-b border-gray-50">
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted mb-2">Reference ID</p>
                                                                <h4 className="text-xl font-bold text-primary tracking-tighter">#{order._id.slice(-8).toUpperCase()}</h4>
                                                            </div>
                                                            <div className="h-10 w-px bg-gray-100 hidden sm:block" />
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted mb-2">Acquisition Date</p>
                                                                <p className="text-sm font-bold text-primary">
                                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                                </p>
                                                            </div>
                                                            <div className="h-10 w-px bg-gray-100 hidden sm:block" />
                                                            <div className="flex-1 text-right">
                                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600/50 mb-2">Investment</p>
                                                                <p className="text-3xl font-black text-orange-600 tracking-tighter">₹{order.totalAmount}</p>
                                                            </div>
                                                        </div>

                                                        {/* Items Portfolio */}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                                            {order.items.map((item, idx) => (
                                                                <div key={idx} className="group/item relative flex gap-5 p-4 rounded-3xl bg-gray-50/30 border border-gray-50 hover:bg-white hover:border-orange-200 transition-all duration-300">
                                                                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-sm shadow-gray-200 group-hover/item:scale-105 transition-transform duration-500">
                                                                        <img src={item.image?.startsWith('http') ? item.image : `http://localhost:5000${item.image}`} className="w-full h-full object-cover" alt="" />
                                                                    </div>
                                                                    <div className="flex-1 py-1">
                                                                        <h5 className="font-bold text-primary text-sm line-clamp-1 group-hover/item:text-orange-600 transition-colors uppercase tracking-tight">{item.titleName}</h5>
                                                                        <p className="text-[10px] font-black text-muted uppercase mt-2 tracking-widest">{item.paperMaterial?.paperType} • x{item.quantity}</p>
                                                                        <div className="mt-3 flex items-center justify-between">
                                                                            <span className="text-xs font-black text-orange-500">₹{item.price}</span>
                                                                            <Link to={`/product-details/${item._id}`} className="text-[9px] font-black uppercase tracking-widest text-primary opacity-0 group-hover/item:opacity-100 transition-opacity">Show Piece</Link>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Bottom Meta */}
                                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-orange-50/30 rounded-3xl border border-orange-100/50">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-orange-500 shadow-sm border border-orange-100">
                                                                    <FiMapPin size={20} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-orange-600/50 mb-1">Destination</p>
                                                                    <p className="text-[11px] font-bold text-primary leading-tight">{order.shippingAddress?.fullName}, {order.shippingAddress?.city}</p>
                                                                </div>
                                                            </div>
                                                            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-orange-600 transition-colors p-2 group/btn">
                                                                Download Receipt
                                                                <FiSave className="group-hover/btn:translate-y-0.5 transition-transform" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="border-4 border-double border-gray-100 rounded-[3rem] p-24 text-center bg-gray-50/30">
                                            <motion.div
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl shadow-gray-200 flex items-center justify-center mx-auto mb-10 text-orange-400 rotate-12"
                                            >
                                                <FiShoppingBag size={40} />
                                            </motion.div>
                                            <h4 className="text-3xl font-serif font-black text-primary mb-4 italic tracking-tight">Your Portfolio is Vacant</h4>
                                            <p className="text-muted mb-10 max-w-sm mx-auto font-medium leading-relaxed">It seems you haven't acquired any masterpieces for your collection yet. Our gallery awaits your discovery.</p>
                                            <Link
                                                to="/shop"
                                                className="inline-flex px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs items-center gap-3 hover:bg-orange-600 hover:shadow-2xl hover:shadow-orange-200 transition-all active:scale-95"
                                            >
                                                Explore the Gallery
                                            </Link>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab !== 'personal' && activeTab !== 'address' && activeTab !== 'wishlist' && activeTab !== 'security' && activeTab !== 'orders' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-12 text-center"
                                >
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-muted">
                                        {tabs.find(t => t.id === activeTab)?.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-primary mb-2 italic font-serif">{tabs.find(t => t.id === activeTab)?.label}</h3>
                                    <p className="text-muted mb-8">This section is currently being updated with your dynamic data.</p>
                                    <button
                                        onClick={() => setActiveTab('personal')}
                                        className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:translate-y-[-2px] transition-all duration-300"
                                    >
                                        Back to Profile
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
