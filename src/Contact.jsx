import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from './assets/logo.png';

function Contact() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        employees: '',
        message: ''
    });
    const [scrolled, setScrolled] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        window.scrollTo(0, 0); // Scroll to top when page loads
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                try {
                    // Try to redirect to Xendit
                    const sessionResponse = await fetch('http://localhost:3001/api/create-checkout-session', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData),
                    });

                    if (!sessionResponse.ok) {
                        throw new Error('Xendit API keys are mock keys, bypassing to success page for demo purposes.');
                    }

                    const session = await sessionResponse.json();

                    if (session.url) {
                        window.location.href = session.url;
                    } else {
                        throw new Error('No Xendit invoice URL returned.');
                    }

                } catch (e) {
                    console.warn(e.message);
                    // Fallback to directly show success page since this is a demo without real Xendit keys configured yet
                    navigate('/success');
                }
            } else {
                console.error('Failed to submit form');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="app">
            {/* Navbar */}
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="container nav-content">
                    <Link to="/" className="logo">
                        <img src={logoImg} alt="Vorkhive" style={{ height: '32px' }} />
                        Vorkhive
                    </Link>
                    <div className="nav-links">
                        <Link to="/#features">Features</Link>
                        <Link to="/#how-it-works">How It Works</Link>
                        <Link to="/#pricing">Pricing</Link>
                    </div>
                    <div className="nav-actions">
                        <a href="https://app.vorkhive.com" className="btn btn-outline">Login</a>
                    </div>
                </div>
            </nav>

            {/* Contact Section */}
            <section className="contact" style={{ padding: '8rem 0 6rem 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
                <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>

                    {submitted ? (
                        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
                            <div style={{ width: '64px', height: '64px', background: '#10B981', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <h2 style={{ marginBottom: '1rem' }}>Request Received!</h2>
                            <p style={{ color: 'var(--text-light)', fontSize: '1.125rem', marginBottom: '2rem' }}>
                                Thank you for your interest in Vorkhive. Our team will review your information and contact you shortly to set up your free trial.
                            </p>
                            <Link to="/" className="btn btn-primary">Return to Homepage</Link>
                        </div>
                    ) : (
                        <>
                            <div className="section-header" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                                <h2>Start Your Free Trial</h2>
                                <p>Fill out the form below and our team will get you set up with everything you need to streamline your operations.</p>
                            </div>

                            <div style={{ background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label htmlFor="name" style={{ fontWeight: 600, fontSize: '0.875rem' }}>Full Name *</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '1rem' }}
                                                placeholder="Jane Doe"
                                            />
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label htmlFor="email" style={{ fontWeight: 600, fontSize: '0.875rem' }}>Work Email *</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '1rem' }}
                                                placeholder="jane@company.com"
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label htmlFor="company" style={{ fontWeight: 600, fontSize: '0.875rem' }}>Company Name *</label>
                                            <input
                                                type="text"
                                                id="company"
                                                name="company"
                                                required
                                                value={formData.company}
                                                onChange={handleChange}
                                                style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '1rem' }}
                                                placeholder="Acme Corp"
                                            />
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label htmlFor="employees" style={{ fontWeight: 600, fontSize: '0.875rem' }}>Company Size</label>
                                            <select
                                                id="employees"
                                                name="employees"
                                                value={formData.employees}
                                                onChange={handleChange}
                                                style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '1rem', backgroundColor: 'white' }}
                                            >
                                                <option value="">Select size...</option>
                                                <option value="1-10">1-10 employees</option>
                                                <option value="11-50">11-50 employees</option>
                                                <option value="51-200">51-200 employees</option>
                                                <option value="201-500">201-500 employees</option>
                                                <option value="500+">500+ employees</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label htmlFor="message" style={{ fontWeight: 600, fontSize: '0.875rem' }}>How can Vorkhive help your team?</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows="4"
                                            value={formData.message}
                                            onChange={handleChange}
                                            style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '1rem', resize: 'vertical' }}
                                            placeholder="Tell us about the workflows you want to automate..."
                                        ></textarea>
                                    </div>

                                    <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '1rem', width: '100%' }}>
                                        Request Free Trial
                                    </button>
                                    <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-light)', margin: 0 }}>
                                        By submitting this form, you agree to our Terms of Service and Privacy Policy.
                                    </p>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Footer minimal */}
            <footer className="footer" style={{ padding: '2rem 0' }}>
                <div className="container">
                    <div className="footer-bottom" style={{ borderTop: 'none', paddingTop: 0 }}>
                        <div>&copy; {new Date().getFullYear()} Vorkhive Inc. All rights reserved.</div>
                        <div className="social-links">
                            <a href="#"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 2.8 12 4 11c-1.1-1.1-1.3-3.1-1-4.5-1.5 1-3.2 2-4.9 2.5C-.4 5.2 2.7 2 6 2c2.4 0 4.1 1.7 5.1 3.5C13 4 18 2 22 4z"></path></svg></a>
                            <a href="#"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
                            <a href="#"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Contact;
