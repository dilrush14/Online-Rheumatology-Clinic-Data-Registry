import './bootstrap';
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { InertiaProgress } from '@inertiajs/progress';
import { route } from 'ziggy-js'; // ✅ CORRECT


// Custom loading bar 
InertiaProgress.init({
  color: '#6366F1', // Indigo-500
  showSpinner: false,
});

createInertiaApp({
  resolve: name =>
    resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});

/*
createInertiaApp({
  title: (title) => (title ? `${title} – Rheumatology Registry` : 'Rheumatology Registry'),
  resolve: name => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/
  
 // *.jsx')),
  // ...
// });


