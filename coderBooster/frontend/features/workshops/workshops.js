// Workshop Gallery Manager
class WorkshopManager {
    constructor() {
        this.workshops = [
            {
                id: 1,
                title: 'JavaScript Fundamentals',
                description: 'Learn the basics of JavaScript programming including variables, functions, and control structures.',
                category: 'javascript',
                level: 'beginner',
                duration: '2 hours',
                instructor: 'John Doe',
                rating: 4.8,
                students: 1250,
                thumbnail: 'bg-primary',
                tags: ['javascript', 'programming', 'beginner']
            },
            {
                id: 2,
                title: 'React Hooks Deep Dive',
                description: 'Master React Hooks with practical examples and best practices for modern React development.',
                category: 'react',
                level: 'intermediate',
                duration: '3 hours',
                instructor: 'Jane Smith',
                rating: 4.9,
                students: 890,
                thumbnail: 'bg-success',
                tags: ['react', 'hooks', 'frontend']
            },
            {
                id: 3,
                title: 'Python for Beginners',
                description: 'Introduction to Python programming for data analysis and machine learning applications.',
                category: 'python',
                level: 'beginner',
                duration: '2.5 hours',
                instructor: 'Mike Johnson',
                rating: 4.7,
                students: 2100,
                thumbnail: 'bg-warning',
                tags: ['python', 'data-science', 'machine-learning']
            },
            {
                id: 4,
                title: 'HTML5 & CSS3 Mastery',
                description: 'Build beautiful and responsive websites with modern HTML5 and CSS3 techniques.',
                category: 'html',
                level: 'beginner',
                duration: '2 hours',
                instructor: 'Sarah Wilson',
                rating: 4.6,
                students: 1800,
                thumbnail: 'bg-info',
                tags: ['html', 'css', 'web-design']
            },
            {
                id: 5,
                title: 'Advanced CSS Grid & Flexbox',
                description: 'Master modern CSS layout techniques with Grid and Flexbox for responsive designs.',
                category: 'css',
                level: 'intermediate',
                duration: '2.5 hours',
                instructor: 'Alex Brown',
                rating: 4.5,
                students: 950,
                thumbnail: 'bg-danger',
                tags: ['css', 'grid', 'flexbox', 'layout']
            },
            {
                id: 6,
                title: 'Database Design Fundamentals',
                description: 'Learn database design principles, SQL basics, and data modeling techniques.',
                category: 'databases',
                level: 'intermediate',
                duration: '3 hours',
                instructor: 'Dr. Emily Chen',
                rating: 4.8,
                students: 750,
                thumbnail: 'bg-secondary',
                tags: ['databases', 'sql', 'data-modeling']
            },
            {
                id: 7,
                title: 'Python Web Development',
                description: 'Build web applications using Python with Flask and Django frameworks.',
                category: 'python',
                level: 'intermediate',
                duration: '4 hours',
                instructor: 'Mike Johnson',
                rating: 4.7,
                students: 680,
                thumbnail: 'bg-warning',
                tags: ['python', 'web-development', 'flask', 'django']
            },
            {
                id: 8,
                title: 'Modern JavaScript ES6+',
                description: 'Explore modern JavaScript features including ES6+ syntax and best practices.',
                category: 'javascript',
                level: 'intermediate',
                duration: '2.5 hours',
                instructor: 'John Doe',
                rating: 4.9,
                students: 1100,
                thumbnail: 'bg-primary',
                tags: ['javascript', 'es6', 'modern-js']
            },
            {
                id: 9,
                title: 'React State Management',
                description: 'Master state management in React with Context API, Redux, and other patterns.',
                category: 'react',
                level: 'advanced',
                duration: '3.5 hours',
                instructor: 'Jane Smith',
                rating: 4.8,
                students: 650,
                thumbnail: 'bg-success',
                tags: ['react', 'state-management', 'redux', 'context']
            }
        ];
        this.init();
    }
    
    init() {
        this.displayWorkshops();
    }
    
    // Method to reinitialize when navigating back to workshop gallery
    reinitialize() {
        console.log('Reinitializing Workshop Gallery...');
        this.displayWorkshops();
    }
    
    displayWorkshops() {
        const grid = document.getElementById('workshopGrid');
        if (!grid) {
            console.error('Workshop grid not found');
            return;
        }
        
        console.log('Displaying workshops:', this.workshops.length);
        
        grid.innerHTML = this.workshops.map(workshop => `
            <div class="col-md-6 col-lg-4">
                <div class="workshop-card card h-100" onclick="workshopManager.showWorkshopDetails(${workshop.id})">
                    <div class="workshop-thumbnail ${workshop.thumbnail} rounded-top position-relative" style="height: 150px;">
                        <div class="play-button position-absolute top-50 start-50 translate-middle">
                            <i class="bi bi-play-circle-fill text-white display-4"></i>
                        </div>
                        <div class="duration-badge position-absolute bottom-0 end-0 m-2">
                            <span class="badge bg-dark">${workshop.duration}</span>
                        </div>
                        <div class="level-badge position-absolute top-0 start-0 m-2">
                            <span class="badge bg-${this.getLevelColor(workshop.level)}">${workshop.level}</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <h6 class="card-title">${workshop.title}</h6>
                        <p class="card-text small text-muted">${workshop.description.substring(0, 80)}...</p>
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <small class="text-muted">
                                <i class="bi bi-person me-1"></i>${workshop.instructor}
                            </small>
                            <small class="text-muted">
                                <i class="bi bi-star-fill text-warning me-1"></i>${workshop.rating}
                            </small>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">
                                <i class="bi bi-people me-1"></i>${workshop.students} students
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    getLevelColor(level) {
        switch (level) {
            case 'beginner': return 'success';
            case 'intermediate': return 'warning';
            case 'advanced': return 'danger';
            default: return 'secondary';
        }
    }
    
    showWorkshopDetails(workshopId) {
        const workshop = this.workshops.find(w => w.id === workshopId);
        if (!workshop) return;
        
        // Update modal content using existing DOM elements
        document.getElementById('workshopModalTitle').textContent = workshop.title;
        document.getElementById('workshopModalDescription').textContent = workshop.description;
        document.getElementById('workshopModalDuration').textContent = workshop.duration;
        document.getElementById('workshopModalLevel').textContent = workshop.level;
        document.getElementById('workshopModalInstructor').textContent = workshop.instructor;
        document.getElementById('workshopModalRatingValue').textContent = workshop.rating;
        
        // Update thumbnail
        const thumbnail = document.getElementById('workshopModalThumbnail');
        thumbnail.className = `workshop-thumbnail ${workshop.thumbnail} rounded`;
        
        // Update tags
        const tagsContainer = document.getElementById('workshopModalTags');
        tagsContainer.innerHTML = workshop.tags.map(tag => 
            `<span class="badge bg-light text-dark me-1">${tag}</span>`
        ).join('');
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('workshopModal'));
        modal.show();
    }
    
    enrollWorkshop() {
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('workshopModal'));
        modal.hide();
        
        // Show enrollment message
        this.showNotification('Workshop access granted! Start learning now.', 'success');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// Initialize workshop manager when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.workshopManager = new WorkshopManager();
});

// Also initialize if the script loads after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        window.workshopManager = new WorkshopManager();
    });
} else {
    window.workshopManager = new WorkshopManager();
}

// Global function to reinitialize workshop gallery
window.reinitializeWorkshopGallery = function() {
    if (window.workshopManager) {
        window.workshopManager.reinitialize();
    }
};
