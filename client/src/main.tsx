import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add RemixIcon CSS for icons
const remixIconLink = document.createElement("link");
remixIconLink.href = "https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css";
remixIconLink.rel = "stylesheet";
document.head.appendChild(remixIconLink);

createRoot(document.getElementById("root")!).render(<App />);
