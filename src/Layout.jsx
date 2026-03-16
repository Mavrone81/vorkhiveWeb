import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Button } from "./components/ui/button";
import { Menu, X } from "lucide-react";

export default function Layout({ children }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: "Features", href: "/#features", isHash: true },
        { label: "How It Works", href: "/#how-it-works", isHash: true },
        { label: "Pricing", href: "/#pricing", isHash: true },
        { label: "Contact", href: "/contact", isHash: false }
    ];

    return (
        <div className="min-h-screen">
            {/* Navigation */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                        ? 'bg-white shadow-sm border-b border-slate-100'
                        : 'bg-transparent'
                    }`}
            >
                <div className="container mx-auto px-6 lg:px-8">
                    <nav className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to={createPageUrl("Home")} className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">H</span>
                            </div>
                            <span className={`font-semibold ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                                HRMS
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                link.isHash ? (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className={`text-sm font-medium transition-colors ${isScrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white'
                                            }`}
                                    >
                                        {link.label}
                                    </a>
                                ) : (
                                    <Link
                                        key={link.label}
                                        to={link.href}
                                        className={`text-sm font-medium transition-colors ${isScrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="hidden md:flex items-center gap-3">
                            <a href="https://app.vorkhive.com" className="btn btn-outline">
                                Login
                            </a>
                            <Link to="/contact" className="btn btn-primary">
                                Start Free Trial
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className={`w-6 h-6 ${isScrolled ? 'text-slate-900' : 'text-white'}`} />
                            ) : (
                                <Menu className={`w-6 h-6 ${isScrolled ? 'text-slate-900' : 'text-white'}`} />
                            )}
                        </button>
                    </nav>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100">
                        <div className="container mx-auto px-6 py-4 space-y-3">
                            {navLinks.map((link) => (
                                link.isHash ? (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className="block text-slate-700 hover:text-indigo-600 font-medium py-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </a>
                                ) : (
                                    <Link
                                        key={link.label}
                                        to={link.href}
                                        className="block text-slate-700 hover:text-indigo-600 font-medium py-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            ))}
                            <div className="pt-3 border-t border-slate-100 space-y-2">
                                <a href="https://app.vorkhive.com" className="btn btn-outline" style={{ display: 'block', width: '100%' }}>
                                    Login
                                </a>
                                <Link to="/contact" className="btn btn-primary" style={{ display: 'block', width: '100%' }}>
                                    Start Free Trial
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Page Content */}
            <main>
                {children}
            </main>
        </div>
    );
}
