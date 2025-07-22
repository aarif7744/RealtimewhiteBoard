import React, { useRef, useEffect, useState } from 'react';
import socket from '../socket';

const DrawingCanvas = ({ roomId }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);
  const [color] = useState('black');
  const [strokeWidth, setStrokeWidth] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 100;

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;

    socket.on('initial-drawing', (drawingData) => {
      drawingData.forEach(cmd => {
        if (cmd.type === 'stroke') {
          const { x0, y0, x1, y1, color, width } = cmd.data;
          drawLine(x0, y0, x1, y1, color, width);
        } else if (cmd.type === 'clear') {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      });
    });

    socket.on('draw-move', ({ x0, y0, x1, y1, color, width }) => {
      drawLine(x0, y0, x1, y1, color, width);
    });

    socket.on('canvas-cleared', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      socket.off('initial-drawing');
      socket.off('draw-move');
      socket.off('canvas-cleared');
    };
  }, []);

  const drawLine = (x0, y0, x1, y1, color, width) => {
    const ctx = ctxRef.current;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  };

  const getMousePos = (e) => ({ x: e.clientX, y: e.clientY });
  let prevPos = { x: 0, y: 0 };

  const handleMouseDown = (e) => {
    drawing.current = true;
    prevPos = getMousePos(e);
    socket.emit('draw-start', {});
  };

  const handleMouseMove = (e) => {
    if (!drawing.current) {
      socket.emit('cursor-move', { x: e.clientX, y: e.clientY });
      return;
    }

    const currPos = getMousePos(e);
    drawLine(prevPos.x, prevPos.y, currPos.x, currPos.y, color, strokeWidth);
    socket.emit('draw-move', {
      x0: prevPos.x,
      y0: prevPos.y,
      x1: currPos.x,
      y1: currPos.y,
      color,
      width: strokeWidth
    });
    prevPos = currPos;
  };

  const handleMouseUp = () => {
    drawing.current = false;
    socket.emit('draw-end');
  };

  // 🧹 Clear Canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clear-canvas');
  };

  // ➕ Increase Brush Width
  const increaseWidth = () => {
    setStrokeWidth(prev => Math.min(prev + 1, 20));
  };

  // ➖ Decrease Brush Width
  const decreaseWidth = () => {
    setStrokeWidth(prev => Math.max(prev - 1, 1));
  };

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <button onClick={clearCanvas}>🧹 Clear</button>
        <button onClick={decreaseWidth}>➖</button>
        <span style={{ margin: '0 10px' }}>Width: {strokeWidth}</span>
        <button onClick={increaseWidth}>➕</button>
      </div>

      <canvas
        ref={canvasRef}
        style={{
          border: '1px solid #ccc',
          backgroundColor: 'white',
          display: 'block',
          cursor: 'crosshair',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default DrawingCanvas;
