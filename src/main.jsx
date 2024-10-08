import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';

import { Toaster } from "@/components/ui/sonner"
import App from './App.jsx';
import './index.css';


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;


if (!PUBLISHABLE_KEY) {

  throw new Error('Missing Publishable Key');

}


ReactDOM.createRoot(document.getElementById('root')).render(
  <ClerkProvider 
    publishableKey={PUBLISHABLE_KEY} 
    afterSignOutUrl="/"
    appearance={{
        baseTheme: dark
    }}
  >

    <App />

    <Toaster />

  </ClerkProvider>
);
