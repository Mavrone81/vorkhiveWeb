import { Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Contact from './Contact.jsx';
import Admin from './Admin.jsx';
import Success from './Success.jsx';
import Layout from './Layout.jsx';
import PayrollSingapore from './pages/PayrollSingapore.jsx';
import CpfPayroll from './pages/CpfPayroll.jsx';
import BookDemo from './pages/BookDemo.jsx';
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
          <Route path="/payroll-singapore" element={<PayrollSingapore />} />
          <Route path="/cpf-payroll" element={<CpfPayroll />} />
          <Route path="/book" element={<BookDemo />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </Layout>
    </ContentProvider>
  );
}
