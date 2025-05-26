// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import App from './App.tsx'
// import './index.css'
// import { BrowserRouter } from 'react-router-dom';
// import 'flowbite';
// import 'flowbite/dist/flowbite.min.css'; // Flowbite styles



// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//           <BrowserRouter>
//                 <App />
//           </BrowserRouter>
//   </StrictMode>,
// )

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './react-query-client'; // your react-query client instance
import { ToastProvider } from './components/ToastContext'; // your Toast Context
import 'flowbite';
import 'flowbite/dist/flowbite.min.css'; // Flowbite styles
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  </StrictMode>,
);
