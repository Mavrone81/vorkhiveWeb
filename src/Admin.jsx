import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImg from './assets/logo.png';

function Admin() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            fetchContacts();
        }
        window.scrollTo(0, 0);
    }, [isAuthenticated]);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/contacts');
            if (!response.ok) {
                throw new Error('Failed to fetch contacts');
            }
            const data = await response.json();
            setContacts(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching contacts:', err);
            setError('Could not load leads. Make sure the backend server is running on port 3001.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'vorkhive2026') {
            setIsAuthenticated(true);
            setLoginError('');
        } else {
            setLoginError('Invalid password');
        }
    };

    const downloadCSV = () => {
        if (contacts.length === 0) return;
        const headers = ['Date Submitted', 'Name', 'Email', 'Company', 'Size', 'Message'];
        const csvRows = [headers.join(',')];
        contacts.forEach(contact => {
            const row = [
                contact.timestamp,
                `"${contact.name.replace(/"/g, '""')}"`,
                `"${contact.email.replace(/"/g, '""')}"`,
                `"${contact.company.replace(/"/g, '""')}"`,
                `"${contact.employees || ''}"`,
                `"${(contact.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
            ];
            csvRows.push(row.join(','));
        });
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `vorkhive_leads_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    if (!isAuthenticated) {
        return (
            <div className="app" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ background: 'white', padding: '3rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                    <div className="logo" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
                        <img src={logoImg} alt="Vorkhive" style={{ height: '40px' }} />
                    </div>
                    <h2 style={{ marginBottom: '0.5rem' }}>Admin Access</h2>
                    <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Please enter the password to view leads.</p>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '1rem' }}
                            required
                        />
                        {loginError && <p style={{ color: '#EF4444', fontSize: '0.875rem', margin: 0 }}>{loginError}</p>}
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
                    </form>
                    <div style={{ marginTop: '1.5rem' }}>
                        <Link to="/" style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>&larr; Back to Website</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="app" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
            {/* Admin Navbar */}
            <nav className="navbar" style={{ background: 'white', borderBottom: '1px solid var(--border)' }}>
                <div className="container nav-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="logo">
                        <img src={logoImg} alt="Vorkhive" style={{ height: '32px' }} />
                        <span style={{ color: 'var(--primary)', marginLeft: '0.5rem', fontSize: '1.25rem' }}>Admin Dashboard</span>
                    </div>
                    <div className="nav-actions">
                        <Link to="/" className="btn btn-outline">Back to Website</Link>
                    </div>
                </div>
            </nav>

            <main className="container" style={{ padding: '3rem 1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Sales Leads</h1>
                        <p style={{ color: 'var(--text-light)', margin: 0 }}>Manage the contact information from trial requests.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={downloadCSV}
                            className="btn btn-outline"
                            disabled={contacts.length === 0 || loading}
                        >
                            Export CSV
                        </button>
                        <button
                            onClick={fetchContacts}
                            className="btn btn-secondary"
                            disabled={loading}
                        >
                            {loading ? 'Refreshing...' : 'Refresh Data'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #F87171', color: '#B91C1C', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
                        {error}
                    </div>
                )}

                <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-base)', fontSize: '0.875rem' }}>Date Submitted</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-base)', fontSize: '0.875rem' }}>Name</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-base)', fontSize: '0.875rem' }}>Company</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-base)', fontSize: '0.875rem' }}>Size</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-base)', fontSize: '0.875rem' }}>Message</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.length === 0 && !loading && !error ? (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
                                            No leads have been submitted yet.
                                        </td>
                                    </tr>
                                ) : (
                                    contacts.map(contact => (
                                        <tr key={contact.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-light)', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                                                {formatDate(contact.timestamp)}
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{contact.name}</div>
                                                <a href={`mailto:${contact.email}`} style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>{contact.email}</a>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-dark)' }}>
                                                {contact.company}
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-light)', fontSize: '0.875rem' }}>
                                                {contact.employees || 'N/A'}
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', maxWidth: '300px' }}>
                                                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-base)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} title={contact.message}>
                                                    {contact.message || <span style={{ color: 'var(--border)' }}>No message provided.</span>}
                                                </p>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Admin;
