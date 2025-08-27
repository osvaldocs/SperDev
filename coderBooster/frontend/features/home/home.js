// Home Manager - Uses the same workshop data
class HomeManager {
    constructor() {
        console.log('HomeManager constructor called');
        // Same workshops data as workshop_gallerie
        this.workshops = [
            {
                id: 1,
                title: "Python Fundamentals",
                description: "Master the basics of Python programming.",
                duration: "3 hours",
                level: "Beginner",
                instructor: "Alice Johnson",
                rating: 4.7,
                thumbnail: "bg-primary",
                tags: ["Python", "Programming", "Beginner"]
            },
            {
                id: 2,
                title: "React for Beginners",
                description: "Build your first interactive web applications with React.",
                duration: "4 hours",
                level: "Intermediate",
                instructor: "Bob Williams",
                rating: 4.9,
                thumbnail: "bg-success",
                tags: ["React", "Frontend", "JavaScript"]
            },
            {
                id: 3,
                title: "SQL & Databases",
                description: "Learn to design and query relational databases.",
                duration: "3.5 hours",
                level: "Intermediate",
                instructor: "Charlie Brown",
                rating: 4.5,
                thumbnail: "bg-warning",
                tags: ["Databases", "SQL", "Backend"]
            },
            {
                id: 4,
                title: "Advanced CSS Techniques",
                description: "Dive deep into modern CSS for stunning designs.",
                duration: "2.5 hours",
                level: "Advanced",
                instructor: "Diana Prince",
                rating: 4.8,
                thumbnail: "bg-danger",
                tags: ["CSS", "Frontend", "Design"]
            },
            {
                id: 5,
                title: "HTML5 & Accessibility",
                description: "Create semantic and accessible web structures.",
                duration: "2 hours",
                level: "Beginner",
                instructor: "Eve Adams",
                rating: 4.6,
                thumbnail: "bg-info",
                tags: ["HTML", "Accessibility", "Frontend"]
            },
            {
                id: 6,
                title: "JavaScript ES6+",
                description: "Explore modern JavaScript features and best practices.",
                duration: "3 hours",
                level: "Intermediate",
                instructor: "Frank White",
                rating: 4.9,
                thumbnail: "bg-secondary",
                tags: ["JavaScript", "ES6", "Programming"]
            },
            {
                id: 7,
                title: "Data Structures in Python",
                description: "Understand fundamental data structures with Python.",
                duration: "4 hours",
                level: "Advanced",
                instructor: "Grace Hopper",
                rating: 4.7,
                thumbnail: "bg-primary",
                tags: ["Python", "Algorithms", "Data Science"]
            },
            {
                id: 8,
                title: "State Management with Redux",
                description: "Manage complex application state in React with Redux.",
                duration: "3.5 hours",
                level: "Advanced",
                instructor: "Harry Potter",
                rating: 4.8,
                thumbnail: "bg-success",
                tags: ["React", "Redux", "Frontend"]
            },
            {
                id: 9,
                title: "NoSQL Databases: MongoDB",
                description: "Introduction to NoSQL databases using MongoDB.",
                duration: "3 hours",
                level: "Intermediate",
                instructor: "Ivy Green",
                rating: 4.6,
                thumbnail: "bg-warning",
                tags: ["Databases", "NoSQL", "MongoDB"]
            }
        ];
        console.log('HomeManager workshops data loaded:', this.workshops.length);
        this.init();
    }

    init() {
        console.log('HomeManager init called');
        this.displayRecentWorkshops();
    }

    // Method to reinitialize when navigating back to home
    reinitialize() {
        console.log('Reinitializing Home...');
        this.displayRecentWorkshops();
    }

    displayRecentWorkshops() {
        console.log('displayRecentWorkshops called');
        const grid = document.getElementById('recentWorkshopsGrid');
        if (!grid) {
            console.error('Recent workshops grid not found');
            return;
        }

        // Show only the first 3 workshops as "recent"
        const recentWorkshops = this.workshops.slice(0, 3);

        console.log('Displaying recent workshops:', recentWorkshops.length);

        grid.innerHTML = recentWorkshops.map(workshop => `
            <div class="col-md-6 col-lg-4">
                <div class="workshop-card" onclick="homeManager.showWorkshopDetails(${workshop.id})">
                    <div class="workshop-thumbnail ${workshop.thumbnail} rounded-top d-flex align-items-center justify-content-center position-relative">
                        <div class="play-button">
                            <i class="bi bi-play-circle-fill text-white display-4"></i>
                        </div>
                        <span class="duration-badge badge bg-dark bg-opacity-75">${workshop.duration}</span>
                        <span class="level-badge badge bg-light text-dark">${workshop.level}</span>
                    </div>
                    <div class="card-body">
                        <h6 class="card-title mb-1">${workshop.title}</h6>
                        <p class="card-text small text-muted mb-2">${workshop.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted"><i class="bi bi-person-fill me-1"></i>${workshop.instructor}</small>
                            <small class="text-warning"><i class="bi bi-star-fill me-1"></i>${workshop.rating}</small>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        console.log('Recent workshops HTML generated and inserted');
    }

    showWorkshopDetails(workshopId) {
        console.log('showWorkshopDetails called with ID:', workshopId);
        // Navigate to workshop gallery and show the specific workshop
        window.navigateTo('/workshop-gallery');
        
        // After navigation, trigger the workshop modal
        setTimeout(() => {
            if (window.workshopManager) {
                window.workshopManager.showWorkshopDetails(workshopId);
            }
        }, 500);
    }
}

// Initialize home manager when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired in home.js');
    window.homeManager = new HomeManager();
});

// Global function to reinitialize home
window.reinitializeHome = function() {
    console.log('reinitializeHome global function called');
    if (window.homeManager) {
        window.homeManager.reinitialize();
    } else {
        console.log('homeManager not found, creating new instance');
        window.homeManager = new HomeManager();
    }
};
