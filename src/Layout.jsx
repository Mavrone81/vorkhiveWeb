import ChatWidget from './components/ChatWidget';
import FloatingContacts from './components/FloatingContacts';

// The homepage (App.jsx) ships its own header/footer (SG-HRMS redesign).
// Layout renders the routed page and mounts the floating widgets on every page.
export default function Layout({ children }) {
  return (
    <>
      {children}
      <FloatingContacts />
      <ChatWidget />
    </>
  );
}
