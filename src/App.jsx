import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImg from './assets/logo.png';
import dashImg from './assets/hero-dashboard.png';
import workflowImg from './assets/workflow-screenshot.png';

function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <h1>
              Streamline Workflows.<br />
              <span>Automate Growth.</span>
            </h1>
            <p>
              Vorkhive is the all-in-one cloud platform designed to help teams automate tasks, manage operations, and scale productivity from a single dashboard.
            </p>
            <div className="hero-cta">
              <Link to="/contact" className="btn btn-primary btn-lg">Start Free Trial</Link>
              <a href="#demo" className="btn btn-secondary btn-lg">Book a Demo</a>
            </div>
            <div className="hero-trust">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <span>Bank-grade security. No credit card required.</span>
            </div>
          </div>
          <div className="hero-image">
            <img src={dashImg} alt="Vorkhive Dashboard" className="dashboard-mockup" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problem">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">The Challenge</span>
            <h2>Operations shouldn't be a bottleneck</h2>
            <p>Growing businesses lose thousands of hours a year to fragmented systems and manual busywork.</p>
          </div>
          <div className="grid-3">
            <div className="problem-card">
              <div className="problem-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <h3>Wasted Productivity</h3>
              <p>Teams spend 30% of their day switching between apps and doing repetitive data entry.</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
              </div>
              <h3>Siloed Information</h3>
              <p>Critical data is scattered across spreadsheets, making it impossible to get real-time insights.</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3>Team Misalignment</h3>
              <p>Without a single source of truth, remote and hybrid teams struggle to collaborate effectively.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="solution">
        <div className="container solution-content">
          <div className="solution-image">
            <img src={workflowImg} alt="Vorkhive Command Centre Dashboard" style={{ borderRadius: '0.75rem', width: '100%', height: 'auto' }} />
            <div className="solution-stat">
              <div className="solution-stat-value">40%</div>
              <div className="solution-stat-label">Average time saved</div>
            </div>
          </div>
          <div className="solution-text">
            <span className="section-tag">The Solution</span>
            <h2>One centralized hub for your entire operation</h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-base)', marginBottom: '2rem' }}>
              Vorkhive brings your workflows, teams, and data together so you can focus on growing your business instead of managing it.
            </p>
            <ul className="solution-list">
              <li>
                <div className="solution-list-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <div>
                  <strong>Eliminate manual tasks</strong>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-light)' }}>Automate repetitive processes with intuitive rules.</p>
                </div>
              </li>
              <li>
                <div className="solution-list-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <div>
                  <strong>Unified visibility</strong>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-light)' }}>See exactly where every project stands in real-time.</p>
                </div>
              </li>
              <li>
                <div className="solution-list-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <div>
                  <strong>Scale effortlessly</strong>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-light)' }}>Our cloud infrastructure grows with your team.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Features</span>
            <h2>Everything you need to scale</h2>
            <p>Powerful tools designed for speed, clarity, and performance.</p>
          </div>
          <div className="feature-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem' }}>Workflow Automation</h3>
                <p style={{ color: 'var(--text-light)' }}>Create custom "if this, then that" rules. Trigger actions, send notifications, and move data without writing a single line of code.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem' }}>Task & Team Management</h3>
                <p style={{ color: 'var(--text-light)' }}>Assign responsibilities, set deadlines, and track progress. Keep everyone aligned and accountable in one shared space.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem' }}>Real-Time Analytics</h3>
                <p style={{ color: 'var(--text-light)' }}>Make data-driven decisions with interactive dashboards. Track KPIs, monitor team velocity, and identify bottlenecks instantly.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem' }}>Secure Cloud Network</h3>
                <p style={{ color: 'var(--text-light)' }}>Enterprise-grade encryption keeps your data safe. SOC2 compliant infrastructure designed for maximum reliability and 99.99% uptime.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Process</span>
            <h2>Up and running in minutes</h2>
            <p>Stop wrestling with complex implementations. Vorkhive is designed for immediate value.</p>
          </div>
          <div className="steps-container">
            <div className="step-connector"></div>
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Sign up instantly</h3>
              <p style={{ color: 'var(--text-light)', marginTop: '1rem' }}>Create your workspace, invite your team, and connect your existing tools in just a few clicks.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Set up workflows</h3>
              <p style={{ color: 'var(--text-light)', marginTop: '1rem' }}>Use our drag-and-drop builder or choose from dozens of pre-built templates for common use cases.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Automate & scale</h3>
              <p style={{ color: 'var(--text-light)', marginTop: '1rem' }}>Watch your productivity multiply as rules take over the manual work, letting your team focus on strategy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="social-proof">
        <div className="container">
          <p style={{ textAlign: 'center', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2rem' }}>
            Trusted by forward-thinking teams
          </p>
          <div className="logos-container">
            <h2 style={{ color: 'var(--text-base)', fontSize: '1.5rem', fontWeight: 800 }}>Acme Corp</h2>
            <h2 style={{ color: 'var(--text-base)', fontSize: '1.5rem', fontWeight: 800 }}>Globex</h2>
            <h2 style={{ color: 'var(--text-base)', fontSize: '1.5rem', fontWeight: 800 }}>Soylent</h2>
            <h2 style={{ color: 'var(--text-base)', fontSize: '1.5rem', fontWeight: 800 }}>Initech</h2>
            <h2 style={{ color: 'var(--text-base)', fontSize: '1.5rem', fontWeight: 800 }}>Umbrella</h2>
          </div>

          <div className="testimonials">
            <div className="testimonial-grid">
              <div className="testimonial-card">
                <div className="stars">★★★★★</div>
                <p className="testimonial-text">"Vorkhive transformed how our agency handles onboarding. We cut manual setup time by 80% and our clients notice the improved speed."</p>
                <div className="testimonial-author">
                  <div className="author-avatar">SK</div>
                  <div className="author-info">
                    <h4>Sarah Kline</h4>
                    <p>Operations Director, VibeMedia</p>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="stars">★★★★★</div>
                <p className="testimonial-text">"The real-time analytics finally gave us visibility across our entire remote team. It's paid for itself ten times over."</p>
                <div className="testimonial-author">
                  <div className="author-avatar">MJ</div>
                  <div className="author-info">
                    <h4>Marcus Johnson</h4>
                    <p>Founder, ScaleUp Tech</p>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="stars">★★★★★</div>
                <p className="testimonial-text">"Unlike other bloated enterprise tools, Vorkhive is incredibly intuitive. The team adopted it in days, not months."</p>
                <div className="testimonial-author">
                  <div className="author-avatar">EP</div>
                  <div className="author-info">
                    <h4>Elena Patel</h4>
                    <p>VP of Engineering, CloudSync</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="pricing">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Pricing</span>
            <h2>Simple, transparent pricing</h2>
            <p>Start for free, upgrade when you need to.</p>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Starter</h3>
                <div className="price">$5</div>
                <div className="price-period">per user / month</div>
              </div>
              <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '2rem' }}>Perfect for individuals and small teams getting started.</p>
              <ul className="pricing-features">
                <li><svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Up to 5 users</li>
                <li><svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> 100 automated actions/mo</li>
                <li><svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Basic templates</li>
                <li><svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Community support</li>
              </ul>
              <Link to="/contact" className="btn btn-outline">Start Free</Link>
            </div>

            <div className="pricing-card popular">
              <div className="popular-badge">Most Popular</div>
              <div className="pricing-header">
                <h3>Pro</h3>
                <div className="price">$9</div>
                <div className="price-period">per user / month</div>
              </div>
              <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '2rem' }}>For growing teams that need robust automation.</p>
              <ul className="pricing-features">
                <li><svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Unlimited users</li>
                <li><svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> 5,000 automated actions/mo</li>
                <li><svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Advanced analytics</li>
                <li><svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Priority email support</li>
                <li><svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Custom workflows</li>
              </ul>
              <Link to="/contact" className="btn btn-primary">Start 14-Day Trial</Link>
            </div>

            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Enterprise</h3>
                <div className="price">$15</div>
                <div className="price-period">per user / month</div>
              </div>
              <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '2rem' }}>Advanced security and control for large organizations.</p>
              <ul className="pricing-features">
                <li><svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Everything in Pro</li>
                <li><svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Unlimited actions</li>
                <li><svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Single Sign-On (SSO)</li>
                <li><svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Dedicated success manager</li>
                <li><svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> API Access</li>
              </ul>
              <Link to="/contact" className="btn btn-outline">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container cta-content">
          <h2>Ready to revolutionize your operations?</h2>
          <p>Join over 10,000 teams who have reclaimed their time and accelerated their growth with Vorkhive.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/contact" className="btn btn-secondary btn-lg">Start free trial</Link>
            <a href="mailto:demo@vorkhive.com" className="btn btn-primary btn-lg" style={{ border: '1px solid rgba(255,255,255,0.2)', boxShadow: 'none' }}>Book a demo</a>
          </div>
          <p style={{ fontSize: '0.875rem', marginTop: '1.5rem', opacity: 0.8 }}>No credit card required. Cancel anytime.</p>
        </div>
      </section>
    </div>
  );
}

export default App;
