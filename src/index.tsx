import { createRoot } from 'react-dom/client';
import {App} from "@/app/app.tsx";

const root = document.createElement("div");
root.id = "root";
document.body.appendChild(root);

createRoot(root).render(<App />);