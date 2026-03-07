import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiLinkedin, FiArrowRight } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="bg-gray-50 pt-12 pb-12 border-t border-gray-200">
            <div className="custom-container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link to="/" className="text-2xl font-serif font-bold tracking-tighter text-gray-900 block">
                            LUMIÈRE<span className="text-amber-600">.</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            Transforming spaces with curated, premium wallpapers designed for the modern home.
                            Elevate your walls with texture, color, and art.
                        </p>
                        <div className="flex gap-4">
                            {[FiInstagram, FiFacebook, FiTwitter, FiLinkedin].map((Icon, i) => (
                                <a key={i} href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 className="font-serif font-semibold text-gray-900 mb-6 relative inline-block">
                            Shop
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-amber-600"></span>
                        </h4>
                        <ul className="space-y-3">
                            {['New Arrivals', 'Best Sellers', 'Featured', 'Collections', 'Gift Cards'].map((link) => (
                                <li key={link}>
                                    <Link to="#" className="text-gray-500 hover:text-amber-600 text-sm transition-colors block py-0.5">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="font-serif font-semibold text-gray-900 mb-6 relative inline-block">
                            Support
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-amber-600"></span>
                        </h4>
                        <ul className="space-y-3">
                            {['Contact Us', 'FAQs', 'Shipping & Returns', 'Privacy Policy', 'Terms of Service'].map((link) => (
                                <li key={link}>
                                    <Link to="#" className="text-gray-500 hover:text-amber-600 text-sm transition-colors block py-0.5">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-serif font-semibold text-gray-900 mb-6 relative inline-block">
                            Stay Updated
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-amber-600"></span>
                        </h4>
                        <p className="text-gray-500 text-sm mb-4">
                            Subscribe to our newsletter for exclusive offers and design inspiration.
                        </p>
                        <form className="flex flex-col gap-3">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none text-sm transition-all"
                            />
                            <button className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 group">
                                Subscribe <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-400 text-xs">
                        &copy; {new Date().getFullYear()} Lumière Wallpaper Co. All rights reserved.
                    </p>
                    <div className="custom-container">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3 opacity-50 grayscale hover:grayscale-0 transition-all" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
