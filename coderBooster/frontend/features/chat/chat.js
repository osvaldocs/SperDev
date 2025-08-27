// Chat functionality
class ChatManager {
    constructor() {
        this.messages = [];
        this.currentUser = null;
        this.isTyping = false;
        this.typingTimeout = null;
        this.init();
    }
    
    init() {
        this.loadUserSession();
        this.setupEventListeners();
        this.loadChatHistory();
        this.startTypingIndicator();
    }
    
    loadUserSession() {
        const userSession = localStorage.getItem('userSession');
        if (userSession) {
            this.currentUser = JSON.parse(userSession);
        } else {
        }
    }
    
    setupEventListeners() {
        const chatForm = document.getElementById('chatForm');
        const messageInput = document.getElementById('messageInput');
        
        if (chatForm) {
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendMessage();
            });
        }
        
        if (messageInput) {
            messageInput.addEventListener('input', () => {
                this.handleTyping();
            });
            
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
        
        // Emoji picker
        const emojiBtn = document.getElementById('emojiBtn');
        if (emojiBtn) {
            emojiBtn.addEventListener('click', () => {
                this.toggleEmojiPicker();
            });
        }
        
        // File upload
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files[0]);
            });
        }
    }
    
    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput?.value.trim();
        
        if (!message) return;
        
        const newMessage = {
            id: Date.now(),
            text: message,
            sender: this.currentUser.email,
            timestamp: new Date().toISOString(),
            type: 'text'
        };
        
        this.addMessageToChat(newMessage);
        this.saveMessage(newMessage);
        
        // Clear input
        if (messageInput) {
            messageInput.value = '';
        }
        
        // Simulate AI response
        this.simulateAIResponse(message);
    }
    
    addMessageToChat(message) {
        const chatContainer = document.getElementById('chatContainer');
        if (!chatContainer) return;
        
        const messageElement = this.createMessageElement(message);
        chatContainer.appendChild(messageElement);
        
        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // Add to messages array
        this.messages.push(message);
    }
    
    createMessageElement(message) {
        const messageDiv = document.createElement('div');
        const isOwnMessage = message.sender === this.currentUser.email;
        
        messageDiv.className = `message ${isOwnMessage ? 'own-message' : 'other-message'} mb-3`;
        messageDiv.innerHTML = `
            <div class="d-flex ${isOwnMessage ? 'justify-content-end' : 'justify-content-start'}">
                <div class="message-bubble ${isOwnMessage ? 'bg-primary text-white' : 'bg-light'} rounded p-3" style="max-width: 70%;">
                    <div class="message-text">${this.escapeHtml(message.text)}</div>
                    <div class="message-time small ${isOwnMessage ? 'text-white-50' : 'text-muted'} mt-1">
                        ${this.formatTime(message.timestamp)}
                    </div>
                </div>
            </div>
        `;
        
        return messageDiv;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    saveMessage(message) {
        const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        chatHistory.push(message);
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
    
    loadChatHistory() {
        const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        this.messages = chatHistory;
        
        // Display messages
        chatHistory.forEach(message => {
            this.addMessageToChat(message);
        });
    }
    
    simulateAIResponse(userMessage) {
        // Simulate typing indicator
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.hideTypingIndicator();
            
            const aiResponses = [
                "That's a great question! Let me help you with that.",
                "I understand what you're asking. Here's what I think...",
                "Interesting point! Have you considered trying...",
                "I can see you're working on this. Here's a tip...",
                "Great progress! For the next step, I recommend..."
            ];
            
            const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
            
            const aiMessage = {
                id: Date.now(),
                text: randomResponse,
                sender: 'ai-assistant',
                timestamp: new Date().toISOString(),
                type: 'text'
            };
            
            this.addMessageToChat(aiMessage);
            this.saveMessage(aiMessage);
        }, 2000 + Math.random() * 3000);
    }
    
    handleTyping() {
        if (!this.isTyping) {
            this.isTyping = true;
            this.showTypingIndicator();
        }
        
        // Clear existing timeout
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
        }
        
        // Set new timeout
        this.typingTimeout = setTimeout(() => {
            this.isTyping = false;
            this.hideTypingIndicator();
        }, 1000);
    }
    
    showTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'block';
        }
    }
    
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'none';
        }
    }
    
    startTypingIndicator() {
        const chatContainer = document.getElementById('chatContainer');
        if (!chatContainer) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typingIndicator';
        typingDiv.className = 'message mb-3';
        typingDiv.style.display = 'none';
        typingDiv.innerHTML = `
            <div class="d-flex justify-content-start">
                <div class="message-bubble bg-light rounded p-3">
                    <div class="typing-dots">
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                    </div>
                </div>
            </div>
        `;
        
        chatContainer.appendChild(typingDiv);
    }
    
    toggleEmojiPicker() {
        // Simple emoji picker implementation
        const emojis = ['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🔥', '💯', '🎉'];
        const emojiPicker = document.getElementById('emojiPicker');
        
        if (emojiPicker) {
            emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
            
            if (emojiPicker.style.display === 'block') {
                emojiPicker.innerHTML = emojis.map(emoji => 
                    `<button class="btn btn-sm btn-outline-secondary me-1 mb-1" onclick="chatManager.insertEmoji('${emoji}')">${emoji}</button>`
                ).join('');
            }
        }
    }
    
    insertEmoji(emoji) {
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.value += emoji;
            messageInput.focus();
        }
        
        // Hide emoji picker
        const emojiPicker = document.getElementById('emojiPicker');
        if (emojiPicker) {
            emojiPicker.style.display = 'none';
        }
    }
    
    handleFileUpload(file) {
        if (!file) return;
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('File size must be less than 5MB', 'error');
            return;
        }
        
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
        if (!allowedTypes.includes(file.type)) {
            this.showNotification('File type not supported', 'error');
            return;
        }
        
        const fileMessage = {
            id: Date.now(),
            text: `File: ${file.name}`,
            sender: this.currentUser.email,
            timestamp: new Date().toISOString(),
            type: 'file',
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
        };
        
        this.addMessageToChat(fileMessage);
        this.saveMessage(fileMessage);
        
        this.showNotification('File uploaded successfully', 'success');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
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
    
    clearChat() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            localStorage.removeItem('chatHistory');
            this.messages = [];
            
            const chatContainer = document.getElementById('chatContainer');
            if (chatContainer) {
                chatContainer.innerHTML = '';
            }
            
            this.showNotification('Chat history cleared', 'success');
        }
    }
    
    exportChat() {
        const chatData = {
            messages: this.messages,
            exportDate: new Date().toISOString(),
            user: this.currentUser.email
        };
        
        const dataStr = JSON.stringify(chatData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('Chat exported successfully', 'success');
    }
}

// Initialize chat manager
let chatManager;

document.addEventListener('DOMContentLoaded', function() {
    chatManager = new ChatManager();
});

// Global functions for HTML onclick handlers
function sendMessage() {
    if (chatManager) {
        chatManager.sendMessage();
    }
}

function clearChat() {
    if (chatManager) {
        chatManager.clearChat();
    }
}

function exportChat() {
    if (chatManager) {
        chatManager.exportChat();
    }
}
