// Video Manager - Comments functionality only
class VideoManager {
    constructor() {
        this.currentVideo = {
            title: "Python Fundamentals - Variables and Data Types",
            duration: "45:32",
            uploadDate: "2 days ago"
        };
        
        this.comments = [
            {
                id: 1,
                author: "John Smith",
                initials: "JS",
                avatar: "bg-success",
                content: "This explanation of variables was really clear! The examples helped me understand the concept much better.",
                time: "2 hours ago",
                likes: 2
            },
            {
                id: 2,
                author: "Maria Johnson",
                initials: "MJ",
                avatar: "bg-warning",
                content: "Great tutorial! I've been struggling with this topic and this video made it click for me.",
                time: "1 day ago",
                likes: 1
            },
            {
                id: 3,
                author: "Alex Kim",
                initials: "AK",
                avatar: "bg-info",
                content: "Could you make more videos about advanced topics? This was perfect for beginners!",
                time: "3 days ago",
                likes: 0
            }
        ];
        
        this.init();
    }
    
    init() {
        this.updateVideoInfo();
        this.setupEventListeners();
        this.updateCommentCount();
    }
    
    updateVideoInfo() {
        // Update video title
        const titleElement = document.getElementById('videoTitle');
        if (titleElement) titleElement.textContent = this.currentVideo.title;
        
        // Update video placeholder with selected video info
        const videoPlaceholder = document.querySelector('.video-placeholder');
        if (videoPlaceholder) {
            videoPlaceholder.innerHTML = `
                <div class="text-center text-white">
                    <i class="bi bi-play-circle-fill display-1"></i>
                    <h5 class="mt-3">${this.currentVideo.title}</h5>
                    <p class="text-muted">Click play to start watching</p>
                    <div class="mt-3">
                        <span class="badge bg-primary me-2">${this.currentVideo.duration}</span>
                        <span class="badge bg-secondary">${this.currentVideo.uploadDate}</span>
                    </div>
                </div>
            `;
        }
    }
    
    setupEventListeners() {
        // Comment form submission
        const commentInput = document.getElementById('commentInput');
        if (commentInput) {
            commentInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    this.addComment();
                }
            });
        }
    }
    
    addComment() {
        const commentInput = document.getElementById('commentInput');
        if (!commentInput || !commentInput.value.trim()) return;
        
        const newComment = {
            id: this.comments.length + 1,
            author: "You",
            initials: "U",
            avatar: "bg-primary",
            content: commentInput.value.trim(),
            time: "Just now",
            likes: 0
        };
        
        this.comments.unshift(newComment);
        this.displayComments();
        commentInput.value = '';
        this.updateCommentCount();
        
        // Show success message
        this.showNotification('Comment posted successfully!', 'success');
    }
    
    likeComment(commentId) {
        const comment = this.comments.find(c => c.id === commentId);
        if (comment) {
            comment.likes++;
            this.displayComments();
        }
    }
    
    replyComment(commentId) {
        const commentInput = document.getElementById('commentInput');
        if (commentInput) {
            const comment = this.comments.find(c => c.id === commentId);
            commentInput.value = `@${comment.author} `;
            commentInput.focus();
        }
    }
    
    displayComments() {
        const commentsList = document.getElementById('commentsList');
        if (!commentsList) return;
        
        commentsList.innerHTML = this.comments.map(comment => `
            <div class="comment-item d-flex gap-3 mb-3">
                <div class="flex-shrink-0">
                    <div class="avatar ${comment.avatar} rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                        <span class="text-white fw-bold">${comment.initials}</span>
                    </div>
                </div>
                <div class="flex-grow-1">
                    <div class="d-flex align-items-center gap-2 mb-1">
                        <h6 class="mb-0 fw-bold">${comment.author}</h6>
                        <small class="text-muted">${comment.time}</small>
                    </div>
                    <p class="mb-2">${comment.content}</p>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary" onclick="videoManager.likeComment(${comment.id})">
                            <i class="bi bi-hand-thumbs-up me-1"></i>Like (${comment.likes})
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="videoManager.replyComment(${comment.id})">
                            <i class="bi bi-reply me-1"></i>Reply
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    updateCommentCount() {
        const commentCount = document.querySelector('h5.fw-bold');
        if (commentCount) {
            commentCount.textContent = `Comments (${this.comments.length})`;
        }
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
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// Initialize video manager when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.videoManager = new VideoManager();
});

// Global function to reinitialize video player
window.reinitializeVideoPlayer = function() {
    if (window.videoManager) {
        window.videoManager.init();
    }
};
