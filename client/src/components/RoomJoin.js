// RoomJoin.js
import React, { useState } from 'react';
import axios from 'axios';

const RoomJoin = ({ onJoin }) => {
  const [roomId, setRoomId] = useState('');

  const joinRoom = async () => {
    if (!roomId) return;
    await axios.post('http://localhost:8000/api/rooms/join', { roomId });
    onJoin(roomId);
  };

  return (
    <div>
      <h2>Enter Room Code</h2>
      <input value={roomId} onChange={(e) => setRoomId(e.target.value)} />
      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
};

export default RoomJoin;
