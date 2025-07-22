import React, { useState } from 'react';
import RoomJoin from './components/RoomJoin';
import Whiteboard from './components/Whiteboard';

function App() {
  const [roomId, setRoomId] = useState(null);
  return roomId ? <Whiteboard roomId={roomId} /> : <RoomJoin onJoin={setRoomId} />;
}

export default App;
