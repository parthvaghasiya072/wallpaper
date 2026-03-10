import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiUser, FiMail, FiPhone, FiEdit2, FiShield, FiPackage, FiHeart, FiSave, FiX, FiCheckCircle, FiMapPin, FiPlus, FiHome, FiBriefcase, FiMoreHorizontal, FiTrash2, FiEye } from 'react-icons/fi';
import Header from '../components/Header';
import toast from 'react-hot-toast';
import { getUserById, updateUser } from '../redux/slices/userSlice';
import { getAllAddress, createAddress, updateAddressById, deleteAddressById } from '../redux/slices/addressSlice';
import { getWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { Link, useLocation } from 'react-router-dom';

// Helper for image URL
const getImageUrl = (image) => {
    if (!image) return null;
    if (typeof image === 'string') {
        return image.startsWith('http') ? image : `http://localhost:5000/uploads/${image}`;
    }
    return URL.createObjectURL(image);
};

const Profile = () => {
    const dispatch = useDispatch();
    const { user: authUser } = useSelector((state) => state.auth || {});
    const { selectedUser, loading, detailLoading } = useSelector((state) => state.user);
    const { addresses, loading: addressLoading } = useSelector((state) => state.address);
    const { items: wishlistItems, loading: wishlistLoading } = useSelector((state) => state.wishlist || {});
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'personal');
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

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
            })
            .catch((err) => {
                console.error("Update failed:", err);
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
        <div className=" bg-[#F0F2F5] pb-20">
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
                                                        <h3 className="text-3xl font-bold text-primary mb-2 italic font-serif">Personal Information</h3>
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
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h3 className="text-3xl font-bold text-primary mb-2 italic font-serif">Manage Addresses</h3>
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
                                        <div className="bg-orange-50/30 border-2 border-orange-100 rounded-[2rem] p-8 mb-12">
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
                                                    <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-4">
                                                            <div>
                                                                <label className="text-[10px] font-black uppercase text-muted mb-2 block">Full Name</label>
                                                                <Field name="fullName" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition-all font-semibold" placeholder="e.g. John Doe" />
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] font-black uppercase text-muted mb-2 block">Mobile Number</label>
                                                                <Field name="mobileNo" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition-all font-semibold" placeholder="e.g. 9876543210" />
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] font-black uppercase text-muted mb-2 block">Pincode</label>
                                                                <Field name="pincode" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition-all font-semibold" placeholder="6-digit code" />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <label className="text-[10px] font-black uppercase text-muted mb-2 block">Address (Area and Street)</label>
                                                                <Field name="addressLine" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition-all font-semibold" placeholder="House No, Building, Street" />
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="text-[10px] font-black uppercase text-muted mb-2 block">City</label>
                                                                    <Field name="city" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition-all font-semibold" />
                                                                </div>
                                                                <div>
                                                                    <label className="text-[10px] font-black uppercase text-muted mb-2 block">State</label>
                                                                    <Field name="state" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition-all font-semibold" />
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
                                        <h3 className="text-3xl font-bold text-primary mb-2 italic font-serif">My Wishlist</h3>
                                        <p className="text-muted font-medium">Your favorite pieces saved for later.</p>
                                    </div>

                                    {wishlistLoading ? (
                                        <div className="flex justify-center py-20">
                                            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    ) : wishlistItems?.length > 0 ? (
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

                            {activeTab !== 'personal' && activeTab !== 'address' && activeTab !== 'wishlist' && (
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
