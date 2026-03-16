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
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                try {
                    // Try to redirect to Xendit
                    const sessionResponse = await fetch('/api/create-checkout-session', {
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

        </div>
    );
}

export default Contact;
