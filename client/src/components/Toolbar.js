import React, { useState } from 'react';
import socket from '../socket';

const Toolbar = () => {
  const [color, setColor] = useState('black');
  const [strokeWidth, setStrokeWidth] = useState(2);

  // Share color and stroke width globally (basic global state via window)
  window.drawingSettings = { color, strokeWidth };

  const clearCanvas = () => {
    socket.emit('clear-canvas');
  };

  return (
    <div style={{ display: 'flex', gap: 10, padding: 10 }}>
      <label>
        Color:
        <select value={color} onChange={(e) => {
          setColor(e.target.value);
          window.drawingSettings.color = e.target.value;
        }}>
          <option value="black">Black</option>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
        </select>
      </label>

      <label>
        Width:
        <input
          type="range"
          min="1"
          max="10"
          value={strokeWidth}
          onChange={(e) => {
            setStrokeWidth(e.target.value);
            window.drawingSettings.strokeWidth = parseInt(e.target.value);
          }}
        />
      </label>

      <button onClick={clearCanvas}>Clear</button>
    </div>
  );
};

export default Toolbar;
