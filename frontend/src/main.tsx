import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {ErrorBoundary} from "react-error-boundary";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <App />
      </ErrorBoundary>
  </StrictMode>
);
