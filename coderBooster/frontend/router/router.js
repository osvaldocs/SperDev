// frontend/router/router.js
import { routes } from './routes.js';
import { LoginUser } from '../features/auth/login.js';
import { initHome } from '../features/home/home.js';

// ✅ Lista de rutas protegidas
const protectedRoutes = ['/home', '/videos', '/workshop'];

export async function navigate(path) {
  console.log('🔍 Router: navigate() called with path:', path);
  const content = document.getElementById('app-content');
  const route = routes[path] || routes["/"];

  try {
    // 🔒 Comprobar autenticación
    const user = JSON.parse(localStorage.getItem("user"));
    if (protectedRoutes.includes(path) && !user) {
      console.warn("🔒 Acceso denegado. Redirigiendo a /login...");
      return navigate("/login");
    }

    // Actualiza la URL sin recargar
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }

    // Cargar el archivo HTML correspondiente
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

// ✅ Mostrar u ocultar sidebar según página
function handleSidebarVisibility(path) {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('main-content');
  const appContent = document.getElementById('app-content');

  if (path === '/' || path === '/login') {
    sidebar?.classList.add('hidden');
    mainContent?.classList.add('full-width');
    appContent?.classList.add('login-fullscreen');
  } else {
    sidebar?.classList.remove('hidden');
    mainContent?.classList.remove('full-width');
    appContent?.classList.remove('login-fullscreen');
  }
}

// ✅ Ejecutar lógica específica de cada página
function runPageScript(path) {
  switch (path) {
    case '/':
    case '/login':
      console.log('🚀 Inicializando LoginUser...');
      LoginUser();
      break;

    case '/home':
      console.log('🚀 Inicializando Home...');
      initHome();
      break;

    case '/videos':
      console.log('🚀 Inicializando Videos...');
      break;

    case '/workshop':
      console.log('🚀 Inicializando Workshop...');
      break;

    default:
      console.log('⚠️ No hay script definido para esta ruta.');
  }
}

// ✅ Mantener sesión si recargas
document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const currentPath = window.location.pathname;

  if ((currentPath === "/" || currentPath === "/login") && user) {
    console.log("✅ Usuario detectado, redirigiendo a /home");
    return navigate("/home");
  }

  navigate(currentPath);
});

// ✅ Soporte para el botón atrás/adelante del navegador
window.addEventListener('popstate', () => {
  navigate(window.location.pathname);
});

// ✅ Función global
window.navigateTo = navigate;
