// style
import '@/assets/scss/style.scss';

// fonts
import '@fontsource/orbitron/500.css';

// bootstrap js
import 'bootstrap/dist/js/bootstrap.min.js';

// router
import './router.js';

// ui components
import '@/components/icons/ui-icon.ce.js';
import '@/components/ui-loader.ce.js';

// router
import '@/router.js';

// theme
import { initTheme } from '@/theme.js';

// notifications
import { initNotifications } from '@/notifications.js';

// init
initTheme();
initNotifications();

if (localStorage.getItem('isLogged') === null) {
  localStorage.setItem('isLogged', 'false');
}
