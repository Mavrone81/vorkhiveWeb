import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Button } from "./components/ui/button";
import { Menu, X } from "lucide-react";
import logoImg from './assets/logo.png';

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
            <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
                <div className="container nav-content relative">
                    {/* Logo */}
                    <Link to="/" className="logo">
                        <img src={logoImg} alt="Vorkhive" style={{ height: '32px' }} />
                        Vorkhive
                    </Link>

                    {/* Desktop Nav */}
                    <div className="nav-links hidden md:flex">
                        {navLinks.map((link) => (
                            link.isHash ? (
                                <a key={link.label} href={link.href}>{link.label}</a>
                            ) : (
                                <Link key={link.label} to={link.href}>{link.label}</Link>
                            )
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="nav-actions hidden md:flex">
                        <a href="https://app.vorkhive.com" className="btn btn-outline">
                            Login
                        </a>
                        <Link to="/contact" className="btn btn-primary">
                            Start Free Trial
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 ml-auto"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6 text-slate-900" />
                        ) : (
                            <Menu className="w-6 h-6 text-slate-900" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100 absolute w-full left-0 shadow-md" style={{ top: '100%', zIndex: 100 }}>
                        <div className="container py-4 flex flex-col gap-2">
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
                            <div className="pt-3 border-t border-slate-100 flex flex-col gap-3 mt-2">
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
            </nav>

            {/* Page Content */}
            <main>
                {children}
            </main>
        </div>
    );
}
