// frontend/router/router.js
import { routes } from './routes.js';
import { LoginUser } from '../features/auth/login.js';
import { initHome } from '../features/home/home.js';

export async function navigate(path) {
  console.log('🔍 Router: navigate() called with path:', path);
  const content = document.getElementById('app-content');
  const route = routes[path] || routes["/"];

  try {
    // Actualiza la URL
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }

    // Carga la vista HTML
    const response = await fetch(route);
    if (!response.ok) throw new Error(`No se pudo cargar la página: ${route}`);

    const html = await response.text();
    content.innerHTML = html;

    // Ajustar sidebar
    handleSidebarVisibility(path);

    // Ejecutar scripts de la ruta actual
    runPageScript(path);

    console.log(`✅ Navegación completada: ${path}`);
  } catch (error) {
    console.error('❌ Error en navegación:', error);
    content.innerHTML = `<h1>Error</h1><p>${error.message}</p>`;
  }
}

// ✅ Mostrar/ocultar sidebar según página
function handleSidebarVisibility(path) {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('main-content');
  const appContent = document.getElementById('app-content');

  if (path === '/') {
    sidebar?.classList.add('hidden');
    mainContent?.classList.add('full-width');
    appContent?.classList.add('login-fullscreen');
  } else {
    sidebar?.classList.remove('hidden');
    mainContent?.classList.remove('full-width');
    appContent?.classList.remove('login-fullscreen');
  }
}

// ✅ Ejecutar función según ruta
function runPageScript(path) {
  switch (path) {
    case '/':
    case '/login':
      console.log('🚀 Inicializando LoginUser...');
      LoginUser();
      break;

    case '/home':
      console.log('🚀 Inicializando Home...');
      initHome()
      break;

    case '/videos':
      console.log('🚀 Inicializando Videos...');

      break;

    case '/workshop':
      console.log('🚀 Inicializando Workshop...');

      break;

    default:
      console.log('⚠️ No script definido para esta ruta.');
  }
}

// ✅ Cargar página inicial según sesión
document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (window.location.pathname === "/" && user) {
    console.log("✅ Usuario detectado, redirigiendo a /home");
    navigate("/home");
    return;
  }
  navigate(window.location.pathname);
});

// ✅ Soporte para navegación con botones del navegador
window.addEventListener('popstate', () => {
  navigate(window.location.pathname);
});

// ✅ Función global para navegar
window.navigateTo = navigate;
