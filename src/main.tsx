import { createRoot } from "react-dom/client";
import "./globals.css";

// Temporarily render a simple message to check if the app can load anything at all
const RootComponent = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px', fontFamily: 'sans-serif' }}>
    Loading...
  </div>
);

createRoot(document.getElementById("root")!).render(<RootComponent />);