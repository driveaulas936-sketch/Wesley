import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LandingPage } from '../app/landing-page';
import '../app/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LandingPage />
  </StrictMode>,
);
