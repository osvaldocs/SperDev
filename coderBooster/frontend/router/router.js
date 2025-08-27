import { routes } from './routes.js';

export async function navigate(path) {
  console.log('🔍 Router: navigate() called with path:', path);
  console.log('🔍 Router: Available routes:', Object.keys(routes));
  console.log('🔍 Router: Current window.location.pathname:', window.location.pathname);
  
  const content = document.getElementById('app-content');
  const route = routes[path] || routes["/"];
  
  console.log('🔍 Router: Selected route file:', route);
  console.log('🔍 Router: Target path:', path);
  console.log('🔍 Router: Default route:', routes["/"]);

  try {
    if (window.location.pathname !== path) {
      console.log('🔍 Router: Updating browser history to:', path);
      window.history.pushState({}, "", path);
    }

    console.log('🔍 Router: Fetching route file:', route);
    const response = await fetch(route);
    if (!response.ok) throw new Error('No se pudo cargar la página');

    const html = await response.text();
    console.log('🔍 Router: HTML loaded, length:', html.length);
    content.innerHTML = html;

    // Handle sidebar visibility
    console.log('🔍 Router: Handling sidebar visibility for path:', path);
    handleSidebarVisibility(path);

    // Load specific scripts based on route
    console.log('🔍 Router: Loading route scripts for path:', path);
    await loadRouteScripts(path);

    console.log('🔍 Router: Navigation completed successfully to:', path);

  } catch (error) {
    console.error('❌ Router: Navigation error:', error);
    content.innerHTML = `<h1>Error</h1><p>${error.message}</p>`;
  }
}

// Handle sidebar visibility based on route
function handleSidebarVisibility(path) {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('main-content');
  
  if (path === '/login') {
    // Hide sidebar and make main content full width for login
    if (sidebar) sidebar.classList.add('hidden');
    if (mainContent) mainContent.classList.add('full-width');
  } else {
    // Show sidebar and restore normal layout for other routes
    if (sidebar) sidebar.classList.remove('hidden');
    if (mainContent) mainContent.classList.remove('full-width');
  }
}

async function loadRouteScripts(path) {
  console.log('loadRouteScripts called for path:', path);
  // Load additional scripts based on the route
  switch (path) {
    case '/login':
      console.log('Loading auth.js script...');
      await loadScript('features/auth/auth.js');
      // Reinitialize auth after script loads
      setTimeout(() => {
        console.log('Calling reinitializeAuth after timeout...');
        if (window.reinitializeAuth) {
          window.reinitializeAuth();
        } else {
          console.error('reinitializeAuth function not found!');
        }
      }, 100);
      break;
    case '/':
      console.log('Loading home.js script...');
      await loadScript('features/home/home.js');
      // Reinitialize home after script loads
      setTimeout(() => {
        console.log('Calling reinitializeHome after timeout...');
        if (window.reinitializeHome) {
          window.reinitializeHome();
        } else {
          console.error('reinitializeHome function not found!');
        }
      }, 100);
      break;
    case '/videos':
      console.log('Loading video.js script...');
      await loadScript('features/videos/video.js');
      // Reinitialize video player after script loads
      setTimeout(() => {
        if (window.reinitializeVideoPlayer) {
          window.reinitializeVideoPlayer();
        }
      }, 100);
      break;
    case '/workshop':
      console.log('Loading workshops.js script...');
      await loadScript('features/workshops/workshops.js');
      // Reinitialize workshop gallery after script loads
      setTimeout(() => {
        if (window.reinitializeWorkshopGallery) {
          window.reinitializeWorkshopGallery();
        }
      }, 100);
      break;
    // Chat and comments are integrated in videoplayer.html
  }
}

async function loadScript(scriptPath) {
  console.log('loadScript called for:', scriptPath);
  // Check if script is already loaded
  if (document.querySelector(`script[src="${scriptPath}"]`)) {
    console.log('Script already loaded:', scriptPath);
    return;
  }
  
  try {
    const script = document.createElement('script');
    script.src = scriptPath;
    script.async = true;
    
    return new Promise((resolve, reject) => {
      script.onload = () => {
        console.log('Script loaded successfully:', scriptPath);
        resolve();
      };
      script.onerror = () => {
        console.error('Script failed to load:', scriptPath);
        reject();
      };
      document.head.appendChild(script);
    });
  } catch (error) {
    console.error(`Failed to load script: ${scriptPath}`, error);
  }
}

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
  console.log('🔍 Router: popstate event detected, navigating to:', window.location.pathname);
  navigate(window.location.pathname);
});

// Check initial URL on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('🔍 Router: DOM loaded, checking initial URL:', window.location.pathname);
  // Don't navigate here, let main.js handle it
});

// Global function for HTML onclick handlers
window.navigateTo = navigate;
