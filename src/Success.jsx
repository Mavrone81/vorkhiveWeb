import { Link } from 'react-router-dom';
import logoImg from './assets/logo.png';

function Success() {
    return (
        <div className="app" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <nav className="navbar" style={{ background: 'white', borderBottom: '1px solid var(--border)' }}>
                <div className="container nav-content">
                    <Link to="/" className="logo">
                        <img src={logoImg} alt="Vorkhive" style={{ height: '32px' }} />
                        Vorkhive
                    </Link>
                    <div className="nav-actions">
                        <a href="https://app.vorkhive.com" className="btn btn-outline">Login</a>
                    </div>
                </div>
            </nav>

            <main className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.5rem' }}>
                <div style={{ textAlign: 'center', background: 'white', padding: '4rem 2rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', maxWidth: '600px', width: '100%' }}>
                    <div style={{ width: '80px', height: '80px', background: '#10B981', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)' }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Payment Successful!</h1>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.25rem', margin: '0 0 2.5rem 0' }}>
                        Welcome to Vorkhive Pro. Your trial has officially started and your workspace is being provisioned.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/" className="btn btn-outline btn-lg">Return to Homepage</Link>
                        <a href="https://app.vorkhive.com" className="btn btn-primary btn-lg">Go to Dashboard</a>
                    </div>
                </div>
            </main>

            <footer className="footer" style={{ padding: '2rem 0', marginTop: 'auto' }}>
                <div className="container">
                    <div className="footer-bottom" style={{ borderTop: 'none', paddingTop: 0 }}>
                        <div>&copy; {new Date().getFullYear()} Vorkhive Inc. All rights reserved.</div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Success;
