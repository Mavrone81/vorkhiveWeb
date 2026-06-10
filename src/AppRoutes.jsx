import { Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Contact from './Contact.jsx';
import Admin from './Admin.jsx';
import Success from './Success.jsx';
import Layout from './Layout.jsx';

// Shared app tree used by both the client (hydration) and the
// server prerender (build-time static HTML).
export default function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Layout>
  );
}
