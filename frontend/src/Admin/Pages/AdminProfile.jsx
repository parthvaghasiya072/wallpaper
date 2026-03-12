import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    FiUser, FiMail, FiPhone, FiShield, FiCamera,
    FiEdit2, FiCheck, FiX, FiLock, FiCalendar,
    FiSettings, FiArrowLeft, FiLogOut, FiEye, FiEyeOff
} from 'react-icons/fi';
import { updateUser, changePassword } from '../../redux/slices/userSlice';
import toast from 'react-hot-toast';

const getImageUrl = (image) => {
    if (!image) return null;
    if (typeof image === 'string') {
        return image.startsWith('http') ? image : `http://localhost:5000/uploads/${image}`;
    }
    return URL.createObjectURL(image);
};

const AdminProfile = () => {
    const { isDark } = useOutletContext();
    const dispatch = useDispatch();
    const { user: authUser } = useSelector((state) => state.auth);
    const user = authUser?.data || authUser;

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        mobileNo: user?.mobileNo || '',
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(getImageUrl(user?.photo));

    // Password State
    const [isChangingPassword, setIsChangingPassword] = useState(false);
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

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                mobileNo: user.mobileNo || '',
            });
            setPreviewUrl(getImageUrl(user.photo));
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        const data = new FormData();
        data.append('firstName', formData.firstName);
        data.append('lastName', formData.lastName);
        data.append('email', formData.email);
        data.append('mobileNo', formData.mobileNo);
        if (selectedFile) {
            data.append('photo', selectedFile);
        }

        try {
            await dispatch(updateUser({ id: user._id, userData: data })).unwrap();
            setIsEditing(false);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error || "Failed to update profile");
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            return toast.error("New passwords do not match!");
        }

        if (passwordForm.newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters long");
        }

        try {
            await dispatch(changePassword({
                id: user._id,
                passwordData: {
                    oldPassword: passwordForm.oldPassword,
                    newPassword: passwordForm.newPassword
                }
            })).unwrap();

            toast.success("Password changed successfully!");
            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setIsChangingPassword(false);
        } catch (error) {
            toast.error(error || "Failed to change password");
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobileNo: user.mobileNo || '',
        });
        setPreviewUrl(getImageUrl(user.photo));
        setSelectedFile(null);
        setIsEditing(false);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen pb-20">
            {/* Immersive Header Cover */}
            <div className="relative h-48 sm:h-64 overflow-hidden rounded-[2.5rem] mb-[-4rem] z-0">
                <div className={`absolute inset-0 bg-gradient-to-r ${isDark ? 'from-indigo-600 via-purple-600 to-indigo-900' : 'from-indigo-500 via-purple-500 to-pink-500'
                    }`} />
                <div className="absolute inset-0 backdrop-blur-[100px] opacity-30" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 px-4 sm:px-8 max-w-6xl mx-auto"
            >
                {/* Profile Overview Header */}
                <div className="flex flex-col md:flex-row items-end gap-6 mb-12">
                    <motion.div variants={itemVariants} className="relative group">
                        <div className={`w-36 h-36 sm:w-44 sm:h-44 rounded-[2.5rem] overflow-hidden border-[6px] ${isDark ? 'border-[#0f172a]' : 'border-white'
                            } shadow-2xl relative`}>
                            {previewUrl ? (
                                <img src={previewUrl} alt="Admin" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center text-indigo-500">
                                    <FiUser size={64} />
                                </div>
                            )}

                            {isEditing && (
                                <motion.label
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white cursor-pointer transition-all hover:bg-black/50"
                                >
                                    <FiCamera size={32} className="mb-2" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Change Photo</span>
                                    <input type="file" className="hidden" onChange={handleFileChange} />
                                </motion.label>
                            )}
                        </div>
                    </motion.div>

                    <div className="flex-1 pb-2">
                        <motion.div variants={itemVariants} className="flex flex-col gap-1">
                            <h1 className={`text-3xl sm:text-5xl font-black tracking-tightest leading-tight ${isDark ? 'text-white' : 'text-slate-900'} title-font`}>
                                {user?.firstName} {user?.lastName}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 mt-1">
                                <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/30">
                                    <FiShield size={12} /> {user?.role}
                                </span>
                                <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${isDark ? 'bg-slate-800/50 border-slate-700 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
                                    }`}>
                                    <FiCalendar size={12} /> Joined {new Date(user?.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div variants={itemVariants} className="pb-2">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl group ${isDark
                                    ? 'bg-white text-slate-900 hover:bg-slate-100'
                                    : 'bg-slate-900 text-white hover:bg-slate-800'
                                    }`}
                            >
                                <FiEdit2 size={18} className="group-hover:rotate-12 transition-transform" />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleSave}
                                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20`}
                                >
                                    <FiCheck size={18} /> Save
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    <FiX size={18} /> Cancel
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 gap-8 mt-8">
                    {/* Main Info Section */}
                    <motion.div
                        variants={itemVariants}
                        className={`rounded-[2.5rem] border overflow-hidden p-8 sm:p-12 ${isDark ? 'bg-slate-900/40 border-slate-800/50 backdrop-blur-xl' : 'bg-white/80 border-slate-100 shadow-2xl shadow-slate-200/40 backdrop-blur-xl'
                            }`}
                    >
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                <FiSettings size={22} />
                            </div>
                            <div>
                                <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Account Settings</h3>
                                <p className={`text-xs font-bold uppercase tracking-widest opacity-40 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Update your personal details</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                            <ProfileField
                                label="First Name"
                                value={formData.firstName}
                                name="firstName"
                                icon={<FiUser />}
                                isEditing={isEditing}
                                isDark={isDark}
                                onChange={handleInputChange}
                            />
                            <ProfileField
                                label="Last Name"
                                value={formData.lastName}
                                name="lastName"
                                icon={<FiUser />}
                                isEditing={isEditing}
                                isDark={isDark}
                                onChange={handleInputChange}
                            />
                            <ProfileField
                                label="Email Address"
                                value={formData.email}
                                name="email"
                                icon={<FiMail />}
                                isEditing={isEditing}
                                isDark={isDark}
                                onChange={handleInputChange}
                            />
                            <ProfileField
                                label="Mobile Number"
                                value={formData.mobileNo}
                                name="mobileNo"
                                icon={<FiPhone />}
                                isEditing={isEditing}
                                isDark={isDark}
                                onChange={handleInputChange}
                            />
                        </div>
                    </motion.div>

                    {/* Optimized Security Section */}
                    <motion.div
                        variants={itemVariants}
                        className={`rounded-[3rem] border transition-all duration-700 ${isChangingPassword
                            ? 'border-indigo-500/40 shadow-2xl shadow-indigo-500/10'
                            : 'border-white/10 shadow-xl'
                            } ${isDark ? 'bg-slate-900/60' : 'bg-white/90'} backdrop-blur-2xl overflow-hidden`}
                    >
                        <div className="p-8 sm:p-12">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-inner transition-colors duration-500 ${isChangingPassword
                                        ? 'bg-indigo-500 text-white'
                                        : (isDark ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600')
                                        }`}>
                                        <FiShield />
                                    </div>
                                    <div>
                                        <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'} title-font`}>
                                            Security Keys
                                        </h3>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mt-1">
                                            Authentication Management
                                        </p>
                                    </div>
                                </div>

                                <AnimatePresence mode="wait">
                                    {!isChangingPassword ? (
                                        <motion.button
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            onClick={() => setIsChangingPassword(true)}
                                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isDark
                                                ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                                                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200'
                                                }`}
                                        >
                                            <FiLock /> Change Password
                                        </motion.button>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                            Update Mode Active
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <AnimatePresence>
                                {isChangingPassword && (
                                    <motion.form
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 30 }}
                                        onSubmit={handlePasswordChange}
                                        className="space-y-10"
                                    >
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            <PasswordField
                                                label="Old Password"
                                                name="oldPassword"
                                                value={passwordForm.oldPassword}
                                                onChange={handlePasswordInputChange}
                                                isDark={isDark}
                                                showPassword={showPasswords.old}
                                                onToggleVisibility={() => setShowPasswords(p => ({ ...p, old: !p.old }))}
                                            />
                                            <PasswordField
                                                label="New Password"
                                                name="newPassword"
                                                value={passwordForm.newPassword}
                                                onChange={handlePasswordInputChange}
                                                isDark={isDark}
                                                showPassword={showPasswords.new}
                                                onToggleVisibility={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                                            />
                                            <PasswordField
                                                label="Confirm New"
                                                name="confirmPassword"
                                                value={passwordForm.confirmPassword}
                                                onChange={handlePasswordInputChange}
                                                isDark={isDark}
                                                isMatch={passwordForm.confirmPassword && passwordForm.newPassword === passwordForm.confirmPassword}
                                                showPassword={showPasswords.confirm}
                                                onToggleVisibility={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                                            />
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                                            <button
                                                type="submit"
                                                className="w-full sm:w-auto px-12 py-5 rounded-2xl bg-indigo-500 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/30 hover:bg-indigo-600 hover:scale-[1.02] active:scale-95 transition-all"
                                            >
                                                Save New Password
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsChangingPassword(false);
                                                    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                                                }}
                                                className={`w-full sm:w-auto px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isDark
                                                    ? 'bg-slate-800 text-slate-400 hover:text-white'
                                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                    }`}
                                            >
                                                Cancel
                                            </button>
                                            <div className="hidden lg:flex items-center gap-2 ml-auto text-[10px] font-bold text-slate-500 opacity-60 uppercase tracking-widest">
                                                <FiShield /> Encryption active
                                            </div>
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>

                            {!isChangingPassword && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-4 p-6 rounded-3xl bg-indigo-500/[0.03] border border-indigo-500/10"
                                >
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className={`w-8 h-8 rounded-full border-2 ${isDark ? 'border-slate-900 bg-slate-800' : 'border-white bg-slate-100'} flex items-center justify-center text-[10px]`}>
                                                <FiLock size={12} className="text-indigo-400" />
                                            </div>
                                        ))}
                                    </div>
                                    <p className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                        Your account is protected by industry-standard hashing protocols.
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

const ProfileField = ({ label, value, name, icon, isEditing, isDark, onChange }) => (
    <div className="flex flex-col gap-3 group">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 flex items-center gap-2 group-focus-within:opacity-100 group-focus-within:text-indigo-500 transition-all">
            {icon} {label}
        </label>
        {isEditing ? (
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full px-6 py-4 rounded-2xl font-bold text-sm outline-none transition-all ring-4 ring-transparent focus:ring-indigo-500/10 ${isDark
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500 shadow-sm'
                    } border`}
            />
        ) : (
            <div className={`px-6 py-4 rounded-2xl font-bold text-sm border transition-all ${isDark
                ? 'bg-slate-800/30 border-slate-700/30 text-slate-400'
                : 'bg-slate-50/50 border-slate-100 text-slate-600'
                }`}>
                {value || 'Not provided'}
            </div>
        )}
    </div>
);

const PasswordField = ({ label, name, value, onChange, isDark, isMatch, showPassword, onToggleVisibility }) => (
    <div className="flex flex-col gap-3 group">
        <label className={`text-[10px] font-black uppercase tracking-widest opacity-40 px-1 flex items-center justify-between transition-all group-focus-within:opacity-100 group-focus-within:text-indigo-500`}>
            <span>{label}</span>
            {isMatch && <FiCheck className="text-emerald-500 animate-bounce" />}
        </label>
        <div className="relative group/input">
            <input
                type={showPassword ? "text" : "password"}
                name={name}
                value={value}
                onChange={onChange}
                required
                placeholder="••••••••"
                className={`w-full pl-6 pr-12 py-4 rounded-2xl font-bold text-sm outline-none transition-all ring-4 ring-transparent focus:ring-indigo-500/10 ${isDark
                    ? 'bg-slate-950/50 border-slate-700 text-white focus:border-indigo-500'
                    : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500 shadow-sm'
                    } border`}
            />
            <button
                type="button"
                onClick={onToggleVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors z-10"
            >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
        </div>
    </div>
);

export default AdminProfile;
