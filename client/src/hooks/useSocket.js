import { useState, useEffect, useContext, createContext } from 'react';
import socketService from '../services/socket';

// Create Socket Context
const SocketContext = createContext();

// Custom hook for socket connection
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// Socket Provider Component
export const SocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const socket = socketService.connect(token);
      
      // Update connection status
      socket.on('connect', () => {
        setConnected(true);
      });

      socket.on('disconnect', () => {
        setConnected(false);
        setOnlineUsers([]);
      });

      // Listen for online users
      socket.on('online_users', (users) => {
        setOnlineUsers(users);
      });

      // Listen for typing indicators
      socket.on('typing_users', (users) => {
        setTypingUsers(users);
      });

      // Listen for unread count updates
      socket.on('unread_count', (count) => {
        setUnreadCount(count);
      });

      return () => {
        socketService.disconnect();
      };
    }
  }, []);

  // Join chat room
  const joinChatRoom = (bookingId) => {
    socketService.joinChatRoom(bookingId);
  };

  // Leave chat room
  const leaveChatRoom = (bookingId) => {
    socketService.leaveChatRoom(bookingId);
  };

  // Send message
  const sendMessage = (bookingId, message) => {
    socketService.sendMessage(bookingId, message);
  };

  // Send typing indicator
  const sendTyping = (bookingId) => {
    socketService.sendTyping(bookingId);
  };

  // Send stop typing indicator
  const sendStopTyping = (bookingId) => {
    socketService.sendStopTyping(bookingId);
  };

  // Start translation session
  const startTranslation = (bookingId) => {
    socketService.startTranslationSession(bookingId);
  };

  // End translation session
  const endTranslation = (sessionId) => {
    socketService.endTranslationSession(sessionId);
  };

  // Join admin room (for admin users)
  const joinAdminRoom = () => {
    socketService.joinAdminRoom();
  };

  // Check if user is online
  const isUserOnline = (userId) => {
    return onlineUsers.some(user => user.id === userId);
  };

  // Check if user is typing
  const isUserTyping = (userId) => {
    return typingUsers[userId] || false;
  };

  // Disconnect socket
  const disconnect = () => {
    socketService.disconnect();
    setConnected(false);
    setOnlineUsers([]);
    setTypingUsers({});
  };

  const value = {
    connected,
    onlineUsers,
    typingUsers,
    unreadCount,
    joinChatRoom,
    leaveChatRoom,
    sendMessage,
    sendTyping,
    sendStopTyping,
    startTranslation,
    endTranslation,
    joinAdminRoom,
    isUserOnline,
    isUserTyping,
    disconnect,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

// Hook for chat functionality
export const useChat = (bookingId) => {
  const { sendMessage, sendTyping, sendStopTyping, joinChatRoom, leaveChatRoom } = useSocket();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Join chat room when bookingId changes
  useEffect(() => {
    if (bookingId) {
      joinChatRoom(bookingId);
      
      // Listen for new messages
      socketService.onMessage((message) => {
        if (message.bookingId === bookingId) {
          setMessages(prev => [...prev, message]);
        }
      });

      return () => {
        leaveChatRoom(bookingId);
      };
    }
  }, [bookingId, joinChatRoom, leaveChatRoom]);

  // Send message
  const sendChatMessage = (messageText) => {
    if (messageText.trim()) {
      const message = {
        text: messageText,
        timestamp: new Date(),
        type: 'user'
      };
      
      sendMessage(bookingId, message);
      setMessages(prev => [...prev, message]);
    }
  };

  // Handle typing indicator
  const handleTyping = (text) => {
    if (!isTyping) {
      sendTyping(bookingId);
      setIsTyping(true);
    }

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set new timeout to stop typing after 1 second of inactivity
    const timeout = setTimeout(() => {
      sendStopTyping(bookingId);
      setIsTyping(false);
    }, 1000);

    setTypingTimeout(timeout);
  };

  // Clear messages
  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isTyping,
    sendChatMessage,
    handleTyping,
    clearMessages,
  };
};

// Hook for translation functionality
export const useTranslation = () => {
  const { startTranslation, endTranslation } = useSocket();
  const [isTranslating, setIsTranslating] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [translationHistory, setTranslationHistory] = useState([]);

  // Start translation session
  const startSession = (bookingId) => {
    startTranslation(bookingId);
    setIsTranslating(true);
    setSessionId(Date.now().toString());
  };

  // End translation session
  const endSession = () => {
    if (sessionId) {
      endTranslation(sessionId);
      setIsTranslating(false);
      setSessionId(null);
    }
  };

  // Add translation to history
  const addTranslation = (original, translated, fromLang, toLang) => {
    const translation = {
      id: Date.now(),
      original,
      translated,
      fromLang,
      toLang,
      timestamp: new Date()
    };
    
    setTranslationHistory(prev => [translation, ...prev]);
  };

  // Clear translation history
  const clearHistory = () => {
    setTranslationHistory([]);
  };

  return {
    isTranslating,
    sessionId,
    translationHistory,
    startSession,
    endSession,
    addTranslation,
    clearHistory,
  };
};

export default SocketProvider;
