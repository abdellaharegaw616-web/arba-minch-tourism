import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(token) {
    if (this.socket && this.connected) {
      return this.socket;
    }

    this.socket = io('http://localhost:5000', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    this.setupEventListeners();
    return this.socket;
  }

  setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.connected = false;
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Chat events
  joinChatRoom(bookingId) {
    if (this.socket && this.connected) {
      this.socket.emit('join_chat', { bookingId });
    }
  }

  leaveChatRoom(bookingId) {
    if (this.socket && this.connected) {
      this.socket.emit('leave_chat', { bookingId });
    }
  }

  sendMessage(bookingId, message) {
    if (this.socket && this.connected) {
      this.socket.emit('send_message', { bookingId, message });
    }
  }

  onMessage(callback) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  onUserStopTyping(callback) {
    if (this.socket) {
      this.socket.on('user_stop_typing', callback);
    }
  }

  sendTyping(bookingId) {
    if (this.socket && this.connected) {
      this.socket.emit('typing', { bookingId });
    }
  }

  sendStopTyping(bookingId) {
    if (this.socket && this.connected) {
      this.socket.emit('stop_typing', { bookingId });
    }
  }

  // Translation events
  startTranslationSession(bookingId) {
    if (this.socket && this.connected) {
      this.socket.emit('start_translation', { bookingId });
    }
  }

  endTranslationSession(sessionId) {
    if (this.socket && this.connected) {
      this.socket.emit('end_translation', { sessionId });
    }
  }

  onTranslationRequest(callback) {
    if (this.socket) {
      this.socket.on('translation_request', callback);
    }
  }

  onTranslationResponse(callback) {
    if (this.socket) {
      this.socket.on('translation_response', callback);
    }
  }

  // Admin events
  joinAdminRoom() {
    if (this.socket && this.connected) {
      this.socket.emit('join_admin');
    }
  }

  onNewBooking(callback) {
    if (this.socket) {
      this.socket.on('new_booking', callback);
    }
  }

  onBookingUpdate(callback) {
    if (this.socket) {
      this.socket.on('booking_update', callback);
    }
  }

  onNewUser(callback) {
    if (this.socket) {
      this.socket.on('new_user', callback);
    }
  }

  // Notification events
  onNotification(callback) {
    if (this.socket) {
      this.socket.on('notification', callback);
    }
  }

  // Utility methods
  isConnected() {
    return this.connected;
  }

  getSocket() {
    return this.socket;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
