// Comments functionality
class CommentsManager {
    constructor() {
        this.comments = [];
        this.currentUser = null;
        this.replyTo = null;
        this.init();
    }
    
    init() {
        this.loadUserSession();
        this.loadComments();
        this.setupEventListeners();
    }
    
    loadUserSession() {
        const userSession = localStorage.getItem('userSession');
        if (userSession) {
            this.currentUser = JSON.parse(userSession);
        } else {
        }
    }
    
    setupEventListeners() {
        const commentForm = document.getElementById('commentForm');
        const commentInput = document.getElementById('commentInput');
        
        if (commentForm) {
            commentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addComment();
            });
        }
        
        if (commentInput) {
            commentInput.addEventListener('input', () => {
                this.updateCharacterCount();
            });
            
            commentInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.addComment();
                }
            });
        }
        
        // Filter comments
        const filterSelect = document.getElementById('commentFilter');
        if (filterSelect) {
            filterSelect.addEventListener('change', () => {
                this.filterComments(filterSelect.value);
            });
        }
        
        // Sort comments
        const sortSelect = document.getElementById('commentSort');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                this.sortComments(sortSelect.value);
            });
        }
    }
    
    addComment() {
        const commentInput = document.getElementById('commentInput');
        const commentText = commentInput?.value.trim();
        
        if (!commentText) return;
        
        const newComment = {
            id: Date.now(),
            text: commentText,
            author: this.currentUser.email,
            authorName: this.currentUser.email.split('@')[0],
            timestamp: new Date().toISOString(),
            likes: 0,
            dislikes: 0,
            replies: [],
            isEdited: false,
            editHistory: []
        };
        
        // Add reply if replying to another comment
        if (this.replyTo) {
            const parentComment = this.comments.find(c => c.id === this.replyTo);
            if (parentComment) {
                parentComment.replies.push(newComment);
                this.saveComments();
                this.displayComments();
                this.clearReplyTo();
                return;
            }
        }
        
        this.comments.unshift(newComment);
        this.saveComments();
        this.displayComments();
        
        // Clear input
        if (commentInput) {
            commentInput.value = '';
            this.updateCharacterCount();
        }
        
        this.showNotification('Comment added successfully', 'success');
    }
    
    displayComments() {
        const commentsContainer = document.getElementById('commentsContainer');
        if (!commentsContainer) return;
        
        commentsContainer.innerHTML = '';
        
        this.comments.forEach(comment => {
            const commentElement = this.createCommentElement(comment);
            commentsContainer.appendChild(commentElement);
        });
        
        this.updateCommentCount();
    }
    
    createCommentElement(comment) {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment mb-4';
        commentDiv.dataset.commentId = comment.id;
        
        const isOwnComment = comment.author === this.currentUser.email;
        const isEdited = comment.isEdited;
        
        commentDiv.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div class="d-flex align-items-center">
                            <div class="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                                ${comment.authorName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h6 class="mb-0 fw-bold">${comment.authorName}</h6>
                                <small class="text-muted">
                                    ${this.formatTime(comment.timestamp)}
                                    ${isEdited ? ' (edited)' : ''}
                                </small>
                            </div>
                        </div>
                        ${isOwnComment ? `
                            <div class="dropdown">
                                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                    <i class="bi bi-three-dots"></i>
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#" onclick="commentsManager.editComment(${comment.id})">
                                        <i class="bi bi-pencil me-2"></i>Edit
                                    </a></li>
                                    <li><a class="dropdown-item" href="#" onclick="commentsManager.deleteComment(${comment.id})">
                                        <i class="bi bi-trash me-2"></i>Delete
                                    </a></li>
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="comment-text mb-3">
                        <p class="mb-0" id="comment-text-${comment.id}">${this.escapeHtml(comment.text)}</p>
                        <div class="edit-form" id="edit-form-${comment.id}" style="display: none;">
                            <textarea class="form-control mb-2" id="edit-input-${comment.id}" rows="3">${this.escapeHtml(comment.text)}</textarea>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-primary" onclick="commentsManager.saveEdit(${comment.id})">Save</button>
                                <button class="btn btn-sm btn-secondary" onclick="commentsManager.cancelEdit(${comment.id})">Cancel</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="comment-actions d-flex align-items-center gap-3">
                        <button class="btn btn-sm btn-outline-primary" onclick="commentsManager.likeComment(${comment.id})">
                            <i class="bi bi-hand-thumbs-up"></i> ${comment.likes}
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="commentsManager.dislikeComment(${comment.id})">
                            <i class="bi bi-hand-thumbs-down"></i> ${comment.dislikes}
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="commentsManager.replyToComment(${comment.id})">
                            <i class="bi bi-reply"></i> Reply
                        </button>
                        <button class="btn btn-sm btn-outline-warning" onclick="commentsManager.shareComment(${comment.id})">
                            <i class="bi bi-share"></i> Share
                        </button>
                    </div>
                    
                    ${comment.replies.length > 0 ? `
                        <div class="replies mt-3">
                            <h6 class="text-muted mb-2">Replies (${comment.replies.length})</h6>
                            ${comment.replies.map(reply => this.createReplyElement(reply)).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        return commentDiv;
    }
    
    createReplyElement(reply) {
        const isOwnReply = reply.author === this.currentUser.email;
        
        return `
            <div class="reply ms-4 mb-2 p-3 bg-light rounded">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="d-flex align-items-center">
                        <div class="avatar bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 30px; height: 30px;">
                            ${reply.authorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <small class="fw-bold">${reply.authorName}</small>
                            <br>
                            <small class="text-muted">${this.formatTime(reply.timestamp)}</small>
                        </div>
                    </div>
                    ${isOwnReply ? `
                        <button class="btn btn-sm btn-outline-danger" onclick="commentsManager.deleteReply(${reply.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    ` : ''}
                </div>
                <p class="mb-0 mt-2">${this.escapeHtml(reply.text)}</p>
            </div>
        `;
    }
    
    likeComment(commentId) {
        const comment = this.comments.find(c => c.id === commentId);
        if (comment) {
            comment.likes++;
            this.saveComments();
            this.displayComments();
        }
    }
    
    dislikeComment(commentId) {
        const comment = this.comments.find(c => c.id === commentId);
        if (comment) {
            comment.dislikes++;
            this.saveComments();
            this.displayComments();
        }
    }
    
    replyToComment(commentId) {
        this.replyTo = commentId;
        const commentInput = document.getElementById('commentInput');
        const replyIndicator = document.getElementById('replyIndicator');
        
        if (commentInput) {
            commentInput.placeholder = `Replying to comment...`;
            commentInput.focus();
        }
        
        if (replyIndicator) {
            replyIndicator.style.display = 'block';
            replyIndicator.innerHTML = `
                <div class="alert alert-info alert-dismissible fade show">
                    Replying to a comment
                    <button type="button" class="btn-close" onclick="commentsManager.clearReplyTo()"></button>
                </div>
            `;
        }
    }
    
    clearReplyTo() {
        this.replyTo = null;
        const commentInput = document.getElementById('commentInput');
        const replyIndicator = document.getElementById('replyIndicator');
        
        if (commentInput) {
            commentInput.placeholder = 'Write a comment...';
        }
        
        if (replyIndicator) {
            replyIndicator.style.display = 'none';
        }
    }
    
    editComment(commentId) {
        const comment = this.comments.find(c => c.id === commentId);
        if (!comment) return;
        
        const commentText = document.getElementById(`comment-text-${commentId}`);
        const editForm = document.getElementById(`edit-form-${commentId}`);
        
        if (commentText && editForm) {
            commentText.style.display = 'none';
            editForm.style.display = 'block';
        }
    }
    
    saveEdit(commentId) {
        const comment = this.comments.find(c => c.id === commentId);
        if (!comment) return;
        
        const editInput = document.getElementById(`edit-input-${commentId}`);
        const newText = editInput?.value.trim();
        
        if (!newText) return;
        
        // Save edit history
        comment.editHistory.push({
            previousText: comment.text,
            editTime: new Date().toISOString()
        });
        
        comment.text = newText;
        comment.isEdited = true;
        comment.timestamp = new Date().toISOString();
        
        this.saveComments();
        this.displayComments();
        this.showNotification('Comment updated successfully', 'success');
    }
    
    cancelEdit(commentId) {
        const commentText = document.getElementById(`comment-text-${commentId}`);
        const editForm = document.getElementById(`edit-form-${commentId}`);
        
        if (commentText && editForm) {
            commentText.style.display = 'block';
            editForm.style.display = 'none';
        }
    }
    
    deleteComment(commentId) {
        if (confirm('Are you sure you want to delete this comment?')) {
            this.comments = this.comments.filter(c => c.id !== commentId);
            this.saveComments();
            this.displayComments();
            this.showNotification('Comment deleted successfully', 'success');
        }
    }
    
    deleteReply(replyId) {
        if (confirm('Are you sure you want to delete this reply?')) {
            this.comments.forEach(comment => {
                comment.replies = comment.replies.filter(r => r.id !== replyId);
            });
            this.saveComments();
            this.displayComments();
            this.showNotification('Reply deleted successfully', 'success');
        }
    }
    
    shareComment(commentId) {
        const comment = this.comments.find(c => c.id === commentId);
        if (!comment) return;
        
        const shareText = `${comment.authorName}: ${comment.text}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Comment from CoderBoost',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('Comment copied to clipboard', 'success');
            });
        }
    }
    
    filterComments(filter) {
        let filteredComments = [...this.comments];
        
        switch (filter) {
            case 'recent':
                filteredComments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                break;
            case 'popular':
                filteredComments.sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes));
                break;
            case 'controversial':
                filteredComments.sort((a, b) => Math.abs(a.likes - a.dislikes) - Math.abs(b.likes - b.dislikes));
                break;
            case 'my-comments':
                filteredComments = this.comments.filter(c => c.author === this.currentUser.email);
                break;
        }
        
        this.displayFilteredComments(filteredComments);
    }
    
    sortComments(sort) {
        let sortedComments = [...this.comments];
        
        switch (sort) {
            case 'newest':
                sortedComments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                break;
            case 'oldest':
                sortedComments.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                break;
            case 'most-liked':
                sortedComments.sort((a, b) => b.likes - a.likes);
                break;
            case 'most-replied':
                sortedComments.sort((a, b) => b.replies.length - a.replies.length);
                break;
        }
        
        this.displayFilteredComments(sortedComments);
    }
    
    displayFilteredComments(comments) {
        const commentsContainer = document.getElementById('commentsContainer');
        if (!commentsContainer) return;
        
        commentsContainer.innerHTML = '';
        
        if (comments.length === 0) {
            commentsContainer.innerHTML = `
                <div class="text-center text-muted py-5">
                    <i class="bi bi-chat-dots display-4"></i>
                    <p class="mt-3">No comments found</p>
                </div>
            `;
            return;
        }
        
        comments.forEach(comment => {
            const commentElement = this.createCommentElement(comment);
            commentsContainer.appendChild(commentElement);
        });
    }
    
    updateCharacterCount() {
        const commentInput = document.getElementById('commentInput');
        const charCount = document.getElementById('charCount');
        
        if (commentInput && charCount) {
            const remaining = 500 - commentInput.value.length;
            charCount.textContent = remaining;
            
            if (remaining < 0) {
                charCount.classList.add('text-danger');
            } else {
                charCount.classList.remove('text-danger');
            }
        }
    }
    
    updateCommentCount() {
        const commentCount = document.getElementById('commentCount');
        if (commentCount) {
            const totalComments = this.comments.length + this.comments.reduce((sum, c) => sum + c.replies.length, 0);
            commentCount.textContent = totalComments;
        }
    }
    
    saveComments() {
        localStorage.setItem('comments', JSON.stringify(this.comments));
    }
    
    loadComments() {
        const savedComments = localStorage.getItem('comments');
        this.comments = savedComments ? JSON.parse(savedComments) : [];
        this.displayComments();
    }
    
    clearAllComments() {
        if (confirm('Are you sure you want to clear all comments? This action cannot be undone.')) {
            this.comments = [];
            this.saveComments();
            this.displayComments();
            this.showNotification('All comments cleared', 'success');
        }
    }
    
    exportComments() {
        const exportData = {
            comments: this.comments,
            exportDate: new Date().toISOString(),
            totalComments: this.comments.length,
            totalReplies: this.comments.reduce((sum, c) => sum + c.replies.length, 0)
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `comments-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('Comments exported successfully', 'success');
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return date.toLocaleDateString();
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

// Initialize comments manager
let commentsManager;

document.addEventListener('DOMContentLoaded', function() {
    commentsManager = new CommentsManager();
});

// Global functions for HTML onclick handlers
function addComment() {
    if (commentsManager) {
        commentsManager.addComment();
    }
}

function clearAllComments() {
    if (commentsManager) {
        commentsManager.clearAllComments();
    }
}

function exportComments() {
    if (commentsManager) {
        commentsManager.exportComments();
    }
}
