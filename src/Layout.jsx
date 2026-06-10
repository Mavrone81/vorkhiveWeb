import ChatWidget from './components/ChatWidget';

// The homepage (App.jsx) ships its own header/footer (SG-HRMS redesign).
// Layout just renders the routed page and mounts the chat widget on every page.
export default function Layout({ children }) {
  return (
    <>
      {children}
      <ChatWidget />
    </>
  );
}
