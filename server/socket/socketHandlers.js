const Room = require('../models/Room');

module.exports = (io) => {
  const userSockets = {};

  io.on('connection', (socket) => {
    let roomId = '';

    socket.on('join-room', async (data) => {
      roomId = data.roomId;
      socket.join(roomId);
      userSockets[socket.id] = roomId;
      const room = await Room.findOne({ roomId });

      // send existing drawing data
      socket.emit('initial-drawing', room?.drawingData || []);
      io.to(roomId).emit('user-count', io.sockets.adapter.rooms.get(roomId)?.size || 1);
    });

    socket.on('cursor-move', (cursorData) => {
      socket.to(roomId).emit('cursor-update', { id: socket.id, ...cursorData });
    });

    socket.on('draw-start', (data) => socket.to(roomId).emit('draw-start', data));
    socket.on('draw-move', async (data) => {
      await Room.updateOne({ roomId }, {
        $push: {
          drawingData: {
            type: 'stroke',
            data,
            timestamp: new Date(),
          },
        },
      });
      socket.to(roomId).emit('draw-move', data);
    });
    socket.on('draw-end', () => socket.to(roomId).emit('draw-end'));

    socket.on('clear-canvas', async () => {
      await Room.updateOne({ roomId }, {
        $push: {
          drawingData: {
            type: 'clear',
            timestamp: new Date(),
          },
        },
      });
      io.to(roomId).emit('canvas-cleared');
    });

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-count', io.sockets.adapter.rooms.get(roomId)?.size || 0);
      delete userSockets[socket.id];
    });
  });
};
