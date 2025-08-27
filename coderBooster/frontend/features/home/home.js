// frontend/features/home/home.js

export function initHome() {
  console.log("🏠 Home.js cargado correctamente.");

  // Obtener usuario del localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    console.warn("⚠️ No hay usuario logueado. Redirigiendo a login...");
    window.location.href = "/";
    return;
  }

  console.log(`✅ Usuario detectado: ${user.email}`);

  // Personalizar mensaje de bienvenida
  const welcomeTitle = document.querySelector(".welcome-section h2");
  if (welcomeTitle) {
    welcomeTitle.textContent = `Welcome back, ${user.email}! 👋`;
  }

  // Cargar workshops de ejemplo
  const recentWorkshopsGrid = document.getElementById("recentWorkshopsGrid");
  if (recentWorkshopsGrid) {
    recentWorkshopsGrid.innerHTML = `
      <div class="col-md-4">
        <div class="workshop-card p-3 border rounded text-center">
          <h5>Intro to Python</h5>
          <p class="text-muted small">Learn Python basics</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="workshop-card p-3 border rounded text-center">
          <h5>React Fundamentals</h5>
          <p class="text-muted small">Start building React apps</p>
        </div>
      </div>
    `;
  }
}
