import { Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Contact from './Contact.jsx';
import Admin from './Admin.jsx';
import Success from './Success.jsx';
import Layout from './Layout.jsx';
import PayrollSingapore from './pages/PayrollSingapore.jsx';
import CpfPayroll from './pages/CpfPayroll.jsx';
import LeaveManagement from './pages/LeaveManagement.jsx';
import ClaimsManagement from './pages/ClaimsManagement.jsx';
import BookDemo from './pages/BookDemo.jsx';
import Terms from './pages/Terms.jsx';
import Privacy from './pages/Privacy.jsx';
import { PlatformPage, FeaturesPage, PricingPage, FaqPage, CustomersPage } from './pages/SectionPages.jsx';
import { HrSoftwarePage, AttendancePage, TalenoxAlternativePage, SwingvyAlternativePage, GuidesIndexPage, GuideCpfPage, GuideLeavePage, GuidePayrollPage } from './pages/SeoPages.jsx';
import { ContentProvider } from './content/ContentContext.jsx';

// Shared app tree used by both the client (hydration) and the
// server (render-on-request SSR). `content` is the live merged content on the
// server; on the client it's read from window.__CONTENT__ inside ContentProvider.
export default function AppRoutes({ content }) {
  return (
    <ContentProvider initial={content}>
      <Layout>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/platform" element={<PlatformPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/payroll-singapore" element={<PayrollSingapore />} />
          <Route path="/cpf-payroll" element={<CpfPayroll />} />
          <Route path="/leave-management" element={<LeaveManagement />} />
          <Route path="/claims" element={<ClaimsManagement />} />
          <Route path="/hr-software-singapore" element={<HrSoftwarePage />} />
          <Route path="/attendance-software-singapore" element={<AttendancePage />} />
          <Route path="/talenox-alternative" element={<TalenoxAlternativePage />} />
          <Route path="/swingvy-alternative" element={<SwingvyAlternativePage />} />
          <Route path="/guides" element={<GuidesIndexPage />} />
          <Route path="/guides/cpf-contribution-rates-singapore" element={<GuideCpfPage />} />
          <Route path="/guides/mom-leave-entitlements-singapore" element={<GuideLeavePage />} />
          <Route path="/guides/how-to-run-payroll-singapore" element={<GuidePayrollPage />} />
          <Route path="/book" element={<BookDemo />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </Layout>
    </ContentProvider>
  );
}
