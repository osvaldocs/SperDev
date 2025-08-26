// Configuración de Tailwind
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#171E4A',
                accent: '#715CFF',
                pink: '#EAA2FC',
                green: '#5ACCA4',
                yellow: '#FDD857',
                orange: '#FE654F'
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif']
            }
        }
    }
};

// Variables globales
let isPlaying = false;
let currentPage = 'home';

// Funcionalidad de navegación
function showPage(pageId) {
    // Ocultar todas las páginas
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Remover clase activa de todos los elementos de navegación
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('bg-white', 'bg-opacity-20', 'active');
    });
    
    // Mostrar página seleccionada
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }
    
    // Agregar clase activa al elemento de navegación seleccionado
    const navItem = document.querySelector(`[data-page="${pageId}"]`);
    if (navItem) {
        navItem.classList.add('bg-white', 'bg-opacity-20', 'active');
    }
    
    currentPage = pageId;
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Funcionalidad del reproductor de video
function togglePlay() {
    const playIcon = document.getElementById('playIcon');
    if (!playIcon) return;
    
    if (isPlaying) {
        playIcon.innerHTML = '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>';
        isPlaying = false;
    } else {
        playIcon.innerHTML = '<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zM11 8a1 1 0 112 0v4a1 1 0 11-2 0V8z" clip-rule="evenodd"/>';
        isPlaying = true;
    }
}

// Funciones de utilidad
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Función para manejar la búsqueda
function handleSearch() {
    const searchInput = document.querySelector('input[placeholder*="Search"]');
    if (searchInput) {
        const query = searchInput.value.trim();
        if (query) {
            console.log('Búsqueda:', query);
            // Aquí puedes implementar la lógica de búsqueda
        }
    }
}

// Función para manejar filtros de workshops
function applyFilters() {
    const moduleFilter = document.querySelector('select:first-of-type');
    const topicFilter = document.querySelector('select:last-of-type');
    
    if (moduleFilter && topicFilter) {
        const module = moduleFilter.value;
        const topic = topicFilter.value;
        console.log('Filtros aplicados:', { module, topic });
        // Aquí puedes implementar la lógica de filtrado
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('CoderBoost application initialized!');
    
    // Mostrar página de inicio por defecto
    showPage('home');
    
    // Agregar event listeners para búsqueda
    const searchButton = document.querySelector('button svg[fill-rule="evenodd"]');
    if (searchButton) {
        searchButton.parentElement.addEventListener('click', handleSearch);
    }
    
    // Agregar event listeners para filtros
    const applyFiltersButton = document.querySelector('button:contains("Apply Filters")');
    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', applyFilters);
    }
    
    // Agregar event listener para Enter en búsqueda
    const searchInput = document.querySelector('input[placeholder*="Search"]');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
    
    // Agregar event listeners para comentarios
    const postCommentButton = document.querySelector('button:contains("Post Comment")');
    if (postCommentButton) {
        postCommentButton.addEventListener('click', function() {
            const commentTextarea = document.querySelector('textarea[placeholder*="Add a comment"]');
            if (commentTextarea && commentTextarea.value.trim()) {
                console.log('Comentario posteado:', commentTextarea.value);
                commentTextarea.value = '';
                // Aquí puedes implementar la lógica para postear comentarios
            }
        });
    }
});

// Función para manejar likes
function handleLike(button) {
    const likeCount = button.textContent;
    const newCount = parseInt(likeCount.match(/\d+/)[0]) + 1;
    button.textContent = `👍 ${newCount}`;
    button.style.color = '#715CFF';
}

// Función para manejar respuestas
function handleReply(button) {
    const commentSection = button.closest('.flex-1');
    const replyForm = commentSection.querySelector('.reply-form');
    
    if (replyForm) {
        replyForm.classList.toggle('hidden');
    } else {
        // Crear formulario de respuesta
        const form = document.createElement('div');
        form.className = 'reply-form mt-3';
        form.innerHTML = `
            <textarea placeholder="Write a reply..." class="w-full border border-gray-300 rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent" rows="2"></textarea>
            <div class="flex justify-end mt-2">
                <button onclick="submitReply(this)" class="bg-accent text-white px-4 py-1 rounded-lg hover:bg-opacity-90 transition-all text-sm">Reply</button>
            </div>
        `;
        commentSection.appendChild(form);
    }
}

// Función para enviar respuestas
function submitReply(button) {
    const form = button.closest('.reply-form');
    const textarea = form.querySelector('textarea');
    const replyText = textarea.value.trim();
    
    if (replyText) {
        console.log('Respuesta enviada:', replyText);
        form.remove();
        // Aquí puedes implementar la lógica para enviar respuestas
    }
}