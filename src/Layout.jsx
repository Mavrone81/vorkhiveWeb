import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Button } from "./components/ui/button";
import { Menu, X } from "lucide-react";
import logoImg from './assets/logo.png';
import ChatWidget from './components/ChatWidget';

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
                        className="mobile-menu-btn"
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
                <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                    <div className="container mobile-menu-content">
                        {navLinks.map((link) => (
                            link.isHash ? (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="mobile-nav-link"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ) : (
                                <Link
                                    key={link.label}
                                    to={link.href}
                                    className="mobile-nav-link"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            )
                        ))}
                        <div className="mobile-nav-actions">
                            <a href="https://app.vorkhive.com" className="btn btn-outline" style={{ display: 'block', width: '100%', textAlign: 'center' }}>
                                Login
                            </a>
                            <Link to="/contact" className="btn btn-primary" style={{ display: 'block', width: '100%', textAlign: 'center' }}>
                                Start Free Trial
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <main>
                {children}
            </main>

            {/* Sales & support chat bot */}
            <ChatWidget />
        </div>
    );
}
