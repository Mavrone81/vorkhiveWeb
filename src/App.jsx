import { useEffect } from 'react';
import './redesign.css';
import { SiteHeader, SiteFooter } from './pages/Shell.jsx';
import { Hero, LogosSection, IntroSection, ProblemSection, MetricsSection, FinalCta } from './sections.jsx';

// Short landing page. The full Platform / Features / Pricing / FAQ / Customers
// content lives on dedicated routes (see AppRoutes.jsx + sections.jsx).
export default function App() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.vh-root .reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="vh-root">
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <LogosSection />
        <IntroSection />
        <ProblemSection />
        <MetricsSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
