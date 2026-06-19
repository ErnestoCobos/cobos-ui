import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Design tokens and component styles for the whole library.
import '@cobos/tokens/tokens.css';
import '@cobos/react/styles.css';

// Per-brand theme palettes. Each scopes its --ec-* vars to
// :root[data-theme="<name>"] (light) and html.dark[data-theme="<name>"] (dark),
// so the active brand is selected via data-theme on <html> and composes with
// the existing `dark` class.
import '@cobos/themes/cobos.css';
import '@cobos/themes/enkiflow.css';
import '@cobos/themes/getdecant.css';
import '@cobos/themes/voltaflow.css';

// Documentation site styles.
import './styles.css';

import App from './App';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container #root was not found in the document.');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
