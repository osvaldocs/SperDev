// frontend/features/workshops/workshops.js
export function initWorkshop() {
  console.log("🏋️ Workshop.js cargado correctamente.");

  const workshopGrid = document.getElementById("workshopGrid");
  if (!workshopGrid) return;

  // Ejemplo de workshops
  const workshops = [
    {
      title: "Intro to Python",
      description: "Learn Python basics",
      duration: "2h",
      level: "Beginner",
      instructor: "Alice",
      rating: 4.5,
      tags: ["Python", "Data Science"]
    },
    {
      title: "React Fundamentals",
      description: "Start building React apps",
      duration: "3h",
      level: "Intermediate",
      instructor: "Bob",
      rating: 4.7,
      tags: ["React", "Frontend"]
    }
  ];

  workshopGrid.innerHTML = workshops.map(ws => `
    <div class="col-md-4">
      <div class="workshop-card p-3 border rounded text-center" onclick="openWorkshopModal('${ws.title}')">
        <h5>${ws.title}</h5>
        <p class="text-muted small">${ws.description}</p>
      </div>
    </div>
  `).join('');
}

// Función global para abrir modal
window.openWorkshopModal = function(title) {
  const modalTitle = document.getElementById("workshopModalTitle");
  if (modalTitle) modalTitle.textContent = title;
  const modal = new bootstrap.Modal(document.getElementById("workshopModal"));
  modal.show();
};
