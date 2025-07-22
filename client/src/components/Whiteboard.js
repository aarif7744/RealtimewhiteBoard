// Whiteboard.js
import React, { useEffect, useState } from 'react';
import DrawingCanvas from './DrawingCanvas';
import Toolbar from './Toolbar';
import UserCursors from './UserCursors';
import socket from '../socket';

const Whiteboard = ({ roomId }) => {
  const [users, setUsers] = useState(1);
  const [cursors, setCursors] = useState({});

  useEffect(() => {
    socket.emit('join-room', { roomId });

    socket.on('user-count', setUsers);
    socket.on('cursor-update', (data) => {
      setCursors(prev => ({ ...prev, [data.id]: data }));
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <div>Room: {roomId} | Active Users: {users}</div>
      <Toolbar />
      <DrawingCanvas roomId={roomId} />
      <UserCursors cursors={cursors} />
    </div>
  );
};

export default Whiteboard;
