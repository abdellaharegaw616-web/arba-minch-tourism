module.exports = (io) => {
  const users = new Map();

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // User joins with their ID
    socket.on('user-join', (userId) => {
      users.set(userId, socket.id);
      console.log(`User ${userId} joined, online: ${users.size}`);
      io.emit('online-users', Array.from(users.keys()));
    });

    // Send message
    socket.on('send-message', (data) => {
      const { to, message, from, fromName, timestamp } = data;
      
      // Save to database
      const Message = require('./models/Message');
      const newMessage = new Message({
        from,
        to,
        message,
        timestamp: new Date(timestamp)
      });
      newMessage.save();

      // Send to recipient if online
      const recipientSocket = users.get(to);
      if (recipientSocket) {
        io.to(recipientSocket).emit('receive-message', {
          from,
          fromName,
          message,
          timestamp
        });
      }

      // Send back to sender for confirmation
      socket.emit('message-sent', { success: true });
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const recipientSocket = users.get(data.to);
      if (recipientSocket) {
        io.to(recipientSocket).emit('user-typing', {
          from: data.from,
          fromName: data.fromName
        });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      let disconnectedUser = null;
      for (let [userId, socketId] of users.entries()) {
        if (socketId === socket.id) {
          disconnectedUser = userId;
          users.delete(userId);
          break;
        }
      }
      console.log(`User ${disconnectedUser} disconnected`);
      io.emit('online-users', Array.from(users.keys()));
    });
  });
};
