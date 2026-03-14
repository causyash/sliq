let io;

module.exports = {
  init: (server) => {
    io = require('socket.io')(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
      },
    });
    
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      socket.on('join_workspace', (workspaceId) => {
        socket.join(workspaceId);
        console.log(`User ${socket.id} joined workspace ${workspaceId}`);
      });

      socket.on('join_project', (projectId) => {
        socket.join(projectId);
        console.log(`User ${socket.id} joined project ${projectId}`);
      });

      socket.on('join_user', (userId) => {
        socket.join(userId);
        console.log(`User ${socket.id} joined user room ${userId}`);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized');
    }
    return io;
  },
};
