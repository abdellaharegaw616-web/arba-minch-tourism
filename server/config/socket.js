const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class SocketManager {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map();
    this.chatRooms = new Map();
    this.typingUsers = new Map();
    this.translationSessions = new Map();
  }

  initialize(server) {
    this.io = socketIo(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    this.setupMiddleware();
    this.setupEventHandlers();
    
    console.log('🔌 Socket.IO server initialized');
    return this.io;
  }

  setupMiddleware() {
    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        
        if (!token) {
          return next(new Error('Authentication token required'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_here');
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
          return next(new Error('User not found'));
        }

        socket.user = user;
        next();
      } catch (error) {
        console.error('Socket authentication error:', error);
        next(new Error('Invalid authentication token'));
      }
    });
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`👤 User connected: ${socket.user.email} (${socket.id})`);
      
      // Add user to connected users
      this.connectedUsers.set(socket.user.id, {
        socketId: socket.id,
        user: socket.user,
        connectedAt: new Date()
      });

      // Emit updated online users list
      this.emitOnlineUsers();

      // Setup user-specific event handlers
      this.setupUserEventHandlers(socket);

      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleDisconnection(socket);
      });
    });
  }

  setupUserEventHandlers(socket) {
    // Chat events
    socket.on('join_chat', (data) => {
      this.handleJoinChat(socket, data);
    });

    socket.on('leave_chat', (data) => {
      this.handleLeaveChat(socket, data);
    });

    socket.on('send_message', (data) => {
      this.handleSendMessage(socket, data);
    });

    socket.on('typing', (data) => {
      this.handleTyping(socket, data);
    });

    socket.on('stop_typing', (data) => {
      this.handleStopTyping(socket, data);
    });

    // Translation events
    socket.on('start_translation', (data) => {
      this.handleStartTranslation(socket, data);
    });

    socket.on('end_translation', (data) => {
      this.handleEndTranslation(socket, data);
    });

    // Admin events
    socket.on('join_admin', () => {
      this.handleJoinAdmin(socket);
    });
  }

  handleJoinChat(socket, data) {
    const { bookingId } = data;
    
    // Join socket room
    socket.join(`booking_${bookingId}`);
    
    // Add to chat room
    if (!this.chatRooms.has(bookingId)) {
      this.chatRooms.set(bookingId, new Set());
    }
    this.chatRooms.get(bookingId).add(socket.user.id);

    console.log(`💬 User ${socket.user.email} joined chat room ${bookingId}`);
    
    // Notify others in the room
    socket.to(`booking_${bookingId}`).emit('user_joined', {
      user: {
        id: socket.user.id,
        name: socket.user.name,
        email: socket.user.email
      },
      timestamp: new Date()
    });
  }

  handleLeaveChat(socket, data) {
    const { bookingId } = data;
    
    // Leave socket room
    socket.leave(`booking_${bookingId}`);
    
    // Remove from chat room
    if (this.chatRooms.has(bookingId)) {
      this.chatRooms.get(bookingId).delete(socket.user.id);
      
      // Clean up empty rooms
      if (this.chatRooms.get(bookingId).size === 0) {
        this.chatRooms.delete(bookingId);
      }
    }

    console.log(`👋 User ${socket.user.email} left chat room ${bookingId}`);
    
    // Notify others in the room
    socket.to(`booking_${bookingId}`).emit('user_left', {
      user: {
        id: socket.user.id,
        name: socket.user.name,
        email: socket.user.email
      },
      timestamp: new Date()
    });
  }

  handleSendMessage(socket, data) {
    const { bookingId, message } = data;
    
    const messageData = {
      id: Date.now().toString(),
      bookingId,
      sender: {
        id: socket.user.id,
        name: socket.user.name,
        email: socket.user.email,
        role: socket.user.role
      },
      text: message.text,
      timestamp: new Date(),
      type: message.type || 'text'
    };

    // Send to all users in the chat room
    this.io.to(`booking_${bookingId}`).emit('new_message', messageData);
    
    console.log(`💬 Message sent in booking ${bookingId} by ${socket.user.email}`);
  }

  handleTyping(socket, data) {
    const { bookingId } = data;
    
    // Add to typing users
    const typingKey = `${bookingId}_${socket.user.id}`;
    this.typingUsers.set(typingKey, true);

    // Notify others in the room
    socket.to(`booking_${bookingId}`).emit('user_typing', {
      user: {
        id: socket.user.id,
        name: socket.user.name
      },
      bookingId,
      timestamp: new Date()
    });
  }

  handleStopTyping(socket, data) {
    const { bookingId } = data;
    
    // Remove from typing users
    const typingKey = `${bookingId}_${socket.user.id}`;
    this.typingUsers.delete(typingKey);

    // Notify others in the room
    socket.to(`booking_${bookingId}`).emit('user_stop_typing', {
      user: {
        id: socket.user.id,
        name: socket.user.name
      },
      bookingId,
      timestamp: new Date()
    });
  }

  handleStartTranslation(socket, data) {
    const { bookingId } = data;
    
    const sessionId = Date.now().toString();
    this.translationSessions.set(sessionId, {
      id: sessionId,
      bookingId,
      user: socket.user,
      startedAt: new Date(),
      active: true
    });

    socket.emit('translation_session_started', {
      sessionId,
      bookingId,
      timestamp: new Date()
    });

    console.log(`🔄 Translation session started: ${sessionId} for booking ${bookingId}`);
  }

  handleEndTranslation(socket, data) {
    const { sessionId } = data;
    
    if (this.translationSessions.has(sessionId)) {
      const session = this.translationSessions.get(sessionId);
      session.active = false;
      session.endedAt = new Date();

      socket.emit('translation_session_ended', {
        sessionId,
        bookingId: session.bookingId,
        duration: session.endedAt - session.startedAt,
        timestamp: new Date()
      });

      this.translationSessions.delete(sessionId);
      
      console.log(`🔄 Translation session ended: ${sessionId}`);
    }
  }

  handleJoinAdmin(socket) {
    if (socket.user.role === 'admin') {
      socket.join('admin_room');
      
      socket.emit('admin_joined', {
        message: 'Joined admin room',
        timestamp: new Date()
      });

      console.log(`👑 Admin ${socket.user.email} joined admin room`);
    } else {
      socket.emit('error', {
        message: 'Access denied. Admin privileges required.',
        timestamp: new Date()
      });
    }
  }

  handleDisconnection(socket) {
    // Remove from connected users
    this.connectedUsers.delete(socket.user.id);
    
    // Remove from all chat rooms
    for (const [bookingId, users] of this.chatRooms.entries()) {
      if (users.has(socket.user.id)) {
        users.delete(socket.user.id);
        
        // Notify others in the room
        socket.to(`booking_${bookingId}`).emit('user_left', {
          user: {
            id: socket.user.id,
            name: socket.user.name,
            email: socket.user.email
          },
          timestamp: new Date()
        });

        // Clean up empty rooms
        if (users.size === 0) {
          this.chatRooms.delete(bookingId);
        }
      }
    }

    // Remove from typing users
    for (const [key, value] of this.typingUsers.entries()) {
      if (key.includes(socket.user.id)) {
        this.typingUsers.delete(key);
      }
    }

    // End active translation sessions
    for (const [sessionId, session] of this.translationSessions.entries()) {
      if (session.user.id === socket.user.id) {
        session.active = false;
        session.endedAt = new Date();
        this.translationSessions.delete(sessionId);
      }
    }

    this.emitOnlineUsers();
    console.log(`👋 User disconnected: ${socket.user.email} (${socket.id})`);
  }

  emitOnlineUsers() {
    const onlineUsers = Array.from(this.connectedUsers.values()).map(user => ({
      id: user.user.id,
      name: user.user.name,
      email: user.user.email,
      role: user.user.role,
      connectedAt: user.connectedAt
    }));

    this.io.emit('online_users', onlineUsers);
  }

  // Utility methods
  getConnectedUsers() {
    return Array.from(this.connectedUsers.values());
  }

  getChatRoomUsers(bookingId) {
    const room = this.chatRooms.get(bookingId);
    return room ? Array.from(room) : [];
  }

  getActiveTranslationSessions() {
    return Array.from(this.translationSessions.values());
  }

  isUserOnline(userId) {
    return this.connectedUsers.has(userId);
  }

  // Send notification to specific user
  sendToUser(userId, event, data) {
    const user = this.connectedUsers.get(userId);
    if (user) {
      this.io.to(user.socketId).emit(event, data);
    }
  }

  // Send notification to admin room
  sendToAdmin(event, data) {
    this.io.to('admin_room').emit(event, data);
  }

  // Get server statistics
  getStats() {
    return {
      connectedUsers: this.connectedUsers.size,
      activeChatRooms: this.chatRooms.size,
      activeTranslations: this.translationSessions.size,
      typingUsers: this.typingUsers.size
    };
  }
}

// Create singleton instance
const socketManager = new SocketManager();

module.exports = socketManager;
