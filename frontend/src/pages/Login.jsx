import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loginUser, registerUser, forgotPassword, verifyOTP, resetPassword } from '../redux/slices/authSlice';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight, FiCheck, FiSend, FiShield, FiKey, FiX } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import AnimatedBackground from '../components/AnimatedBackground';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AnimatedInput = ({ icon: Icon, type, placeholder, value, onChange, name }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === 'password';

    return (
        <div className="w-full group">
            <div
                className={`flex items-center gap-3 px-4 py-3 sm:py-3.5 rounded-2xl transition-all duration-300 border backdrop-blur-md ${isFocused
                    ? 'bg-black/40 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.1)]'
                    : 'bg-black/20 border-white/5 hover:border-white/20'
                    }`}
            >
                <Icon className={`text-lg transition-colors duration-300 ${isFocused ? 'text-purple-400' : 'text-white/20'}`} />

                <input
                    type={isPasswordField ? (showPassword ? 'text' : 'password') : type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    name={name}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full bg-transparent text-white placeholder-white/20 outline-none text-sm"
                    autoComplete={isPasswordField ? "new-password" : "off"}
                    spellCheck="false"
                />

                {isPasswordField && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-white/20 hover:text-white/40 transition-colors px-1"
                    >
                        {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                )}
            </div>
        </div>
    );
};

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, user } = useSelector((state) => state.auth);

    const [isLogin, setIsLogin] = useState(true);
    const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('rememberedEmail'));
    const [showForgot, setShowForgot] = useState(false);
    const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP, 3: Reset
    const [forgotEmail, setForgotEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [resetUserId, setResetUserId] = useState(null);
    const [resetPasswords, setResetPasswords] = useState({ password: '', confirm: '' });

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: localStorage.getItem('rememberedEmail') || '',
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
    }, [user, navigate]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAuth = async (e) => {
        e.preventDefault();
        const { firstName, lastName, email, password, confirmPassword } = formData;

        if (isLogin) {
            if (!email || !password) return toast.error('Please fill in all fields');

            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            dispatch(loginUser({ email, password }));
        } else {
            if (!firstName || !lastName || !email || !password || !confirmPassword) return toast.error('Please fill in all fields');
            if (password !== confirmPassword) return toast.error('Passwords do not match');
            if (password.length < 6) return toast.error('Password must be at least 6 characters');

            const result = await dispatch(registerUser({ firstName, lastName, email, password }));
            if (registerUser.fulfilled.match(result)) setIsLogin(true);
        }
    };

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        if (forgotStep === 1) {
            if (!forgotEmail) return toast.error("Please enter your email");
            const result = await dispatch(forgotPassword(forgotEmail));
            if (forgotPassword.fulfilled.match(result)) setForgotStep(2);
        } else if (forgotStep === 2) {
            if (otp.length !== 6) return toast.error("Please enter valid 6-digit OTP");
            const result = await dispatch(verifyOTP({ email: forgotEmail, otp }));
            if (verifyOTP.fulfilled.match(result)) {
                setResetUserId(result.payload.userId);
                setForgotStep(3);
            }
        } else if (forgotStep === 3) {
            if (!resetPasswords.password || resetPasswords.password.length < 6) return toast.error("Password too short");
            if (resetPasswords.password !== resetPasswords.confirm) return toast.error("Passwords mismatch");
            const result = await dispatch(resetPassword({
                userId: resetUserId,
                newPassword: resetPasswords.password
            }));
            if (resetPassword.fulfilled.match(result)) {
                setShowForgot(false);
                setForgotStep(1);
                setResetUserId(null); // Clear for safety
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#060412] font-sans">

            <AnimatedBackground />

            <motion.div
                initial={{ opacity: 0, scale: 0.92, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-md mx-4"
            >
                <motion.div
                    layout
                    className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_32px_80px_-16px_rgba(0,0,0,0.8)] border border-white/20 bg-white/[0.08] backdrop-blur-[60px]"
                >
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-transparent via-white/[0.05] to-transparent pointer-events-none"
                        animate={{ x: ['-100%', '200%'], y: ['-100%', '200%'] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />

                    <div className="relative px-6 py-10 sm:px-10 sm:py-12">
                        <div className="flex flex-col items-center mb-8 sm:mb-10">
                            <motion.div
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center mb-4 sm:mb-6 shadow-[0_8px_40px_rgba(139,92,246,0.5)] relative group"
                                whileHover={{ scale: 1.05, rotate: 5 }}
                            >
                                <HiOutlineSparkles className="text-white text-3xl sm:text-4xl" />
                                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={showForgot ? 'forgot-header' : isLogin ? 'login-header' : 'reg-header'}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="text-center"
                                >
                                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 tracking-tight">
                                        {showForgot ? (
                                            forgotStep === 1 ? 'Forgot Access' :
                                                forgotStep === 2 ? 'Verification' : 'Reset Credentials'
                                        ) : isLogin ? 'Welcome Back' : 'Create Account'}
                                    </h1>
                                    <p className="text-purple-300/40 text-xs sm:text-sm font-medium">
                                        {showForgot ? (
                                            forgotStep === 1 ? 'Transmit email for identification' :
                                                forgotStep === 2 ? 'Enter 6-digit transmission key' : 'Establish new security protocol'
                                        ) : isLogin ? 'Sign in to your account' : 'Join our community today'}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="flex flex-col justify-start">
                            <AnimatePresence mode="wait">
                                {showForgot ? (
                                    <motion.form
                                        key="forgot"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        onSubmit={handleForgotSubmit}
                                        className="space-y-4"
                                    >
                                        {forgotStep === 1 && (
                                            <AnimatedInput icon={FiMail} type="email" placeholder="Identification Email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
                                        )}
                                        {forgotStep === 2 && (
                                            <div className="space-y-4">
                                                <AnimatedInput icon={FiShield} type="text" placeholder="6-Digit OTP" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} />
                                                <p className="text-[10px] text-center text-white/30 tracking-widest font-bold uppercase">Transmission key expires in 10m</p>
                                            </div>
                                        )}
                                        {forgotStep === 3 && (
                                            <>
                                                <AnimatedInput icon={FiLock} type="password" placeholder="New Protocol Code" value={resetPasswords.password} onChange={(e) => setResetPasswords({ ...resetPasswords, password: e.target.value })} />
                                                <AnimatedInput icon={FiCheck} type="password" placeholder="Authenticate Code" value={resetPasswords.confirm} onChange={(e) => setResetPasswords({ ...resetPasswords, confirm: e.target.value })} />
                                            </>
                                        )}

                                        <motion.button
                                            type="submit"
                                            disabled={isLoading}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-4 rounded-2xl bg-purple-600 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-purple-900/40 flex items-center justify-center gap-3"
                                        >
                                            {isLoading ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    {forgotStep === 1 && <>Begin Retrieval <FiSend /></>}
                                                    {forgotStep === 2 && <>Verify Encryption <FiArrowRight /></>}
                                                    {forgotStep === 3 && <>Finalize Reset <FiCheck /></>}
                                                </>
                                            )}
                                        </motion.button>

                                        <div className="flex flex-col gap-3">
                                            {forgotStep > 1 && (
                                                <button type="button" onClick={() => setForgotStep(forgotStep - 1)} className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-all">
                                                    Back to previous node
                                                </button>
                                            )}
                                            <button type="button" onClick={() => { setShowForgot(false); setForgotStep(1); }} className="text-[9px] font-black uppercase tracking-[0.3em] text-purple-400 hover:text-purple-300 transition-all">
                                                Return to Identification node
                                            </button>
                                        </div>
                                    </motion.form>
                                ) : isLogin ? (
                                    <motion.form
                                        key="login"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        onSubmit={handleAuth}
                                        className="space-y-4 sm:space-y-5"
                                    >
                                        <AnimatedInput icon={FiMail} type="email" placeholder="Email Address" name="email" value={formData.email} onChange={handleChange} />
                                        <AnimatedInput icon={FiLock} type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />

                                        <div className="flex items-center justify-between px-1">
                                            <label className="flex items-center gap-2 cursor-pointer group/check">
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${rememberMe ? 'bg-purple-600 border-purple-600' : 'border-white/20 bg-white/5'}`}>
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={rememberMe}
                                                        onChange={() => setRememberMe(!rememberMe)}
                                                    />
                                                    {rememberMe && <FiCheck size={12} className="text-white" />}
                                                </div>
                                                <span className="text-[10px] text-purple-300/40 font-medium group-hover/check:text-purple-300 transition-colors">Remember me</span>
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setForgotEmail(formData.email);
                                                    setShowForgot(true);
                                                }}
                                                className="text-[10px] sm:text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium"
                                            >
                                                Forgot password?
                                            </button>
                                        </div>

                                        <motion.button
                                            type="submit"
                                            disabled={isLoading}
                                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(139,92,246,0.9)' }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-purple-600 text-white font-bold text-sm tracking-wide shadow-[0_12px_30px_rgba(139,92,246,0.4)] disabled:opacity-50 mt-2 sm:mt-4 overflow-hidden relative"
                                        >
                                            <AnimatePresence mode="wait">
                                                {isLoading ? (
                                                    <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
                                                        <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                                                    </motion.div>
                                                ) : (
                                                    <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2">
                                                        Sign In <FiArrowRight className="text-base" />
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </motion.button>
                                    </motion.form>
                                ) : (
                                    <motion.form
                                        key="register"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        onSubmit={handleAuth}
                                        className="space-y-3 sm:space-y-4"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <AnimatedInput icon={FiUser} type="text" placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                                            <AnimatedInput icon={FiUser} type="text" placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                                        </div>
                                        <AnimatedInput icon={FiMail} type="email" placeholder="Email Address" name="email" value={formData.email} onChange={handleChange} />
                                        <AnimatedInput icon={FiLock} type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
                                        <AnimatedInput icon={FiCheck} type="password" placeholder="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />

                                        <motion.button
                                            type="submit"
                                            disabled={isLoading}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm tracking-wide shadow-[0_12px_30px_rgba(79,70,229,0.4)] mt-2 sm:mt-4"
                                        >
                                            {isLoading ? <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : "Create Account"}
                                        </motion.button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex items-center gap-4 my-6 sm:my-8 opacity-20">
                            <div className="flex-1 h-[1px] bg-white" />
                            <span className="text-[10px] text-white uppercase font-bold tracking-widest">Or</span>
                            <div className="flex-1 h-[1px] bg-white" />
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
                                className="flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border border-white/5 bg-white/[0.03] text-white text-[10px] sm:text-[11px] font-bold uppercase transition-all duration-300 shadow-sm"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="#EA4335" d="M5.27 9.77A7.78 7.78 0 0 1 12 4.5c1.94 0 3.68.71 5.05 1.86l3.76-3.76A12.24 12.24 0 0 0 12 0 12.24 12.24 0 0 0 1.24 6.65l4.03 3.12Z" />
                                    <path fill="#34A853" d="M16.04 18.01A7.4 7.4 0 0 1 12 19.5a7.78 7.78 0 0 1-6.73-5.27l-4.03 3.12A12.24 12.24 0 0 0 12 24c3.19 0 6.05-1.22 8.22-3.22l-3.78-2.77h-.4Z" />
                                    <path fill="#4A90D9" d="M20.58 20.78A11.94 11.94 0 0 0 24 12c0-.82-.1-1.64-.29-2.45H12v5h6.82a6.1 6.1 0 0 1-2.38 3.46l3.78 2.77h.36Z" />
                                    <path fill="#FBBC05" d="M5.27 14.23A7.63 7.63 0 0 1 4.5 12c0-.8.14-1.57.37-2.23L1.24 6.65A12.13 12.13 0 0 0 0 12c0 1.96.46 3.81 1.24 5.35l4.03-3.12Z" />
                                </svg>
                                Google
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
                                className="flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border border-white/5 bg-white/[0.03] text-white text-[10px] sm:text-[11px] font-bold uppercase transition-all duration-300 shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="white" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" /></svg>
                                GitHub
                            </motion.button>
                        </div>

                        <div className="mt-8 sm:mt-12 text-center">
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="group inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-2"
                            >
                                <span className="text-xs sm:text-sm text-purple-300/40">
                                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                                </span>
                                <span className="text-xs sm:text-sm font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
                                    {isLogin ? "Sign Up" : "Sign In"}
                                </span>
                            </button>
                        </div>
                    </div>
                </motion.div>

                <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/10 blur-[100px] -z-10" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[100px] -z-10" />
            </motion.div>

        </div>
    );
};

export default Login;
